using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TradePortal.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class EnrichBusinessPurposes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Icon",
                table: "BusinessPurposes",
                type: "varchar(10)",
                maxLength: 10,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "MinCapitalHint",
                table: "BusinessPurposes",
                type: "varchar(100)",
                maxLength: 100,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "RequiredApproval",
                table: "BusinessPurposes",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "RequiredAuthority",
                table: "BusinessPurposes",
                type: "varchar(255)",
                maxLength: 255,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Icon",
                table: "BusinessPurposes");

            migrationBuilder.DropColumn(
                name: "MinCapitalHint",
                table: "BusinessPurposes");

            migrationBuilder.DropColumn(
                name: "RequiredApproval",
                table: "BusinessPurposes");

            migrationBuilder.DropColumn(
                name: "RequiredAuthority",
                table: "BusinessPurposes");

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(1458));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(1634));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(1635));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(1636));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(1636));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(413));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(492));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(493));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(494));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(494));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 946, DateTimeKind.Utc).AddTicks(6651));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 946, DateTimeKind.Utc).AddTicks(6885));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 946, DateTimeKind.Utc).AddTicks(6886));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 946, DateTimeKind.Utc).AddTicks(6887));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 946, DateTimeKind.Utc).AddTicks(6888));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 946, DateTimeKind.Utc).AddTicks(6888));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 946, DateTimeKind.Utc).AddTicks(6889));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 946, DateTimeKind.Utc).AddTicks(9955));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(155));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(156));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(168));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(169));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(170));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(732));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(1007));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(1009));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(1010));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(1011));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(1012));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(1013));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(1014));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(1014));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(1015));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(1016));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(1017));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(1018));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(1019));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 9, 30, 28, 947, DateTimeKind.Utc).AddTicks(1020));
        }
    }
}
