using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TradePortal.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ExpandSystemSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(9506));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(9669));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(9670));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(9671));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(9671));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(8462));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(8533));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(8534));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(8535));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(8536));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(4875));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(5103));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(5104));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(5105));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(5105));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(5106));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(5107));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(8050));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(8230));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(8231));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(8232));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(8232));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(8233));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(8797));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "Description", "Group", "Key", "Value" },
                values: new object[] { new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(9064), "بريد الدعم الفني", "General", "SupportEmail", "support@tradeportal.gov.sy" });

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "Description" },
                values: new object[] { new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(9071), "فتح باب التسجيل للشركات" });

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "Description", "Group", "Key", "Value" },
                values: new object[] { new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(9072), "وضع الصيانة (تعطيل الوصول للجميع عدا المدراء)", "Security", "MaintenanceMode", "false" });

            migrationBuilder.InsertData(
                table: "SystemSettings",
                columns: new[] { "Id", "CreatedAt", "Description", "Group", "IsDeleted", "Key", "UpdatedAt", "Value" },
                values: new object[,]
                {
                    { 5, new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(9073), "تفعيل التحقق بخطوتين", "Security", false, "TwoFactorEnabled", null, "false" },
                    { 6, new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(9073), "مدة الجلسة بالدقائق", "Security", false, "SessionTimeoutMinutes", null, "30" },
                    { 7, new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(9074), "تفعيل إشعارات البريد الإلكتروني", "Notifications", false, "EnableEmailNotifications", null, "true" },
                    { 8, new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(9075), "خادم البريد (SMTP)", "Notifications", false, "SmtpServer", null, "smtp.tradeportal.gov.sy" },
                    { 9, new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(9076), "منفذ خادم البريد", "Notifications", false, "SmtpPort", null, "587" },
                    { 10, new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(9077), "اسم مستخدم البريد", "Notifications", false, "SmtpUsername", null, "notifications@tradeportal.gov.sy" },
                    { 11, new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(9077), "كلمة مرور البريد", "Notifications", false, "SmtpPassword", null, "********" },
                    { 12, new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(9078), "اللون الأساسي للهوية", "Appearance", false, "PrimaryBrandColor", null, "#007A3D" },
                    { 13, new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(9079), "اللون الثانوي للهوية", "Appearance", false, "SecondaryBrandColor", null, "#CE1126" },
                    { 14, new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(9080), "رابط شعار الوزارة", "Appearance", false, "CustomLogoUrl", null, "/logo.png" },
                    { 15, new DateTime(2026, 2, 14, 9, 35, 30, 392, DateTimeKind.Utc).AddTicks(9080), "الحد الأقصى لحجم الملفات المرفوعة", "Storage", false, "MaxFileSizeMB", null, "10" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(8913));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(9124));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(9125));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(9126));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(9127));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(7391));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(7464));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(7465));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(7466));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(7467));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(3281));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(3530));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(3531));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(3532));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(3533));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(3534));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(3534));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(6957));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(7149));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(7150));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(7152));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(7153));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(7154));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(7644));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "Description", "Group", "Key", "Value" },
                values: new object[] { new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(7906), "وضع الصيانة", "Security", "MaintenanceMode", "false" });

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "Description" },
                values: new object[] { new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(7908), "فتح باب التسجيل" });

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "Description", "Group", "Key", "Value" },
                values: new object[] { new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(7909), "الحد الأقصى لحجم الملفات", "Storage", "MaxFileSizeMB", "10" });
        }
    }
}
