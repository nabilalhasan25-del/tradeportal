using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TradePortal.Api.Dtos;
using TradePortal.Domain.Entities;
using TradePortal.Infrastructure.Data;
using System.Security.Claims;

namespace TradePortal.Api.Controllers;

/// <summary>
/// إعدادات النظام العامة وتكوينات البيئة
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
[Tags("إعدادات النظام")]
public class SettingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SettingsController(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// جلب كافة الإعدادات
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SettingResponseDto>>> GetSettings()
    {
        var settings = await _context.SystemSettings
            .Select(s => new SettingResponseDto
            {
                Id = s.Id,
                Key = s.Key,
                Value = s.Key == "SmtpPassword" && s.Value != "" ? "********" : s.Value,
                Description = s.Description,
                Group = s.Group
            })
            .ToListAsync();

        return Ok(settings);
    }

    /// <summary>
    /// تحديث قيمة إعداد معين
    /// </summary>
    [HttpPut("{key}")]
    public async Task<IActionResult> UpdateSetting(string key, [FromBody] SettingUpdateDto dto)
    {
        var setting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == key);
        if (setting == null) return NotFound($"Setting with key '{key}' not found");

        var oldValue = setting.Value;
        setting.Value = dto.Value;
        setting.UpdatedAt = DateTime.UtcNow;

        // Add Audit Log
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (int.TryParse(userIdStr, out var userId))
        {
            _context.AuditLogs.Add(new AuditLog
            {
                UserId = userId,
                Action = "UpdateSetting",
                EntityName = "SystemSetting",
                EntityId = setting.Key,
                OldValues = $"Value: {oldValue}",
                NewValues = $"Value: {dto.Value}",
                IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString()
            });
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// جلب قيمة إعداد معين
    /// </summary>
    [HttpGet("{key}")]
    [AllowAnonymous] // Allow public access to certain settings if needed (e.g., SiteName)
    public async Task<ActionResult<string>> GetSettingValue(string key)
    {
        var setting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == key);
        if (setting == null) return NotFound();
        return Ok(setting.Value);
    }
}
