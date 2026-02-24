using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TradePortal.Api.Dtos;
using TradePortal.Domain.Entities;
using TradePortal.Infrastructure.Data;

namespace TradePortal.Api.Controllers;

/// <summary>
/// إدارة المستخدمين — كل مسؤول يرى ويدير فقط المستخدمين ضمن نطاقه
/// - Admin: كل المستخدمين
/// - ProvinceAdmin: موظفي نفس المحافظة
/// - CentralAuditorAdmin: موظفي التدقيق فقط
/// - IpExpertAdmin: موظفي الملكية فقط
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,ProvinceAdmin,ProvinceEmployee,CentralAuditorAdmin,CentralAuditor,IpExpertAdmin,IpExpert")]
[Tags("إدارة المستخدمين")]
public class UsersController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly ApplicationDbContext _context;

    public UsersController(UserManager<User> userManager, ApplicationDbContext context)
    {
        _userManager = userManager;
        _context = context;
    }

    /// <summary>
    /// جلب قائمة المستخدمين حسب صلاحيات المسؤول الحالي
    /// </summary>
    /// <summary>
    /// جلب قائمة المستخدمين
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<UserListDto>>> GetUsers()
    {
        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null) return Unauthorized();

        var currentRoles = await _userManager.GetRolesAsync(currentUser);
        var primaryRole = currentRoles.FirstOrDefault() ?? "";

        // Determine role filter expressions for server-side query
        IQueryable<string>? allowedRoleNames = null;
        int? filterProvinceId = null;

        switch (primaryRole)
        {
            case "ProvinceAdmin":
                // Show only users in the same province
                filterProvinceId = currentUser.ProvinceId;
                allowedRoleNames = _context.Roles
                    .Where(r => r.Name == "ProvinceEmployee" || r.Name == "ProvinceAdmin")
                    .Select(r => r.Name!);
                break;

            case "CentralAuditorAdmin":
                allowedRoleNames = _context.Roles
                    .Where(r => r.Name == "CentralAuditor" || r.Name == "CentralAuditorAdmin")
                    .Select(r => r.Name!);
                break;

            case "IpExpertAdmin":
                allowedRoleNames = _context.Roles
                    .Where(r => r.Name == "IpExpert" || r.Name == "IpExpertAdmin")
                    .Select(r => r.Name!);
                break;

            case "Admin":
                // Admin sees all — no filter
                break;

            default:
                // Employees should not access user management
                return Forbid();
        }

        // Build user query
        IQueryable<User> usersQuery;

        if (allowedRoleNames != null)
        {
            // Use a join to filter users by their roles — fully server-side
            var userIdsInRoles = _context.UserRoles
                .Join(_context.Roles.Where(r => allowedRoleNames.Contains(r.Name!)),
                    ur => ur.RoleId, r => r.Id, (ur, r) => ur.UserId)
                .Distinct();

            usersQuery = _context.Users
                .Include(u => u.Province)
                .Where(u => userIdsInRoles.Contains(u.Id) && !u.IsDeleted);
        }
        else
        {
            usersQuery = _context.Users
                .Include(u => u.Province)
                .Where(u => !u.IsDeleted);
        }

        // Province filter
        if (filterProvinceId.HasValue)
        {
            usersQuery = usersQuery.Where(u => u.ProvinceId == filterProvinceId);
        }

        var users = await usersQuery.OrderByDescending(u => u.CreatedAt).ToListAsync();

        // Build response with roles
        var result = new List<UserListDto>();
        foreach (var u in users)
        {
            var roles = await _userManager.GetRolesAsync(u);
            result.Add(new UserListDto
            {
                Id = u.Id,
                UserName = u.UserName!,
                Email = u.Email!,
                FullName = u.FullName,
                ProvinceId = u.ProvinceId,
                ProvinceName = u.Province?.NameAr,
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt,
                Roles = roles
            });
        }

        return result;
    }

    /// <summary>
    /// تحديث بيانات مستخدم (تفعيل/تعطيل، تعديل الاسم أو الإيميل)
    /// </summary>
    /// <summary>
    /// تحديث بيانات مستخدم
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateUser(int id, UpdateUserDto dto)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null) return NotFound("المستخدم غير موجود");

        if (dto.FullName != null) user.FullName = dto.FullName;
        if (dto.Email != null) user.Email = dto.Email;
        if (dto.IsActive.HasValue) user.IsActive = dto.IsActive.Value;
        if (dto.ProvinceId.HasValue) user.ProvinceId = dto.ProvinceId.Value == 0 ? null : dto.ProvinceId.Value;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded) return BadRequest(result.Errors);

        if (!string.IsNullOrEmpty(dto.Role))
        {
            var currentRoles = await _userManager.GetRolesAsync(user);
            if (!currentRoles.Contains(dto.Role))
            {
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
                await _userManager.AddToRoleAsync(user, dto.Role);
            }
        }

        return Ok(new { message = "تم تحديث بيانات المستخدم" });
    }

    /// <summary>
    /// إعادة تعيين كلمة المرور الافتراضية للمستخدم
    /// </summary>
    [HttpPost("{id}/reset-password")]
    [Authorize(Roles = "Admin,ProvinceAdmin,CentralAuditorAdmin,IpExpertAdmin")]
    public async Task<ActionResult> ResetPassword(int id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null) return NotFound("المستخدم غير موجود");

        var currentUser = await _userManager.GetUserAsync(User);
        if (user.Id == currentUser!.Id) return BadRequest("لا يمكنك طلب استعادة كلمة مرور لحسابك الشخصي عبر هذه الواجهة");

        // حماية المشرف العام
        var roles = await _userManager.GetRolesAsync(user);
        if (roles.Contains("Admin") && !User.IsInRole("Admin"))
            return Forbid();

        var removeResult = await _userManager.RemovePasswordAsync(user);
        if (!removeResult.Succeeded) return BadRequest(removeResult.Errors);

        var addResult = await _userManager.AddPasswordAsync(user, "Syria@123");
        if (!addResult.Succeeded) return BadRequest(addResult.Errors);

        return Ok(new { message = "تمت إعادة تعيين كلمة المرور بنجاح" });
    }

    /// <summary>
    /// حذف (تعطيل) مستخدم
    /// </summary>
    /// <summary>
    /// تعطيل مستخدم
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeactivateUser(int id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null) return NotFound("المستخدم غير موجود");

        user.IsActive = !user.IsActive; // Toggle State
        await _userManager.UpdateAsync(user);

        return Ok(new { message = user.IsActive ? "تم تفعيل حساب المستخدم" : "تم تعطيل حساب المستخدم" });
    }

    /// <summary>
    /// حذف مستخدم (Soft Delete)
    /// </summary>
    [HttpDelete("{id}/delete")]
    [Authorize(Roles = "Admin,ProvinceAdmin,CentralAuditorAdmin,IpExpertAdmin")]
    public async Task<ActionResult> DeleteUser(int id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null) return NotFound("المستخدم غير موجود");

        var currentUser = await _userManager.GetUserAsync(User);
        if (user.Id == currentUser!.Id) return BadRequest("لا يمكنك حذف حسابك الشخصي");

        // حماية المشرف العام
        var roles = await _userManager.GetRolesAsync(user);
        if (roles.Contains("Admin") && !User.IsInRole("Admin"))
            return Forbid();

        user.IsDeleted = true;
        user.IsActive = false; // Disable as well
        await _userManager.UpdateAsync(user);

        return Ok(new { message = "تم حذف المستخدم بنجاح" });
    }

    /// <summary>
    /// الأدوار المتاحة للمسؤول الحالي لإضافة مستخدمين
    /// </summary>
    /// <summary>
    /// جلب الأدوار المتاحة للمسؤول الحالي
    /// </summary>
    [HttpGet("available-roles")]
    public async Task<ActionResult<List<string>>> GetAvailableRoles()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();
        var currentUserId = int.Parse(userIdClaim.Value);
        var currentUser = await _userManager.FindByIdAsync(currentUserId.ToString());
        if (currentUser == null) return Unauthorized();

        var currentRoles = await _userManager.GetRolesAsync(currentUser);
        var primaryRole = currentRoles.FirstOrDefault() ?? "";

        var availableRoles = primaryRole switch
        {
            "Admin" => new List<string> { "Admin", "ProvinceAdmin", "ProvinceEmployee", "CentralAuditorAdmin", "CentralAuditor", "IpExpertAdmin", "IpExpert" },
            "ProvinceAdmin" => new List<string> { "ProvinceEmployee" },
            "CentralAuditorAdmin" => new List<string> { "CentralAuditor" },
            "IpExpertAdmin" => new List<string> { "IpExpert" },
            _ => new List<string>()
        };

        return availableRoles;
    }
}
