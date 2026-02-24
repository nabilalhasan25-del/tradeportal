using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TradePortal.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBusinessPurposes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RequestActivities");

            migrationBuilder.DropTable(
                name: "TradeActivities");

            migrationBuilder.CreateTable(
                name: "BusinessPurposes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    SectionId = table.Column<int>(type: "int", nullable: false),
                    SectionCode = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SectionName = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SectorId = table.Column<int>(type: "int", nullable: false),
                    SectorCode = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SectorName = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GroupId = table.Column<int>(type: "int", nullable: false),
                    GroupCode = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GroupName = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    BranchId = table.Column<int>(type: "int", nullable: false),
                    BranchCode = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    BranchName = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    CategoryCode = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CategoryName = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ActivityId = table.Column<int>(type: "int", nullable: false),
                    ActivityCode = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ActivityName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusinessPurposes", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BusinessPurposes");

            migrationBuilder.CreateTable(
                name: "TradeActivities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ActCode = table.Column<string>(type: "varchar(255)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ActName = table.Column<string>(type: "varchar(255)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    BrCode = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    BrId = table.Column<int>(type: "int", nullable: false),
                    BrName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CatgCode = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CatgId = table.Column<int>(type: "int", nullable: false),
                    CatgName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    GrpCode = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GrpId = table.Column<int>(type: "int", nullable: false),
                    GrpName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    SecCode = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SecId = table.Column<int>(type: "int", nullable: false),
                    SecName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SectCode = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SectId = table.Column<int>(type: "int", nullable: false),
                    SectName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TradeActivities", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "RequestActivities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    RequestId = table.Column<int>(type: "int", nullable: false),
                    TradeActivityId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RequestActivities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RequestActivities_Requests_RequestId",
                        column: x => x.RequestId,
                        principalTable: "Requests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RequestActivities_TradeActivities_TradeActivityId",
                        column: x => x.TradeActivityId,
                        principalTable: "TradeActivities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(3040));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(3210));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(3211));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(3212));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(3212));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(1955));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(2026));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(2027));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(2028));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(2028));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 958, DateTimeKind.Utc).AddTicks(8565));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 958, DateTimeKind.Utc).AddTicks(8799));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 958, DateTimeKind.Utc).AddTicks(8800));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 958, DateTimeKind.Utc).AddTicks(8801));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 958, DateTimeKind.Utc).AddTicks(8802));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 958, DateTimeKind.Utc).AddTicks(8802));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 958, DateTimeKind.Utc).AddTicks(8803));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(1552));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(1724));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(1725));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(1737));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(1738));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(1738));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(2194));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(2487));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(2488));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(2489));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(2490));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(2490));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(2491));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(2492));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(2493));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(2494));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(2494));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(2495));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(2496));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(2497));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 16, 8, 25, 6, 959, DateTimeKind.Utc).AddTicks(2497));

            migrationBuilder.CreateIndex(
                name: "IX_RequestActivities_RequestId",
                table: "RequestActivities",
                column: "RequestId");

            migrationBuilder.CreateIndex(
                name: "IX_RequestActivities_TradeActivityId",
                table: "RequestActivities",
                column: "TradeActivityId");

            migrationBuilder.CreateIndex(
                name: "IX_TradeActivities_ActCode",
                table: "TradeActivities",
                column: "ActCode");

            migrationBuilder.CreateIndex(
                name: "IX_TradeActivities_ActName",
                table: "TradeActivities",
                column: "ActName");
        }
    }
}
