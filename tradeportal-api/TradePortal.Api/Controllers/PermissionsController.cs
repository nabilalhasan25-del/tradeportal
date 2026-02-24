using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TradePortal.Infrastructure.Data;
using TradePortal.Domain.Entities;

namespace TradePortal.Api.Controllers;

/// <summary>
/// إدارة الصلاحيات
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "تعديل الصلاحيات")]
[Tags("إدارة الصلاحيات")]
public class PermissionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PermissionsController(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// جلب مصفوفة الصلاحيات (الأدوار مقابل الإذن)
    /// </summary>
    [HttpGet("matrix")]
    public async Task<ActionResult> GetPermissionMatrix()
    {
        var roles = await _context.Roles
            .Select(r => new { r.Id, r.Name })
            .ToListAsync();

        var rolePermissions = await _context.RolePermissions
            .ToListAsync();

        // Get all available permissions from LookupsController logic (simplified here)
        var allPermissions = new[]
        {
            "إنشاء طلب جديد", "تعديل المسودات", "رفع الملفات (PDF)", "تتبع حالة الطلبات",
            "معاينة الإضبارات", "فحص تطابق الأسماء", "طلب استشارة فنية", "اتخاذ القرار النهائي",
            "استقبال طلبات الفحص", "إعداد التقارير الفنية", "حجز الطلبات للتدقيق", "إضافة ملاحظات داخلية",
            "إدارة البيانات الأساسية", "تصدير البيانات (Excel/PDF)", "عرض لوحات الإحصائيات",
            "إدارة المستخدمين", "تعديل الصلاحيات", "ضبط إعدادات النظام", "الوصول لسجل المراجعة الكامل"
        };

        var matrix = roles.Select(role => new
        {
            role.Id,
            role.Name,
            Permissions = rolePermissions
                .Where(rp => rp.RoleId == role.Id)
                .Select(rp => rp.PermissionKey)
                .ToList(),
            IsSmartRole = IsSmartRole(role.Name!)
        });

        return Ok(new
        {
            Roles = matrix,
            AllPermissions = allPermissions
        });
    }

    /// <summary>
    /// تحديث صلاحيات دور معين
    /// </summary>
    [HttpPost("update")]
    public async Task<ActionResult> UpdateRolePermissions([FromBody] UpdateRolePermissionsDto dto)
    {
        var role = await _context.Roles.FindAsync(dto.RoleId);
        if (role == null) return NotFound("Role not found");

        // Remove existing permissions
        var existing = _context.RolePermissions.Where(rp => rp.RoleId == dto.RoleId);
        _context.RolePermissions.RemoveRange(existing);

        // Add new permissions
        var newPerms = dto.Permissions.Select(p => new RolePermission
        {
            RoleId = dto.RoleId,
            PermissionKey = p,
            CreatedAt = DateTime.UtcNow
        });

        _context.RolePermissions.AddRange(newPerms);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Permissions updated successfully" });
    }

    private bool IsSmartRole(string roleName)
    {
        string[] smartRoles = { "ProvinceAdmin", "CentralAuditorAdmin", "IpExpertAdmin" };
        return smartRoles.Contains(roleName);
    }
}

public record UpdateRolePermissionsDto(int RoleId, List<string> Permissions);
