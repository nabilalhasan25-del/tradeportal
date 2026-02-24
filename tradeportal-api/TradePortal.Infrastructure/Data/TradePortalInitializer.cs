using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using TradePortal.Domain.Entities;
using TradePortal.Domain.Enums;

namespace TradePortal.Infrastructure.Data;

public static class TradePortalInitializer
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<ApplicationDbContext>();
        var userManager = services.GetRequiredService<UserManager<User>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole<int>>>();
        var seeder = services.GetRequiredService<BusinessPurposeSeeder>();
        var logger = services.GetRequiredService<ILogger<ApplicationDbContext>>();

        int retryCount = 0;
        const int maxRetries = 10;
        
        while (retryCount < maxRetries)
        {
            try
            {
                // 1. Automatic Migrations
                if (context.Database.GetPendingMigrations().Any())
                {
                    logger.LogInformation("Applying pending migrations...");
                    await context.Database.MigrateAsync();
                }
                
                // If we reach here, connection is successful
                break;
            }
            catch (Exception ex)
            {
                retryCount++;
                logger.LogWarning("Database connection failed. Retry {Count}/{Max}. Error: {Message}", retryCount, maxRetries, ex.Message);
                if (retryCount >= maxRetries) throw;
                await Task.Delay(5000); // Wait 5 seconds before next retry
            }
        }

        try
        {

            // 2. Seed Roles
            string[] roles = { 
                "Admin", 
                "ProvinceAdmin", "ProvinceEmployee", 
                "CentralAuditorAdmin", "CentralAuditor", 
                "IpExpertAdmin", "IpExpert",
                "Director", "MinisterAssistant", "RegistryOfficer"
            };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole<int>(role));
                }
            }

            // 3. Seed Users
            async Task EnsureUser(string userName, string email, string fullName, int? provinceId, string roleName, string password)
            {
                var user = await userManager.FindByNameAsync(userName);
                if (user == null)
                {
                    user = new User
                    {
                        UserName = userName,
                        Email = email,
                        FullName = fullName,
                        ProvinceId = provinceId,
                        IsActive = true
                    };
                    var result = await userManager.CreateAsync(user, password);
                    if (!result.Succeeded) return;
                }

                if (!await userManager.IsInRoleAsync(user, roleName))
                {
                    await userManager.AddToRoleAsync(user, roleName);
                }
            }

            await EnsureUser("admin", "admin@tradeportal.sy", "مدير النظام", 1, "Admin", "Admin@123");
            await EnsureUser("auditoradmin", "auditoradmin@tradeportal.sy", "أحمد مدير التدقيق", 1, "CentralAuditorAdmin", "Auditor@123");
            await EnsureUser("auditor1", "auditor@tradeportal.sy", "سمير المدقق", 1, "CentralAuditor", "Auditor@123");
            await EnsureUser("ipadmin", "ipadmin@tradeportal.sy", "سارة مديرة الملكية", 1, "IpExpertAdmin", "IpExpert@123");
            await EnsureUser("ipexpert1", "ip@tradeportal.sy", "منى خبيرة الملكية", 1, "IpExpert", "IpExpert@123");
            await EnsureUser("director1", "director@tradeportal.sy", "د. سامر مدير الشركات", 1, "Director", "Director@123");
            await EnsureUser("minister1", "minister@tradeportal.sy", "معاون الوزير", 1, "MinisterAssistant", "Minister@123");
            await EnsureUser("registrar1", "registrar@tradeportal.sy", "موظف السجل التجاري", 1, "RegistryOfficer", "Registry@123");
            await EnsureUser("provadmin1", "province@tradeportal.sy", "محمد مسؤول المحافظة", 3, "ProvinceAdmin", "Province@123");
            await EnsureUser("provemp1", "provemp@tradeportal.sy", "علي موظف المحافظة", 3, "ProvinceEmployee", "Province@123");

            // 4. Seed Request Statuses (Ensuring all enums exist in DB)
            var statuses = new List<RequestStatus>
            {
                new RequestStatus { Id = (int)RequestStatusEnum.New, NameAr = "جديد", ColorCode = "blue" },
                new RequestStatus { Id = (int)RequestStatusEnum.InAuditing, NameAr = "قيد التدقيق", ColorCode = "amber" },
                new RequestStatus { Id = (int)RequestStatusEnum.PendingIpResponse, NameAr = "بانتظار رد حماية الملكية", ColorCode = "purple" },
                new RequestStatus { Id = (int)RequestStatusEnum.IpResponded, NameAr = "تم الرد من حماية الملكية", ColorCode = "indigo" },
                new RequestStatus { Id = (int)RequestStatusEnum.Accepted, NameAr = "مقبول", ColorCode = "green" },
                new RequestStatus { Id = (int)RequestStatusEnum.Rejected, NameAr = "مرفوض", ColorCode = "red" },
                new RequestStatus { Id = (int)RequestStatusEnum.AwaitingPayment, NameAr = "بانتظار الدفع", ColorCode = "orange" },
                new RequestStatus { Id = (int)RequestStatusEnum.PendingDirectorReview, NameAr = "قيد مراجعة مدير الشركات", ColorCode = "cyan" },
                new RequestStatus { Id = (int)RequestStatusEnum.PendingMinisterAssistantReview, NameAr = "قيد مراجعة معاون الوزير", ColorCode = "teal" },
                new RequestStatus { Id = (int)RequestStatusEnum.TemporarilyReserved, NameAr = "مقبول - حجز مؤقت", ColorCode = "emerald" },
                new RequestStatus { Id = (int)RequestStatusEnum.CancelledForNonCompletion, NameAr = "حجز ملغى - لعدم استكمال التأسيس", ColorCode = "rose" },
                new RequestStatus { Id = (int)RequestStatusEnum.Finalized, NameAr = "حجز قطعي", ColorCode = "green" },
                new RequestStatus { Id = (int)RequestStatusEnum.CancelledByStriking, NameAr = "حجز ملغى - شطب", ColorCode = "gray" },
                new RequestStatus { Id = (int)RequestStatusEnum.LeadershipResponded, NameAr = "تم الرد من القيادة", ColorCode = "purple" }
            };

            foreach (var s in statuses)
            {
                if (!await context.RequestStatuses.AnyAsync(rs => rs.Id == s.Id))
                {
                    context.RequestStatuses.Add(s);
                }
            }
            await context.SaveChangesAsync();

            // 5. Seed Permissions
            string[] allPermsList = {
                "إنشاء طلب جديد", "تعديل المسودات", "رفع الملفات (PDF)", "تتبع حالة الطلبات",
                "معاينة الإضبارات", "فحص تطابق الأسماء", "طلب استشارة فنية", "اتخاذ القرار النهائي",
                "استقبال طلبات الفحص", "إعداد التقارير الفنية", "حجز الطلبات للتدقيق", "إضافة ملاحظات داخلية",
                "إدارة البيانات الأساسية", "تصدير البيانات (Excel/PDF)", "عرض لوحات الإحصائيات",
                "إدارة المستخدمين", "تعديل الصلاحيات", "ضبط إعدادات النظام", "الوصول لسجل المراجعة الكامل"
            };

            var allRoles = await roleManager.Roles.ToListAsync();
            foreach (var roleName in roles)
            {
                var role = allRoles.FirstOrDefault(r => r.Name == roleName);
                if (role == null) continue;

                string[] perms = roleName switch
                {
                    "Admin" => allPermsList,
                    "ProvinceAdmin" => new[] { "إنشاء طلب جديد", "تعديل المسودات", "رفع الملفات (PDF)", "تتبع حالة الطلبات", "عرض لوحات الإحصائيات", "إدارة المستخدمين" },
                    "ProvinceEmployee" => new[] { "إنشاء طلب جديد", "تعديل المسودات", "رفع الملفات (PDF)", "تتبع حالة الطلبات" },
                    "CentralAuditorAdmin" => new[] { "معاينة الإضبارات", "فحص تطابق الأسماء", "طلب استشارة فنية", "اتخاذ القرار النهائي", "حجز الطلبات للتدقيق", "إضافة ملاحظات داخلية", "عرض لوحات الإحصائيات", "إدارة المستخدمين" },
                    "CentralAuditor" => new[] { "معاينة الإضبارات", "فحص تطابق الأسماء", "طلب استشارة فنية", "حجز الطلبات للتدقيق", "إضافة ملاحظات داخلية" },
                    "IpExpertAdmin" => new[] { "استقبال طلبات الفحص", "إعداد التقارير الفنية", "رفع الملفات (PDF)", "عرض لوحات الإحصائيات", "إدارة المستخدمين" },
                    "IpExpert" => new[] { "استقبال طلبات الفحص", "إعداد التقارير الفنية", "رفع الملفات (PDF)" },
                    "Director" => new[] { "معاينة الإضبارات", "إضافة ملاحظات داخلية", "اتخاذ القرار النهائي" },
                    "MinisterAssistant" => new[] { "معاينة الإضبارات", "إضافة ملاحظات داخلية", "اتخاذ القرار النهائي" },
                    "RegistryOfficer" => new[] { "تتبع حالة الطلبات", "معاينة الإضبارات" },
                    _ => Array.Empty<string>()
                };

                foreach (var p in perms)
                {
                    if (!await context.RolePermissions.AnyAsync(rp => rp.RoleId == role.Id && rp.PermissionKey == p))
                    {
                        context.RolePermissions.Add(new RolePermission { RoleId = role.Id, PermissionKey = p });
                    }
                }
            }
            await context.SaveChangesAsync();

            // 5. Seed Business Purposes
            var baseDirectory = AppContext.BaseDirectory;
            var relativeJsonPath = Path.Combine(baseDirectory, "1.json");
            
            if (File.Exists(relativeJsonPath))
            {
                await seeder.SeedAsync(relativeJsonPath, forceRefresh: false);
            }
            else 
            {
                logger.LogWarning("Business purpose JSON file not found at {Path}", relativeJsonPath);
            }

            // 6. AI Settings (Multi-Provider Support)
            var aiSettings = new List<SystemSetting>
            {
                new SystemSetting { Key = "AI_Provider", Value = "Gemini", Group = "AI", Description = "مزود الخدمة (Gemini أو Groq أو OpenAI)" },
                new SystemSetting { Key = "AI_ApiKey", Value = "YOUR_API_KEY_HERE", Group = "AI", Description = "مفتاح الربط مع مزود الذكاء الاصطناعي" },
                new SystemSetting { Key = "AI_Model", Value = "gemini-2.0-flash-lite", Group = "AI", Description = "اسم الموديل (مثال: llama-3.3-70b-versatile للجروك)" },
                new SystemSetting { Key = "AI_BaseUrl", Value = "https://generativelanguage.googleapis.com", Group = "AI", Description = "الرابط الأساسي للـ API (يترك فارغاً للجيمني)" }
            };


            foreach (var setting in aiSettings)
            {
                if (!await context.SystemSettings.AnyAsync(s => s.Key == setting.Key))
                {
                    context.SystemSettings.Add(setting);
                }
            }
            await context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred during database initialization.");
            throw;
        }
    }
}
