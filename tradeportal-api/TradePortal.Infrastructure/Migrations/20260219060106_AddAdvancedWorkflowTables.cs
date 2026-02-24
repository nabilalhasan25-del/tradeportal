using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TradePortal.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAdvancedWorkflowTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "InvoiceId",
                table: "Requests",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NameEn",
                table: "Requests",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "RegistryDate",
                table: "Requests",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RegistryNumber",
                table: "Requests",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "ReservationExpiryDate",
                table: "Requests",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Invoices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    InvoiceNum = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Amount = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    IsPaid = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    ReceiptNum = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RequestId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Invoices", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ProvinceFeeRules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ProvinceId = table.Column<int>(type: "int", nullable: false),
                    FeeName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Amount = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProvinceFeeRules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProvinceFeeRules_Provinces_ProvinceId",
                        column: x => x.ProvinceId,
                        principalTable: "Provinces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "RequestActions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    RequestId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Role = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ActionType = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Note = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsInternal = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RequestActions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RequestActions_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RequestActions_Requests_RequestId",
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

            migrationBuilder.InsertData(
                table: "RequestStatuses",
                columns: new[] { "Id", "ColorCode", "CreatedAt", "IsActive", "IsDeleted", "NameAr", "UpdatedAt" },
                values: new object[,]
                {
                    { 7, "orange", new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1158), true, false, "بانتظار الدفع", null },
                    { 8, "cyan", new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1159), true, false, "قيد مراجعة مدير الشركات", null },
                    { 9, "teal", new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1159), true, false, "قيد مراجعة معاون الوزير", null },
                    { 10, "emerald", new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1160), true, false, "مقبول - حجز مؤقت", null },
                    { 11, "rose", new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1161), true, false, "حجز ملغى - لعدم استكمال التأسيس", null },
                    { 12, "green", new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1161), true, false, "حجز قطعي", null },
                    { 13, "stone", new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1162), true, false, "حجز ملغى - شطب", null }
                });

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

            migrationBuilder.InsertData(
                table: "SystemSettings",
                columns: new[] { "Id", "CreatedAt", "Description", "Group", "IsDeleted", "Key", "UpdatedAt", "Value" },
                values: new object[] { 16, new DateTime(2026, 2, 19, 6, 1, 4, 460, DateTimeKind.Utc).AddTicks(1945), "عدد أيام الحجز المؤقت قبل الإلغاء التلقائي", "Workflow", false, "ReservationExpiryDays", null, "7" });

            migrationBuilder.CreateIndex(
                name: "IX_Requests_InvoiceId",
                table: "Requests",
                column: "InvoiceId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProvinceFeeRules_ProvinceId",
                table: "ProvinceFeeRules",
                column: "ProvinceId");

            migrationBuilder.CreateIndex(
                name: "IX_RequestActions_RequestId",
                table: "RequestActions",
                column: "RequestId");

            migrationBuilder.CreateIndex(
                name: "IX_RequestActions_UserId",
                table: "RequestActions",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Requests_Invoices_InvoiceId",
                table: "Requests",
                column: "InvoiceId",
                principalTable: "Invoices",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Requests_Invoices_InvoiceId",
                table: "Requests");

            migrationBuilder.DropTable(
                name: "Invoices");

            migrationBuilder.DropTable(
                name: "ProvinceFeeRules");

            migrationBuilder.DropTable(
                name: "RequestActions");

            migrationBuilder.DropIndex(
                name: "IX_Requests_InvoiceId",
                table: "Requests");

            migrationBuilder.DeleteData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DropColumn(
                name: "InvoiceId",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "NameEn",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "RegistryDate",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "RegistryNumber",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "ReservationExpiryDate",
                table: "Requests");

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(3551));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(3735));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(3736));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(3737));

            migrationBuilder.UpdateData(
                table: "ChecklistTemplates",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(3738));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(2496));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(2573));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(2574));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(2576));

            migrationBuilder.UpdateData(
                table: "CompanyTypes",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(2576));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 254, DateTimeKind.Utc).AddTicks(8544));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 254, DateTimeKind.Utc).AddTicks(8789));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 254, DateTimeKind.Utc).AddTicks(8790));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 254, DateTimeKind.Utc).AddTicks(8791));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 254, DateTimeKind.Utc).AddTicks(8791));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 254, DateTimeKind.Utc).AddTicks(8792));

            migrationBuilder.UpdateData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 254, DateTimeKind.Utc).AddTicks(8793));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(2041));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(2250));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(2251));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(2252));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(2253));

            migrationBuilder.UpdateData(
                table: "RequestStatuses",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(2253));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(2782));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(3052));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(3053));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(3054));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(3055));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(3056));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(3057));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(3058));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(3059));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(3060));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(3060));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(3061));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(3062));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(3063));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 17, 12, 1, 16, 255, DateTimeKind.Utc).AddTicks(3064));
        }
    }
}
