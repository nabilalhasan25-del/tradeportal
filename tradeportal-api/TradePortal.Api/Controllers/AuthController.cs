using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TradePortal.Api.Dtos;
using TradePortal.Application.Interfaces;
using TradePortal.Domain.Entities;
using TradePortal.Infrastructure.Data;

namespace TradePortal.Api.Controllers;

/// <summary>
/// إدارة تسجيل الدخول والمصادقة
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Tags("تسجيل الدخول والمصادقة")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly ITokenService _tokenService;
    private readonly ApplicationDbContext _context;
    private readonly ILogger<AuthController> _logger;

    public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, ITokenService tokenService, ApplicationDbContext context, ILogger<AuthController> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// جلب بيانات المستخدم الحالي
    /// </summary>
    [HttpGet("profile")]
    [Authorize]
    public async Task<ActionResult<UserDto>> GetProfile()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("nameid");
        if (userIdClaim == null) return Unauthorized();

        var userId = int.Parse(userIdClaim.Value);
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return NotFound("المستخدم غير موجود");

        var roles = await _userManager.GetRolesAsync(user);

        var permissions = await _context.UserRoles
            .Where(ur => ur.UserId == user.Id)
            .Join(_context.RolePermissions,
                ur => ur.RoleId,
                rp => rp.RoleId,
                (ur, rp) => rp.PermissionKey)
            .Distinct()
            .ToListAsync();

        return new UserDto
        {
            Id = user.Id,
            UserName = user.UserName!,
            Email = user.Email!,
            FullName = user.FullName,
            ProvinceId = user.ProvinceId,
            Roles = roles,
            Permissions = permissions
        };
    }

    /// <summary>
    /// تسجيل الدخول
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        try 
        {
            var user = await _userManager.FindByNameAsync(loginDto.UserName);
            if (user == null) return Unauthorized("اسم المستخدم غير صحيح");

            if (!user.IsActive || user.IsDeleted)
            {
                return Unauthorized("هذا الحساب تم تعطيله أو حذفه. يرجى مراجعة مدير النظام.");
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (!result.Succeeded) return Unauthorized("كلمة المرور غير صحيحة");

            var roles = await _userManager.GetRolesAsync(user);
            
            var permissions = await _context.UserRoles
                .Where(ur => ur.UserId == user.Id)
                .Join(_context.RolePermissions,
                    ur => ur.RoleId,
                    rp => rp.RoleId,
                    (ur, rp) => rp.PermissionKey)
                .Distinct()
                .ToListAsync();

            // سجل تسجيل الدخول
            try 
            {
                _context.AuditLogs.Add(new AuditLog
                {
                    UserId = user.Id,
                    Action = "Login",
                    EntityName = "Auth",
                    NewValues = $"تسجيل دخول ناجح",
                    IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString()
                });
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to save audit log during login");
                // Continue login even if audit log fails
            }

            return new UserDto
            {
                Id = user.Id,
                UserName = user.UserName!,
                Email = user.Email!,
                FullName = user.FullName,
                ProvinceId = user.ProvinceId,
                Token = _tokenService.CreateToken(user, roles),
                Roles = roles,
                Permissions = permissions
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for user {UserName}", loginDto.UserName);
            return StatusCode(500, new { Error = ex.Message, Detail = ex.InnerException?.Message });
        }
    }

    /// <summary>
    /// تسجيل مستخدم جديد
    /// </summary>
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        var user = new User
        {
            UserName = registerDto.UserName,
            Email = registerDto.Email,
            FullName = registerDto.FullName,
            ProvinceId = registerDto.ProvinceId
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded) return BadRequest(result.Errors);

        await _userManager.AddToRoleAsync(user, registerDto.Role);
        var roles = await _userManager.GetRolesAsync(user);
        
        var permissions = await _context.UserRoles
            .Where(ur => ur.UserId == user.Id)
            .Join(_context.RolePermissions,
                ur => ur.RoleId,
                rp => rp.RoleId,
                (ur, rp) => rp.PermissionKey)
            .Distinct()
            .ToListAsync();

        // سجل إنشاء المستخدم
        _context.AuditLogs.Add(new AuditLog
        {
            UserId = user.Id,
            Action = "Register",
            EntityName = "User",
            NewValues = $"مستخدم جديد: {user.FullName} ({registerDto.Role})",
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString()
        });
        await _context.SaveChangesAsync();

        return new UserDto
        {
            Id = user.Id,
            UserName = user.UserName!,
            Email = user.Email!,
            FullName = user.FullName,
            ProvinceId = user.ProvinceId,
            Token = _tokenService.CreateToken(user, roles),
            Roles = roles,
            Permissions = permissions
        };
    }
}
