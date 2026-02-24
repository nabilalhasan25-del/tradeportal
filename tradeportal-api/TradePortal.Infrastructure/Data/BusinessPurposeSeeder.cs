using System.Text.Json;
using Microsoft.Extensions.Logging;
using TradePortal.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace TradePortal.Infrastructure.Data;

public class BusinessPurposeSeeder
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<BusinessPurposeSeeder> _logger;

    public BusinessPurposeSeeder(ApplicationDbContext context, ILogger<BusinessPurposeSeeder> logger)
    {
        _context = context;
        _logger = logger;
    }

    private static readonly List<ApprovalRule> ApprovalRules = new()
    {
        new(new[] { "مصرف", "بنك", "صرافة", "تمويل أصغر", "ائتمان" }, "المصرف المركزي السوري", "موافقة أولية وموافقة نهائية من مجلس النقد والتسليف", "تخضع لحدود دنيا مرتفعة حسب نوع المؤسسة", "🏦"),
        new(new[] { "تأمين", "إعادة تأمين" }, "هيئة الإشراف على التأمين", "ترخيص من هيئة الإشراف على التأمين", "", "🛡️"),
        new(new[] { "سياحة", "فندق", "منتجع", "مكتب سياحي" }, "وزارة السياحة", "ترخيص سياحي / تأشيرة وزارة السياحة", "", "🌴"),
        new(new[] { "دواء", "صيدلي", "مستحضرات تجميل طبقية", "تجهيزات طبية" }, "وزارة الصحة", "موافقة وزارة الصحة / نقابة الصيادلة", "", "💊"),
        new(new[] { "تعليم", "مدرسة", "جامعة", "معهد" }, "وزارة التربية / التعليم العالي", "ترخيص تعليمي خاص", "", "🎓"),
        new(new[] { "إعلام", "قناة", "إذاعة", "صحيفة", "إنتاج فني" }, "المجلس الوطني للإعلام / وزارة الإعلام", "رخصة مزاولة نشاط إعلامي", "", "🎙️"),
        new(new[] { "نقل بري", "شحن", "تخليص جمركي" }, "وزارة النقل", "ترخيص مكتب شحن / نقل", "", "🚛"),
        new(new[] { "أمن", "حراسة" }, "وزارة الداخلية", "ترخيص شركات الحماية والحراسة الخاصة", "", "🕵️")
    };

    private static readonly List<CapitalRule> CapitalRules = new()
    {
        new(new[] { "مصرف", "بنك" }, "10,000,000,000 ل.س"),
        new(new[] { "صرافة" }, "2,000,000,000 ل.س"),
        new(new[] { "تأمين" }, "2,000,000,000 ل.س"),
        new(new[] { "تمويل أصغر" }, "500,000,000 ل.س")
    };

    public async Task SeedAsync(string jsonFilePath, bool forceRefresh = false)
    {
        // If forceRefresh, clear the table. Otherwise only seed if empty.
        if (forceRefresh || !_context.BusinessPurposes.Any())
        {
            if (forceRefresh)
            {
                _logger.LogInformation("Force refresh requested. Clearing BusinessPurposes table...");
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM BusinessPurposes");
                // Reset identity if needed (MySQL specific)
                await _context.Database.ExecuteSqlRawAsync("ALTER TABLE BusinessPurposes AUTO_INCREMENT = 1");
            }

            _logger.LogInformation("Starting seeding/enriching BusinessPurposes from {FilePath}", jsonFilePath);

            try
            {
                using var stream = File.OpenRead(jsonFilePath);
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var data = await JsonSerializer.DeserializeAsync<BusinessPurposeRoot>(stream, options);

                if (data?.Recordset != null)
                {
                    _logger.LogInformation("Found {Count} records to process.", data.Recordset.Count);

                    var entities = data.Recordset.Select(r => {
                        var entity = new BusinessPurpose
                        {
                            SectionId = r.SEC_ID,
                            SectionCode = r.SEC_CODE ?? "",
                            SectionName = r.SEC_NAME ?? "",
                            SectorId = r.SECT_ID,
                            SectorCode = r.SECT_CODE ?? "",
                            SectorName = r.SECT_NAME ?? "",
                            GroupId = r.GRP_ID,
                            GroupCode = r.GRP_CODE ?? "",
                            GroupName = r.GRP_NAME ?? "",
                            BranchId = r.BR_ID,
                            BranchCode = r.BR_CODE ?? "",
                            BranchName = r.BR_NAME ?? "",
                            CategoryId = r.CATG_ID,
                            CategoryCode = r.CATG_CODE ?? "",
                            CategoryName = r.CATG_NAME ?? "",
                            ActivityId = r.ACT_ID,
                            ActivityCode = r.ACT_CODE ?? "",
                            ActivityName = r.ACT_NAME ?? "",
                            ISIC4Code = r.ACT_CODE ?? ""
                        };

                        EnrichEntity(entity);

                        return entity;
                    }).ToList();

                    // Insert in chunks of 5000
                    const int chunkSize = 5000;
                    for (int i = 0; i < entities.Count; i += chunkSize)
                    {
                        var chunk = entities.Skip(i).Take(chunkSize);
                        await _context.BusinessPurposes.AddRangeAsync(chunk);
                        await _context.SaveChangesAsync();
                        _logger.LogInformation("Processed {Count} of {Total} records...", i + chunk.Count(), entities.Count);
                    }

                    _logger.LogInformation("BusinessPurposes seeding/enrichment completed successfully.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while seeding BusinessPurposes.");
                throw;
            }
        }
    }

    private void EnrichEntity(BusinessPurpose entity)
    {
        var name = entity.ActivityName;
        
        // 1. Check Approval Rules
        foreach (var rule in ApprovalRules)
        {
            if (rule.Keywords.Any(k => name.Contains(k)))
            {
                entity.AuthorityName = rule.Authority;
                entity.ApprovalRequirement = rule.Approval;
                entity.Icon = rule.Icon;
                if (!string.IsNullOrEmpty(rule.CapitalHint))
                {
                    entity.MinimumCapital = ParseCapital(rule.CapitalHint);
                }
                break; // First match wins
            }
        }

        // 2. Check Capital Rules
        foreach (var rule in CapitalRules)
        {
            if (rule.Keywords.Any(k => name.Contains(k)))
            {
                entity.MinimumCapital = ParseCapital(rule.MinCapital);
                break; // First match wins
            }
        }
    }

    private decimal? ParseCapital(string capitalStr)
    {
        if (string.IsNullOrEmpty(capitalStr)) return null;
        // Clean string: "10,000,000,000 ل.س" -> "10000000000"
        var numericPart = new string(capitalStr.Where(c => char.IsDigit(c)).ToArray());
        if (decimal.TryParse(numericPart, out var result)) return result;
        return null;
    }

    private record ApprovalRule(string[] Keywords, string Authority, string Approval, string CapitalHint, string Icon);
    private record CapitalRule(string[] Keywords, string MinCapital);

    private class BusinessPurposeRoot
    {
        public List<BusinessPurposeRecord>? Recordset { get; set; }
    }

    private class BusinessPurposeRecord
    {
        public int SEC_ID { get; set; }
        public string? SEC_CODE { get; set; }
        public string? SEC_NAME { get; set; }
        public int SECT_ID { get; set; }
        public string? SECT_CODE { get; set; }
        public string? SECT_NAME { get; set; }
        public int GRP_ID { get; set; }
        public string? GRP_CODE { get; set; }
        public string? GRP_NAME { get; set; }
        public int BR_ID { get; set; }
        public string? BR_CODE { get; set; }
        public string? BR_NAME { get; set; }
        public int CATG_ID { get; set; }
        public string? CATG_CODE { get; set; }
        public string? CATG_NAME { get; set; }
        public int ACT_ID { get; set; }
        public string? ACT_CODE { get; set; }
        public string? ACT_NAME { get; set; }
    }
}
