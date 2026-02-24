using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TradePortal.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddReceiptPathToInvoice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ReceiptPath",
                table: "Invoices",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(5887));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(6254));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(6256));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(6257));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(6258));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(4098));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(4182));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(4183));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(4184));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(4185));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 881, DateTimeKind.Utc).AddTicks(9139));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 881, DateTimeKind.Utc).AddTicks(9383));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 881, DateTimeKind.Utc).AddTicks(9384));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 881, DateTimeKind.Utc).AddTicks(9385));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 881, DateTimeKind.Utc).AddTicks(9386));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 881, DateTimeKind.Utc).AddTicks(9386));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 881, DateTimeKind.Utc).AddTicks(9387));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(3556));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(3779));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(3780));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(3791));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(3792));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(3793));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(3794));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(3794));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(3795));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(3796));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(3806));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(3807));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "ColorCode", "CreatedAt" },
                values: new object[] { "gray", new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(3808) });

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(4383));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(4651));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(4653));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(4654));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(4655));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(4656));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(4656));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(4657));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(4658));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(4659));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(4660));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(4661));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(4662));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(4663));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(4663));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 16,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 23, 6, 23, 42, 882, DateTimeKind.Utc).AddTicks(4664));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReceiptPath",
                table: "Invoices");

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(2363));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(2545));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(2546));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(2547));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(2547));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1406));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1490));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1491));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1491));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1492));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 459, DateTimeKind.Utc).AddTicks(7767));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 459, DateTimeKind.Utc).AddTicks(8007));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 459, DateTimeKind.Utc).AddTicks(8008));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 459, DateTimeKind.Utc).AddTicks(8015));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 459, DateTimeKind.Utc).AddTicks(8016));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 459, DateTimeKind.Utc).AddTicks(8017));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 459, DateTimeKind.Utc).AddTicks(8017));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(942));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1144));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1146));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1155));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1156));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1157));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1158));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1159));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1159));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1160));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1161));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1161));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "ColorCode", "CreatedAt" },
                values: new object[] { "stone", new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1162) });

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1680));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1933));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1935));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1935));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1936));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1937));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1938));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1939));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1939));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1940));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1941));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1942));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1942));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1943));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1944));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 16,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1945));
        }
    }
}
