using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TradePortal.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddIpExpertFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IpExpertFeedback",
                table: "Requests",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "IpExpertId",
                table: "Requests",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(9456));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(9644));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(9645));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(9646));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(9647));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(8470));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(8546));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(8547));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(8548));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(8549));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(4342));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(4573));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(4574));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(4575));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(4576));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(4576));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(4577));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(8025));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(8222));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(8223));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(8224));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(8225));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(8226));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(8744));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(9011));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(9012));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(9013));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(9014));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(9015));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(9016));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(9016));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(9017));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(9018));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(9019));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(9020));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(9021));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(9021));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 15, 6, 35, 41, 676, DateTimeKind.Utc).AddTicks(9022));

            migrationBuilder.CreateIndex(
                name: "IX_Requests_IpExpertId",
                table: "Requests",
                column: "IpExpertId");

            migrationBuilder.AddForeignKey(
                name: "FK_Requests_AspNetUsers_IpExpertId",
                table: "Requests",
                column: "IpExpertId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Requests_AspNetUsers_IpExpertId",
                table: "Requests");

            migrationBuilder.DropIndex(
                name: "IX_Requests_IpExpertId",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "IpExpertFeedback",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "IpExpertId",
                table: "Requests");

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(5553));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(5706));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(5707));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(5708));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(5709));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(4630));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(4703));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(4704));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(4705));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(4705));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(1048));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(1268));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(1269));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(1274));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(1275));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(1276));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(1277));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(4206));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(4391));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(4392));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(4400));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(4401));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(4402));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(4871));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(5162));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(5163));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(5164));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(5165));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(5165));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(5166));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(5167));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(5168));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(5168));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(5169));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(5170));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(5171));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(5171));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 14, 11, 51, 5, 594, DateTimeKind.Utc).AddTicks(5172));
        }
    }
}
