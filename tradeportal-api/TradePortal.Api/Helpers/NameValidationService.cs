using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using TradePortal.Api.Dtos;
using TradePortal.Infrastructure.Data;
using System.Net.Http.Json;
using System.Net.Http;

namespace TradePortal.Api.Helpers;

public class NameValidationService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<NameValidationService> _logger;
    private readonly string _rulesFilePath;
    private static readonly HttpClient _httpClient = new HttpClient();

    public NameValidationService(
        ApplicationDbContext context, 
        IConfiguration configuration, 
        IWebHostEnvironment env,
        ILogger<NameValidationService> logger)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
        _rulesFilePath = Path.Combine(env.ContentRootPath, "Resources", "company_naming_rules.json");
    }

    public async Task<NameValidationResultDto> ValidateNameAsync(string nameAr, string nameEn, int companyTypeId)
    {
        var result = new NameValidationResultDto();
        var rules = LoadRules();

        if (rules == null)
        {
            result.Errors.Add("تعذر تحميل قواعد التحقق من الأسماء.");
            return result;
        }

        // 1. Basic Cleaning
        nameAr = nameAr?.Trim() ?? "";
        nameEn = nameEn?.Trim() ?? "";

        // 2. Hard Rule: Forbidden Characters (No symbols, dots, commas)
        var forbiddenPattern = @"[^\u0600-\u06FFa-zA-Z0-0\s]";
        if (Regex.IsMatch(nameAr, forbiddenPattern))
        {
            result.Errors.Add("يمنع استخدام الفواصل أو النقاط أو الرموز الخاصة في اسم الشركة.");
        }

        // 3. Hard Rule: Legal Suffix (Based on Company Type)
        var companyTypeName = await _context.CompanyTypes
            .Where(ct => ct.Id == companyTypeId)
            .Select(ct => ct.NameAr)
            .FirstOrDefaultAsync();

        if (companyTypeName != null)
        {
            // NEW: Global Rule - Every company name must start with "شركة"
            if (!nameAr.StartsWith("شركة"))
            {
                result.Errors.Add("يجب أن يبدأ اسم الشركة دائماً بكلمة (شركة).");
            }

            // Law 29 of 2011 - Detailed Rules per Company Type
            if (companyTypeName.Contains("تضامن")) 
            {
                // Article 30: Names of partners + "and partners"
                if (!nameAr.Contains("وشركا") && !nameAr.Contains("وشركاه"))
                {
                    result.Errors.Add("بناءً على المادة 30: يجب أن يتألف اسم شركة التضامن من أسماء الشركاء مع إضافة (وشركاه) أو (وشركاهم).");
                }
            }
            else if (companyTypeName.Contains("توصية"))
            {
                // Article 45: Only joint partners names
                if (!nameAr.Contains("وشركا") && !nameAr.Contains("وشركاه"))
                {
                    result.Warnings.Add("بناءً على المادة 45: شركة التوصية تتضمن أسماء المتضامنين فقط، وينصح بإلحاقها بكلمة (وشركاه).");
                }
            }
            else if (companyTypeName.Contains("محدودة المسؤولية"))
            {
                // Article 57: Mandatory prefix "شركة" and suffix "محدودة المسؤولية"
                if (!nameAr.EndsWith("محدودة المسؤولية"))
                {
                    result.Errors.Add("بناءً على المادة 57: يجب أن ينتهي اسم الشركة بعبارة (محدودة المسؤولية).");
                }
            }
            else if (companyTypeName.Contains("مساهمة"))
            {
                // Article 88: Mandatory suffix (Public or Private)
                if (!nameAr.Contains("مساهمة مغفلة") && !nameAr.Contains("مساهمة عامة"))
                {
                    result.Errors.Add("بناءً على المادة 88: يجب أن يتضمن اسم الشركة عبارة (مساهمة مغفلة) مع تحديد صفتها (عامة أو خاصة).");
                }
            }
            
            // General Rule (Circular 767/2017 - Article 9): Activity Suffix
            var commonActivities = new[] { "تجارة", "صناعة", "خدمات", "تطوير", "استثمار", "تكنولوجيا", "نقل", "تعهدات", "مقاولات" };
            if (!commonActivities.Any(a => nameAr.Contains(a)))
            {
                result.Warnings.Add("تنبيه (مادة 9): يجب أن يتضمن اسم الشركة ما يدل على نشاطها (مثلاً: للتجارة، للمقاولات، إلخ).");
            }
        }

        // 4. Hard Rule: Forbidden Words (Political/National)
        var forbiddenWords = new[] { "الوطنية", "القطرية", "الإقليمية", "الفيدرالية", "العربية" };
        foreach (var word in forbiddenWords)
        {
            if (nameAr.Contains(word))
            {
                result.Errors.Add($"يمنع استخدام كلمة '{word}' في اسم الشركات الخاصة بناءً على التعاميم.");
            }
        }

        // 5. Database Search (Similarity Check)
        var normalizedAr = TradeNameNormalizer.Normalize(nameAr);
        var similarNames = await _context.Requests
            .Where(r => r.CompanyName != null)
            .Select(r => new { r.Id, r.CompanyName })
            .Take(1000) // Limit search for performance
            .ToListAsync();

        foreach (var existing in similarNames)
        {
            var sim = CalculateSimilarity(normalizedAr, TradeNameNormalizer.Normalize(existing.CompanyName));
            if (sim > 0.8) // 80% similarity threshold
            {
                result.SimilarExistingNames.Add(new SimilarNameDto
                {
                    RequestId = existing.Id,
                    Name = existing.CompanyName,
                    SimilarityScore = sim
                });
                
                if (sim >= 1.0)
                {
                    result.Errors.Add($"يوجد شركة مسجلة بنفس الاسم تماماً: {existing.CompanyName}");
                }
                else
                {
                    result.Warnings.Add($"يوجد اسم مشابه بنسبة كبيرة في قاعدة البيانات: {existing.CompanyName}");
                }
            }
        }

        // 6. AI Golden Advice (Based on Legal Rules & Company Type)
        result.GoldenAdvice = await GetAIGoldenAdvice(nameAr, nameEn, companyTypeName ?? "غير محدد", result.SimilarExistingNames);

        result.IsValid = result.Errors.Count == 0;
        return result;
    }

    private CompanyNamingRules? LoadRules()
    {
        try
        {
            if (!File.Exists(_rulesFilePath)) return null;
            var json = File.ReadAllText(_rulesFilePath);
            return JsonSerializer.Deserialize<CompanyNamingRules>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
        catch
        {
            return null;
        }
    }

    private double CalculateSimilarity(string source, string target)
    {
        if (string.IsNullOrEmpty(source) || string.IsNullOrEmpty(target)) return 0;
        if (source == target) return 1.0;

        int n = source.Length;
        int m = target.Length;
        int[,] d = new int[n + 1, m + 1];

        for (int i = 0; i <= n; d[i, 0] = i++) ;
        for (int j = 0; j <= m; d[0, j] = j++) ;

        for (int i = 1; i <= n; i++)
        {
            for (int j = 1; j <= m; j++)
            {
                int cost = (target[j - 1] == source[i - 1]) ? 0 : 1;
                d[i, j] = Math.Min(Math.Min(d[i - 1, j] + 1, d[i, j - 1] + 1), d[i - 1, j - 1] + cost);
            }
        }

        double maxLen = Math.Max(n, m);
        return 1.0 - (d[n, m] / maxLen);
    }

    private async Task<string> GetAIGoldenAdvice(string nameAr, string nameEn, string companyType, List<SimilarNameDto> similarNames)
    {
        var settings = await _context.SystemSettings
            .Where(s => s.Group == "AI")
            .ToDictionaryAsync(s => s.Key, s => s.Value);

        string provider = settings.GetValueOrDefault("AI_Provider", "Gemini");
        string apiKey = settings.GetValueOrDefault("AI_ApiKey");
        string model = settings.GetValueOrDefault("AI_Model");
        string baseUrl = settings.GetValueOrDefault("AI_BaseUrl");

        // Old settings fallback
        if (string.IsNullOrEmpty(apiKey) || apiKey == "YOUR_API_KEY_HERE" || apiKey == "********")
        {
            apiKey = settings.GetValueOrDefault("GeminiApiKey");
            if (string.IsNullOrEmpty(apiKey) || apiKey == "YOUR_API_KEY_HERE")
                return "تنبيه: لم يتم ضبط مفتاح الـ API للذكاء الاصطناعي. يرجى مراجعة الإعدادات لتفعيل النصيحة الذهبية.";
        }

        if (string.IsNullOrEmpty(model)) 
            model = settings.GetValueOrDefault("GeminiModel", "gemini-2.0-flash-lite");

        try
        {
            var jsonRules = File.ReadAllText(_rulesFilePath);
            var systemPrompt = $@"أنت المستشار القانوني والخبير اللغوي والرقابي بوزارة التجارة السورية.
مهمتك: فحص الأسماء التجارية بصرامة 'صفر تسمح' (Zero Tolerance) مع المخالفات الجوهرية.

**يجب الرفض الصريح (Hard Reject) في الحالات التالية:**
1. **الأسماء والإيحاءات الدينية**: 
   - أي اسم لسورة من القرآن (المزمل، النبأ، الإسراء...).
   - أسماء الأنبياء، الصحابة، أو الرموز الدينية المقدسة.
   - **جديد**: أي اسم يوحي أو يلمح لمحتوى ديني، أو يحمل صبغة روحانية أو دعوية، أو كلمات ترتبط حصراً بالشعائر الدينية.
2. **العلامات العالمية**: أي اسم يشبه لفظاً أو معنى علامة تجارية عالمية مشهورة (نايك، أديداس، آبل، سامسونج) حتى لو كتب بالعربي أو ألحق بـ 'وشركاه'.
3. **الجغرافيا والسياسة**: أسماء الدول أو المدن أو الرموز السياسية.

**قواعد العمل**:
- كن 'عين الوزارة' التي لا تغفل عن الأسماء المبطنة أو التي تلتف على القانون بإيحاءات دينية.
- التزم بنوع الشركة: {companyType}.
- الاختصار: 120 كلمة كحد أقصى.
- اللغة: العربية الفصحى فقط.
- التزام بالقواعد القانونية حرفياً:
{jsonRules}";

            var userPrompt = $@"حلل الاسم التالي لنوع ({companyType}):
الاسم العربي: {nameAr}
الاسم الأجنبي: {nameEn}
المشابهات: {(similarNames.Any() ? string.Join("، ", similarNames.Select(s => s.Name)) : "لا يوجد")}

المطلوب بوضوح:
- [الرأي القانوني]: فحص مخالفات (دين، سياسة، جغرافيا، رموز، لغة).
- [التقييم التجاري]: هل الاسم مميز؟
- [القرار النهائي]: (مقبول / مرفوض مع ذكر السبب القانوني الصريح).
- [البدائل]: 3 بدائل قانونية قصيرة إذا كان هناك رفض.";

            HttpResponseMessage response;
            if (provider.Equals("Gemini", StringComparison.OrdinalIgnoreCase))
            {
                var requestBody = new 
                { 
                    contents = new[] { new { parts = new[] { new { text = systemPrompt + "\n" + userPrompt } } } },
                    generationConfig = new { temperature = 0.4, topP = 0.8, maxOutputTokens = 1000 }
                };
                var url = $"https://generativelanguage.googleapis.com/v1/models/{model}:generateContent?key={apiKey}";
                response = await _httpClient.PostAsJsonAsync(url, requestBody);
            }
            else // Groq, OpenAI, etc.
            {
                var requestBody = new
                {
                    model = model,
                    messages = new[] {
                        new { role = "system", content = systemPrompt },
                        new { role = "user", content = userPrompt }
                    },
                    temperature = 0.4,
                    top_p = 0.8
                };
                
                var url = $"{baseUrl.TrimEnd('/')}/v1/chat/completions";
                var request = new HttpRequestMessage(HttpMethod.Post, url)
                {
                    Content = JsonContent.Create(requestBody)
                };
                request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey);
                response = await _httpClient.SendAsync(request);
            }

            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                _logger.LogError("AI API Failure ({Provider}): {StatusCode} - {ErrorBody}", provider, response.StatusCode, errorBody);
                return $"عذراً، فشل الاتصال بمزود الذكاء الاصطناعي ({provider}). يرجى التأكد من الحصة المجانية والمفتاح.";
            }

            var jsonResponse = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(jsonResponse);
            
            if (provider.Equals("Gemini", StringComparison.OrdinalIgnoreCase))
            {
                return doc.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString();
            }
            else
            {
                return doc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "AI API Exception occurred");
            return $"حدث خطأ تقني أثناء توليد النصيحة الذهبية: {ex.Message}";
        }
    }
}

public class CompanyNamingRules
{
    public List<RuleItem> General_Prohibitions { get; set; } = new();
    public Dictionary<string, string> Legal_Form_Requirements { get; set; } = new();
}

public class RuleItem
{
    public string Rule { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
}
