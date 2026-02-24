using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TradePortal.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddChecklistSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "ChecklistTemplates",
                columns: new[] { "Id", "CreatedAt", "Description", "IsActive", "IsDeleted", "IsMandatory", "ItemNameAr", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(8913), null, true, false, true, "صورة عن الهوية الشخصية للمؤسسين", null },
                    { 2, new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(9124), null, true, false, true, "نظام التأسيس المقترح (موقع أصولاً)", null },
                    { 3, new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(9125), null, true, false, true, "إيصال دفع الرسوم المالية", null },
                    { 4, new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(9126), null, true, false, true, "صورة عن الختم الرسمي المعتمد", null },
                    { 5, new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(9127), null, true, false, false, "سجل تجاري سابق (إن وجد)", null }
                });

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
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(7906));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(7908));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 26, 44, 122, DateTimeKind.Utc).AddTicks(7909));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 6, 25, 237, DateTimeKind.Utc).AddTicks(9797));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 6, 25, 237, DateTimeKind.Utc).AddTicks(9866));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 6, 25, 237, DateTimeKind.Utc).AddTicks(9867));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 6, 25, 237, DateTimeKind.Utc).AddTicks(9867));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 6, 25, 237, DateTimeKind.Utc).AddTicks(9868));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 6, 25, 237, DateTimeKind.Utc).AddTicks(6020));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 6, 25, 237, DateTimeKind.Utc).AddTicks(6258));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 6, 25, 237, DateTimeKind.Utc).AddTicks(6259));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 6, 25, 237, DateTimeKind.Utc).AddTicks(6260));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 6, 25, 237, DateTimeKind.Utc).AddTicks(6261));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 6, 25, 237, DateTimeKind.Utc).AddTicks(6261));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 6, 25, 237, DateTimeKind.Utc).AddTicks(6262));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 6, 25, 237, DateTimeKind.Utc).AddTicks(9393));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 6, 25, 237, DateTimeKind.Utc).AddTicks(9570));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 6, 25, 237, DateTimeKind.Utc).AddTicks(9571));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 6, 25, 237, DateTimeKind.Utc).AddTicks(9572));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 6, 25, 237, DateTimeKind.Utc).AddTicks(9573));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 6, 25, 237, DateTimeKind.Utc).AddTicks(9573));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 6, 25, 238, DateTimeKind.Utc).AddTicks(38));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 6, 25, 238, DateTimeKind.Utc).AddTicks(279));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 6, 25, 238, DateTimeKind.Utc).AddTicks(281));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 9, 6, 25, 238, DateTimeKind.Utc).AddTicks(282));
        }
    }
}
