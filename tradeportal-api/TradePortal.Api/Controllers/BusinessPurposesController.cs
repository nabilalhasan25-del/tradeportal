using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TradePortal.Infrastructure.Data;
using TradePortal.Domain.Entities;

namespace TradePortal.Api.Controllers;

/// <summary>
/// الغايات التجارية
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Tags("الغايات التجارية")]
public class BusinessPurposesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BusinessPurposesController(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// البحث في الغايات التجارية
    /// </summary>
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string q, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        if (string.IsNullOrWhiteSpace(q))
            return Ok(new { items = new List<BusinessPurpose>(), totalCount = 0 });

        var query = _context.BusinessPurposes
            .Where(b => b.ActivityName.Contains(q) || b.ActivityCode.Contains(q))
            .OrderBy(b => b.ActivityCode);

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new
        {
            items,
            totalCount,
            page,
            pageSize
        });
    }

    /// <summary>
    /// جلب تفاصيل غاية تجارية معينة بواسطة المعرف
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await _context.BusinessPurposes.FindAsync(id);
        if (item == null) return NotFound();
        return Ok(item);
    }
}
