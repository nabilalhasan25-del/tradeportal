using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TradePortal.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRequestBusinessPurposes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RequestBusinessPurposes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    RequestId = table.Column<int>(type: "int", nullable: false),
                    BusinessPurposeId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RequestBusinessPurposes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RequestBusinessPurposes_BusinessPurposes_BusinessPurposeId",
                        column: x => x.BusinessPurposeId,
                        principalTable: "BusinessPurposes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RequestBusinessPurposes_Requests_RequestId",
                        column: x => x.RequestId,
                        principalTable: "Requests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(3544));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(3715));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(3716));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(3716));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(3717));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(2568));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(2643));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(2644));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(2645));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(2645));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 562, DateTimeKind.Utc).AddTicks(9152));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 562, DateTimeKind.Utc).AddTicks(9375));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 562, DateTimeKind.Utc).AddTicks(9376));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 562, DateTimeKind.Utc).AddTicks(9377));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 562, DateTimeKind.Utc).AddTicks(9378));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 562, DateTimeKind.Utc).AddTicks(9378));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 562, DateTimeKind.Utc).AddTicks(9379));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(2163));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(2345));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(2346));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(2346));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(2347));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(2348));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(2827));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(3078));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(3080));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(3081));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(3081));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(3082));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(3083));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(3084));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(3084));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(3085));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(3086));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(3087));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(3087));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(3088));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 10, 42, 2, 563, DateTimeKind.Utc).AddTicks(3089));

            migrationBuilder.CreateIndex(
                name: "IX_RequestBusinessPurposes_BusinessPurposeId",
                table: "RequestBusinessPurposes",
                column: "BusinessPurposeId");

            migrationBuilder.CreateIndex(
                name: "IX_RequestBusinessPurposes_RequestId",
                table: "RequestBusinessPurposes",
                column: "RequestId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RequestBusinessPurposes");

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(8437));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(8629));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(8630));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(8630));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(8631));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(7434));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(7514));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(7515));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(7515));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(7516));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(3674));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(3898));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(3899));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(3900));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(3901));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(3901));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(3902));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(6986));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(7183));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(7184));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(7195));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(7196));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(7196));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(7744));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(8013));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(8014));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(8015));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(8016));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(8017));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(8017));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(8018));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(8019));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(8020));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(8021));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(8021));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(8022));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(8023));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 47, 41, 65, DateTimeKind.Utc).AddTicks(8024));
        }
    }
}
