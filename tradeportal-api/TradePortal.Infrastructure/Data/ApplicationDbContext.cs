using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TradePortal.Domain.Entities;
using TradePortal.Domain.Enums;

namespace TradePortal.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<int>, int>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Province> Provinces => Set<Province>();
    public DbSet<RequestStatus> RequestStatuses => Set<RequestStatus>();
    public DbSet<CompanyType> CompanyTypes => Set<CompanyType>();
    public DbSet<Request> Requests => Set<Request>();
    public DbSet<RequestChecklist> RequestChecklists => Set<RequestChecklist>();
    public DbSet<ChecklistTemplate> ChecklistTemplates => Set<ChecklistTemplate>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<SystemSetting> SystemSettings => Set<SystemSetting>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();
    public DbSet<BusinessPurpose> BusinessPurposes => Set<BusinessPurpose>();
    public DbSet<RequestBusinessPurpose> RequestBusinessPurposes => Set<RequestBusinessPurpose>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<RequestAction> RequestActions => Set<RequestAction>();
    public DbSet<ProvinceFeeRule> ProvinceFeeRules => Set<ProvinceFeeRule>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure User - Province relationship
        builder.Entity<User>()
            .HasOne(u => u.Province)
            .WithMany(p => p.Users)
            .HasForeignKey(u => u.ProvinceId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure Request relationships
        builder.Entity<Request>(entity =>
        {
            entity.HasOne(r => r.Submitter)
                .WithMany(u => u.SubmitedRequests)
                .HasForeignKey(r => r.SubmitterId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(r => r.Province)
                .WithMany(p => p.Requests)
                .HasForeignKey(r => r.ProvinceId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(r => r.LockedBy)
                .WithMany(u => u.LockedRequests)
                .HasForeignKey(r => r.LockedById)
                .OnDelete(DeleteBehavior.SetNull);

            // Handle JSON for ExtraData (MySQL specific)
            entity.Property(r => r.ExtraDataJson)
                .HasColumnType("json");
        });

        // Configure Checklist relationships
        builder.Entity<RequestChecklist>()
            .HasOne(rc => rc.Request)
            .WithMany(r => r.ChecklistItems)
            .HasForeignKey(rc => rc.RequestId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure RequestBusinessPurpose (Junction Table)
        builder.Entity<RequestBusinessPurpose>(entity =>
        {
            entity.HasOne(rbp => rbp.Request)
                .WithMany(r => r.SelectedPurposes)
                .HasForeignKey(rbp => rbp.RequestId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(rbp => rbp.BusinessPurpose)
                .WithMany()
                .HasForeignKey(rbp => rbp.BusinessPurposeId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure Invoice relationships
        builder.Entity<Invoice>(entity =>
        {
            entity.HasOne(i => i.Request)
                .WithOne(r => r.Invoice)
                .HasForeignKey<Request>(r => r.InvoiceId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Configure RequestAction relationships
        builder.Entity<RequestAction>(entity =>
        {
            entity.HasOne(ra => ra.Request)
                .WithMany(r => r.History)
                .HasForeignKey(ra => ra.RequestId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ra => ra.User)
                .WithMany()
                .HasForeignKey(ra => ra.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure ProvinceFeeRule relationships
        builder.Entity<ProvinceFeeRule>(entity =>
        {
            entity.HasOne(pfr => pfr.Province)
                .WithMany()
                .HasForeignKey(pfr => pfr.ProvinceId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Seed initial data
        SeedData(builder);
    }

    private void SeedData(ModelBuilder builder)
    {
        builder.Entity<Province>().HasData(
            new Province { Id = 1, NameAr = "دمشق" },
            new Province { Id = 2, NameAr = "ريف دمشق" },
            new Province { Id = 3, NameAr = "حلب" },
            new Province { Id = 4, NameAr = "حمص" },
            new Province { Id = 5, NameAr = "حماة" },
            new Province { Id = 6, NameAr = "اللاذقية" },
            new Province { Id = 7, NameAr = "طرطوس" }
        );

        builder.Entity<RequestStatus>().HasData(
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
        );

        builder.Entity<CompanyType>().HasData(
            new CompanyType { Id = 1, NameAr = "شركة تضامن" },
            new CompanyType { Id = 2, NameAr = "شركة توصية بسيطة" },
            new CompanyType { Id = 3, NameAr = "شركة مساهمة عامة" },
            new CompanyType { Id = 4, NameAr = "شركة مساهمة مغفلة خاصة" },
            new CompanyType { Id = 5, NameAr = "شركة محدودة المسؤولية" }
        );

        builder.Entity<SystemSetting>().HasData(
            // General
            new SystemSetting { Id = 1, Key = "SiteName", Value = "بوابة وزارة التجارة والتموين", Group = "General", Description = "اسم المنصة الرئيسي" },
            new SystemSetting { Id = 2, Key = "SupportEmail", Value = "support@tradeportal.gov.sy", Group = "General", Description = "بريد الدعم الفني" },
            new SystemSetting { Id = 3, Key = "RegistrationOpen", Value = "true", Group = "General", Description = "فتح باب التسجيل للشركات" },
            
            // Security
            new SystemSetting { Id = 4, Key = "MaintenanceMode", Value = "false", Group = "Security", Description = "وضع الصيانة (تعطيل الوصول للجميع عدا المدراء)" },
            new SystemSetting { Id = 5, Key = "TwoFactorEnabled", Value = "false", Group = "Security", Description = "تفعيل التحقق بخطوتين" },
            new SystemSetting { Id = 6, Key = "SessionTimeoutMinutes", Value = "30", Group = "Security", Description = "مدة الجلسة بالدقائق" },
            
            // Notifications (Email/SMTP)
            new SystemSetting { Id = 7, Key = "EnableEmailNotifications", Value = "true", Group = "Notifications", Description = "تفعيل إشعارات البريد الإلكتروني" },
            new SystemSetting { Id = 8, Key = "SmtpServer", Value = "smtp.tradeportal.gov.sy", Group = "Notifications", Description = "خادم البريد (SMTP)" },
            new SystemSetting { Id = 9, Key = "SmtpPort", Value = "587", Group = "Notifications", Description = "منفذ خادم البريد" },
            new SystemSetting { Id = 10, Key = "SmtpUsername", Value = "notifications@tradeportal.gov.sy", Group = "Notifications", Description = "اسم مستخدم البريد" },
            new SystemSetting { Id = 11, Key = "SmtpPassword", Value = "********", Group = "Notifications", Description = "كلمة مرور البريد" },
            
            // Appearance
            new SystemSetting { Id = 12, Key = "PrimaryBrandColor", Value = "#007A3D", Group = "Appearance", Description = "اللون الأساسي للهوية" },
            new SystemSetting { Id = 13, Key = "SecondaryBrandColor", Value = "#CE1126", Group = "Appearance", Description = "اللون الثانوي للهوية" },
            new SystemSetting { Id = 14, Key = "CustomLogoUrl", Value = "/logo.png", Group = "Appearance", Description = "رابط شعار الوزارة" },
            
            // Storage
            new SystemSetting { Id = 15, Key = "MaxFileSizeMB", Value = "10", Group = "Storage", Description = "الحد الأقصى لحجم الملفات المرفوعة" },
            
            // Workflow Rules
            new SystemSetting { Id = 16, Key = "ReservationExpiryDays", Value = "7", Group = "Workflow", Description = "عدد أيام الحجز المؤقت قبل الإلغاء التلقائي" }
        );

        builder.Entity<ChecklistTemplate>().HasData(
            new ChecklistTemplate { Id = 1, ItemNameAr = "صورة عن الهوية الشخصية للمؤسسين", IsMandatory = true },
            new ChecklistTemplate { Id = 2, ItemNameAr = "نظام التأسيس المقترح (موقع أصولاً)", IsMandatory = true },
            new ChecklistTemplate { Id = 3, ItemNameAr = "إيصال دفع الرسوم المالية", IsMandatory = true },
            new ChecklistTemplate { Id = 4, ItemNameAr = "صورة عن الختم الرسمي المعتمد", IsMandatory = true },
            new ChecklistTemplate { Id = 5, ItemNameAr = "سجل تجاري سابق (إن وجد)", IsMandatory = false }
        );
    }
}
