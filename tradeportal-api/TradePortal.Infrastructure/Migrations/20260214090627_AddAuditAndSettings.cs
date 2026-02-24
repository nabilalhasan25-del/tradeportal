using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TradePortal.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAuditAndSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SystemSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Key = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Value = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Group = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SystemSettings", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

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

            migrationBuilder.InsertData(
                table: "SystemSettings",
                columns: new[] { "Id", "CreatedAt", "Description", "Group", "IsDeleted", "Key", "UpdatedAt", "Value" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 2, 14, 9, 6, 25, 238, DateTimeKind.Utc).AddTicks(38), "اسم المنصة الرئيسي", "General", false, "SiteName", null, "بوابة وزارة التجارة والتموين" },
                    { 2, new DateTime(2026, 2, 14, 9, 6, 25, 238, DateTimeKind.Utc).AddTicks(279), "وضع الصيانة", "Security", false, "MaintenanceMode", null, "false" },
                    { 3, new DateTime(2026, 2, 14, 9, 6, 25, 238, DateTimeKind.Utc).AddTicks(281), "فتح باب التسجيل", "General", false, "RegistrationOpen", null, "true" },
                    { 4, new DateTime(2026, 2, 14, 9, 6, 25, 238, DateTimeKind.Utc).AddTicks(282), "الحد الأقصى لحجم الملفات", "Storage", false, "MaxFileSizeMB", null, "10" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SystemSettings");

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 13, 19, 42, 30, 208, DateTimeKind.Utc).AddTicks(9745));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 13, 19, 42, 30, 208, DateTimeKind.Utc).AddTicks(9816));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 13, 19, 42, 30, 208, DateTimeKind.Utc).AddTicks(9817));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 13, 19, 42, 30, 208, DateTimeKind.Utc).AddTicks(9817));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 13, 19, 42, 30, 208, DateTimeKind.Utc).AddTicks(9818));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 13, 19, 42, 30, 208, DateTimeKind.Utc).AddTicks(6410));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 13, 19, 42, 30, 208, DateTimeKind.Utc).AddTicks(6627));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 13, 19, 42, 30, 208, DateTimeKind.Utc).AddTicks(6628));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 13, 19, 42, 30, 208, DateTimeKind.Utc).AddTicks(6629));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 13, 19, 42, 30, 208, DateTimeKind.Utc).AddTicks(6630));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 13, 19, 42, 30, 208, DateTimeKind.Utc).AddTicks(6630));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 13, 19, 42, 30, 208, DateTimeKind.Utc).AddTicks(6631));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 13, 19, 42, 30, 208, DateTimeKind.Utc).AddTicks(9355));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 13, 19, 42, 30, 208, DateTimeKind.Utc).AddTicks(9528));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 13, 19, 42, 30, 208, DateTimeKind.Utc).AddTicks(9529));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 13, 19, 42, 30, 208, DateTimeKind.Utc).AddTicks(9530));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 13, 19, 42, 30, 208, DateTimeKind.Utc).AddTicks(9531));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 13, 19, 42, 30, 208, DateTimeKind.Utc).AddTicks(9531));
        }
    }
}
