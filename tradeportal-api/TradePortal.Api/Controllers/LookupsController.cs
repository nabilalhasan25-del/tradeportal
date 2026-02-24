using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TradePortal.Infrastructure.Data;
using TradePortal.Domain.Entities;

namespace TradePortal.Api.Controllers;

/// <summary>
/// إدارة القوائم المنسدلة والبيانات الأساسية للنظام (المحافظات، الحالات، إلخ)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
[Tags("البيانات الأساسية والقوائم")]
public class LookupsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public LookupsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ════════════════════════ Provinces ════════════════════════

    /// <summary>
    /// جلب قائمة المحافظات
    /// </summary>
    [HttpGet("provinces")]
    public async Task<ActionResult> GetProvinces()
    {
        var provinces = await _context.Provinces
            .Select(p => new { p.Id, p.NameAr, p.IsActive })
            .OrderBy(p => p.Id)
            .ToListAsync();
        return Ok(provinces);
    }

    /// <summary>
    /// إضافة محافظة جديدة
    /// </summary>
    [HttpPost("provinces")]
    [Authorize(Policy = "إدارة البيانات الأساسية")]
    public async Task<ActionResult> AddProvince([FromBody] LookupCreateDto dto)
    {
        var entity = new Province { NameAr = dto.NameAr, IsActive = true };
        _context.Provinces.Add(entity);
        await _context.SaveChangesAsync();
        return Ok(new { entity.Id, entity.NameAr, entity.IsActive });
    }

    /// <summary>
    /// تحديث بيانات محافظة
    /// </summary>
    [HttpPut("provinces/{id}")]
    [Authorize(Policy = "إدارة البيانات الأساسية")]
    public async Task<ActionResult> UpdateProvince(int id, [FromBody] LookupUpdateDto dto)
    {
        var entity = await _context.Provinces.FindAsync(id);
        if (entity == null) return NotFound();
        if (dto.NameAr != null) entity.NameAr = dto.NameAr;
        if (dto.IsActive.HasValue) entity.IsActive = dto.IsActive.Value;
        await _context.SaveChangesAsync();
        return Ok(new { entity.Id, entity.NameAr, entity.IsActive });
    }

    /// <summary>
    /// حذف محافظة (تعطيل)
    /// </summary>
    [HttpDelete("provinces/{id}")]
    [Authorize(Policy = "إدارة البيانات الأساسية")]
    public async Task<ActionResult> DeleteProvince(int id)
    {
        var entity = await _context.Provinces.FindAsync(id);
        if (entity == null) return NotFound();
        entity.IsActive = false; // soft delete
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // ════════════════════════ Company Types ════════════════════

    /// <summary>
    /// جلب قائمة أشكال الشركات
    /// </summary>
    [HttpGet("company-types")]
    public async Task<ActionResult> GetCompanyTypes()
    {
        var types = await _context.CompanyTypes
            .Select(t => new { t.Id, t.NameAr, t.IsActive })
            .OrderBy(t => t.Id)
            .ToListAsync();
        return Ok(types);
    }

    /// <summary>
    /// إضافة شكل شركة جديد
    /// </summary>
    [HttpPost("company-types")]
    [Authorize(Policy = "إدارة البيانات الأساسية")]
    public async Task<ActionResult> AddCompanyType([FromBody] LookupCreateDto dto)
    {
        var entity = new CompanyType { NameAr = dto.NameAr, IsActive = true };
        _context.CompanyTypes.Add(entity);
        await _context.SaveChangesAsync();
        return Ok(new { entity.Id, entity.NameAr, entity.IsActive });
    }

    /// <summary>
    /// تحديث بيانات شكل شركة
    /// </summary>
    [HttpPut("company-types/{id}")]
    [Authorize(Policy = "إدارة البيانات الأساسية")]
    public async Task<ActionResult> UpdateCompanyType(int id, [FromBody] LookupUpdateDto dto)
    {
        var entity = await _context.CompanyTypes.FindAsync(id);
        if (entity == null) return NotFound();
        if (dto.NameAr != null) entity.NameAr = dto.NameAr;
        if (dto.IsActive.HasValue) entity.IsActive = dto.IsActive.Value;
        await _context.SaveChangesAsync();
        return Ok(new { entity.Id, entity.NameAr, entity.IsActive });
    }

    /// <summary>
    /// حذف شكل شركة (تعطيل)
    /// </summary>
    [HttpDelete("company-types/{id}")]
    [Authorize(Policy = "إدارة البيانات الأساسية")]
    public async Task<ActionResult> DeleteCompanyType(int id)
    {
        var entity = await _context.CompanyTypes.FindAsync(id);
        if (entity == null) return NotFound();
        entity.IsActive = false;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // ════════════════════════ Request Statuses ═════════════════

    /// <summary>
    /// جلب قائمة حالات الطلبات
    /// </summary>
    [HttpGet("statuses")]
    public async Task<ActionResult> GetStatuses()
    {
        var statuses = await _context.RequestStatuses
            .Select(s => new { s.Id, s.NameAr, s.ColorCode, s.IsActive })
            .OrderBy(s => s.Id)
            .ToListAsync();
        return Ok(statuses);
    }

    /// <summary>
    /// إضافة حالة طلب جديدة
    /// </summary>
    [HttpPost("statuses")]
    [Authorize(Policy = "إدارة البيانات الأساسية")]
    public async Task<ActionResult> AddStatus([FromBody] StatusCreateDto dto)
    {
        var entity = new RequestStatus
        {
            NameAr = dto.NameAr,
            ColorCode = dto.ColorCode ?? "#6b7280",
            IsActive = true
        };
        _context.RequestStatuses.Add(entity);
        await _context.SaveChangesAsync();
        return Ok(new { entity.Id, entity.NameAr, entity.ColorCode, entity.IsActive });
    }

    /// <summary>
    /// تحديث حالة طلب
    /// </summary>
    [HttpPut("statuses/{id}")]
    [Authorize(Policy = "إدارة البيانات الأساسية")]
    public async Task<ActionResult> UpdateStatus(int id, [FromBody] StatusUpdateDto dto)
    {
        var entity = await _context.RequestStatuses.FindAsync(id);
        if (entity == null) return NotFound();
        if (dto.NameAr != null) entity.NameAr = dto.NameAr;
        if (dto.ColorCode != null) entity.ColorCode = dto.ColorCode;
        if (dto.IsActive.HasValue) entity.IsActive = dto.IsActive.Value;
        await _context.SaveChangesAsync();
        return Ok(new { entity.Id, entity.NameAr, entity.ColorCode, entity.IsActive });
    }

    /// <summary>
    /// حذف حالة طلب (تعطيل)
    /// </summary>
    [HttpDelete("statuses/{id}")]
    [Authorize(Policy = "إدارة البيانات الأساسية")]
    public async Task<ActionResult> DeleteStatus(int id)
    {
        var entity = await _context.RequestStatuses.FindAsync(id);
        if (entity == null) return NotFound();
        entity.IsActive = false;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // ════════════════════════ Checklist Templates ══════════════
    // (Mandatory Attachments / Requirements)

    /// <summary>
    /// جلب قائمة المرفقات المطلوبة (Checklist Templates)
    /// </summary>
    [HttpGet("checklist-templates")]
    public async Task<ActionResult> GetChecklistTemplates()
    {
        var templates = await _context.ChecklistTemplates
            .Select(t => new { t.Id, NameAr = t.ItemNameAr, t.IsMandatory, t.IsActive })
            .OrderBy(t => t.Id)
            .ToListAsync();
        return Ok(templates);
    }

    /// <summary>
    /// إضافة مرفق مطلوب جديد
    /// </summary>
    [HttpPost("checklist-templates")]
    [Authorize(Policy = "إدارة البيانات الأساسية")]
    public async Task<ActionResult> AddChecklistTemplate([FromBody] LookupCreateDto dto)
    {
        var entity = new ChecklistTemplate { ItemNameAr = dto.NameAr, IsMandatory = true, IsActive = true };
        _context.ChecklistTemplates.Add(entity);
        await _context.SaveChangesAsync();
        return Ok(new { entity.Id, NameAr = entity.ItemNameAr, entity.IsMandatory, entity.IsActive });
    }

    /// <summary>
    /// تحديث مرفق مطلوب
    /// </summary>
    [HttpPut("checklist-templates/{id}")]
    [Authorize(Policy = "إدارة البيانات الأساسية")]
    public async Task<ActionResult> UpdateChecklistTemplate(int id, [FromBody] LookupUpdateDto dto)
    {
        var entity = await _context.ChecklistTemplates.FindAsync(id);
        if (entity == null) return NotFound();
        if (dto.NameAr != null) entity.ItemNameAr = dto.NameAr;
        if (dto.IsActive.HasValue) entity.IsActive = dto.IsActive.Value;
        await _context.SaveChangesAsync();
        return Ok(new { entity.Id, NameAr = entity.ItemNameAr, entity.IsMandatory, entity.IsActive });
    }

    /// <summary>
    /// حذف مرفق مطلوب (تعطيل)
    /// </summary>
    [HttpDelete("checklist-templates/{id}")]
    [Authorize(Policy = "إدارة البيانات الأساسية")]
    public async Task<ActionResult> DeleteChecklistTemplate(int id)
    {
        var entity = await _context.ChecklistTemplates.FindAsync(id);
        if (entity == null) return NotFound();
        entity.IsActive = false;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // ════════════════════════ Province Fee Rules ═══════════════
    
    /// <summary>
    /// جلب رسوم محافظة معينة
    /// </summary>
    [HttpGet("provinces/{provinceId}/fees")]
    public async Task<ActionResult> GetProvinceFees(int provinceId)
    {
        var fees = await _context.ProvinceFeeRules
            .Where(f => f.ProvinceId == provinceId)
            .Select(f => new { f.Id, f.ProvinceId, f.FeeName, f.Amount, f.IsActive })
            .OrderBy(f => f.Id)
            .ToListAsync();
        return Ok(fees);
    }

    /// <summary>
    /// إضافة رسم جديد لمحافظة
    /// </summary>
    [HttpPost("province-fees")]
    [Authorize(Policy = "إدارة البيانات الأساسية")]
    public async Task<ActionResult> AddProvinceFeeRule([FromBody] ProvinceFeeRuleCreateDto dto)
    {
        var entity = new ProvinceFeeRule 
        { 
            ProvinceId = dto.ProvinceId, 
            FeeName = dto.FeeName, 
            Amount = dto.Amount,
            IsActive = true 
        };
        _context.ProvinceFeeRules.Add(entity);
        await _context.SaveChangesAsync();
        return Ok(new { entity.Id, entity.ProvinceId, entity.FeeName, entity.Amount, entity.IsActive });
    }

    /// <summary>
    /// تحديث رسم محافظة
    /// </summary>
    [HttpPut("province-fees/{id}")]
    [Authorize(Policy = "إدارة البيانات الأساسية")]
    public async Task<ActionResult> UpdateProvinceFeeRule(int id, [FromBody] ProvinceFeeRuleUpdateDto dto)
    {
        var entity = await _context.ProvinceFeeRules.FindAsync(id);
        if (entity == null) return NotFound();
        
        if (dto.FeeName != null) entity.FeeName = dto.FeeName;
        if (dto.Amount.HasValue) entity.Amount = dto.Amount.Value;
        if (dto.IsActive.HasValue) entity.IsActive = dto.IsActive.Value;
        
        await _context.SaveChangesAsync();
        return Ok(new { entity.Id, entity.ProvinceId, entity.FeeName, entity.Amount, entity.IsActive });
    }

    /// <summary>
    /// حذف رسم محافظة (تعطيل)
    /// </summary>
    [HttpDelete("province-fees/{id}")]
    [Authorize(Policy = "إدارة البيانات الأساسية")]
    public async Task<ActionResult> DeleteProvinceFeeRule(int id)
    {
        var entity = await _context.ProvinceFeeRules.FindAsync(id);
        if (entity == null) return NotFound();
        entity.IsActive = false; // soft delete
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // ════════════════════════ System Constants ═════════════════

    /// <summary>
    /// جلب قائمة المسميات الوظيفية (الأدوار)
    /// </summary>
    [HttpGet("roles")]
    public async Task<ActionResult<List<string>>> GetRoles()
    {
        var roles = await _context.Roles.Select(r => r.Name!).ToListAsync();
        return Ok(roles);
    }

    /// <summary>
    /// جلب قائمة الصلاحيات المتاحة في النظام
    /// </summary>
    [HttpGet("permissions")]
    public ActionResult<List<string>> GetPermissions()
    {
        var permissions = new List<string>
        {
            // Requests & Workflow
            "إنشاء طلب جديد", "تعديل المسودات", "رفع الملفات (PDF)", "تتبع حالة الطلبات",
            "معاينة الإضبارات", "فحص تطابق الأسماء", "طلب استشارة فنية", "اتخاذ القرار النهائي",
            "استقبال طلبات الفحص", "إعداد التقارير الفنية", "حجز الطلبات للتدقيق", "إضافة ملاحظات داخلية",
            
            // Management & Lookups
            "إدارة البيانات الأساسية", "تصدير البيانات (Excel/PDF)", "عرض لوحات الإحصائيات",
            
            // System Administration
            "إدارة المستخدمين", "تعديل الصلاحيات", "ضبط إعدادات النظام", "الوصول لسجل المراجعة الكامل"
        };
        return Ok(permissions);
    }
}

// ════════════════════════ DTOs ════════════════════════════════

public record LookupCreateDto(string NameAr);
public record LookupUpdateDto(string? NameAr, bool? IsActive);
public record StatusCreateDto(string NameAr, string? ColorCode);
public record StatusUpdateDto(string? NameAr, string? ColorCode, bool? IsActive);

public record ProvinceFeeRuleCreateDto(int ProvinceId, string FeeName, decimal Amount);
public record ProvinceFeeRuleUpdateDto(string? FeeName, decimal? Amount, bool? IsActive);
