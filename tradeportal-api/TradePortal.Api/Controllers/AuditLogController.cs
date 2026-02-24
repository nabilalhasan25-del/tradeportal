using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TradePortal.Infrastructure.Data;

namespace TradePortal.Api.Controllers;

/// <summary>
/// سجل الحركات (Audit Log)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
[Tags("سجل الحركات")]
public class AuditLogController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AuditLogController(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// جلب سجل العمليات مع فلترة وتبويب صفحات
    /// GET /api/auditlog?page=1&amp;pageSize=20&amp;action=CreateRequest&amp;userId=5
    /// </summary>
    [HttpGet]
    public async Task<ActionResult> GetLogs(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? action = null,
        [FromQuery] string? entityName = null,
        [FromQuery] int? userId = null,
        [FromQuery] string? search = null)
    {
        var query = _context.AuditLogs
            .Include(l => l.User)
            .AsQueryable();

        // فلترة حسب نوع العملية
        if (!string.IsNullOrEmpty(action))
            query = query.Where(l => l.Action == action);

        // فلترة حسب الكيان
        if (!string.IsNullOrEmpty(entityName))
            query = query.Where(l => l.EntityName == entityName);

        // فلترة حسب المستخدم
        if (userId.HasValue)
            query = query.Where(l => l.UserId == userId.Value);

        // بحث نصي
        if (!string.IsNullOrEmpty(search))
            query = query.Where(l =>
                l.Action.Contains(search) ||
                l.EntityName.Contains(search) ||
                l.User.FullName.Contains(search) ||
                (l.NewValues != null && l.NewValues.Contains(search)));

        var totalCount = await query.CountAsync();

        var logs = await query
            .OrderByDescending(l => l.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(l => new
            {
                l.Id,
                l.Action,
                l.EntityName,
                l.EntityId,
                l.OldValues,
                l.NewValues,
                l.IpAddress,
                l.CreatedAt,
                UserName = l.User.FullName,
                UserRole = l.User.UserName
            })
            .ToListAsync();

        return Ok(new
        {
            data = logs,
            totalCount,
            page,
            pageSize,
            totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        });
    }

    /// <summary>
    /// الحصول على قائمة العمليات المتاحة للفلترة
    /// </summary>
    [HttpGet("actions")]
    public async Task<ActionResult> GetAvailableActions()
    {
        var actions = await _context.AuditLogs
            .Select(l => l.Action)
            .Distinct()
            .OrderBy(a => a)
            .ToListAsync();
        return Ok(actions);
    }

    /// <summary>
    /// الحصول على قائمة الكيانات المتاحة للفلترة
    /// </summary>
    [HttpGet("entities")]
    public async Task<ActionResult> GetAvailableEntities()
    {
        var entities = await _context.AuditLogs
            .Select(l => l.EntityName)
            .Distinct()
            .OrderBy(e => e)
            .ToListAsync();
        return Ok(entities);
    }
}
