using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TradePortal.Api.Dtos;
using TradePortal.Infrastructure.Data;
using TradePortal.Domain.Entities;

namespace TradePortal.Api.Controllers;

/// <summary>
/// الإشعارات
/// </summary>
[Authorize]
[ApiController]
[Route("api/notifications")]
[Tags("الإشعارات")]
public class NotificationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public NotificationsController(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// جلب قائمة الإشعارات الخاصة بالمستخدم الحالي
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<NotificationDto>>> GetNotifications()
    {
        var userId = GetUserId();
        var notifications = await _context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Take(20)
            .Select(n => new NotificationDto
            {
                Id = n.Id,
                Title = n.Title,
                Message = n.Message,
                Type = n.Type,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt,
                RequestId = n.RequestId
            })
            .ToListAsync();

        return Ok(notifications);
    }

    /// <summary>
    /// تحديد إشعار معين كمقروء
    /// </summary>
    [HttpPost("mark-read")]
    public async Task<IActionResult> MarkAsRead([FromBody] MarkReadDto dto)
    {
        var userId = GetUserId();
        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == dto.NotificationId && n.UserId == userId);

        if (notification == null) return NotFound();

        notification.IsRead = true;
        await _context.SaveChangesAsync();

        return Ok();
    }

    /// <summary>
    /// تحديد كافة الإشعارات كمقروءة
    /// </summary>
    [HttpPost("mark-all-read")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var userId = GetUserId();
        var notifications = await _context.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ToListAsync();

        foreach (var n in notifications)
        {
            n.IsRead = true;
        }

        await _context.SaveChangesAsync();

        return Ok();
    }

    /// <summary>
    /// مسح كافة الإشعارات
    /// </summary>
    [HttpDelete("clear-all")]
    public async Task<IActionResult> ClearAll()
    {
        var userId = GetUserId();
        var notifications = await _context.Notifications
            .Where(n => n.UserId == userId)
            .ToListAsync();

        _context.Notifications.RemoveRange(notifications);
        await _context.SaveChangesAsync();

        return Ok();
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("nameid");
        if (userIdClaim == null) throw new UnauthorizedAccessException();
        return int.Parse(userIdClaim.Value);
    }
}
