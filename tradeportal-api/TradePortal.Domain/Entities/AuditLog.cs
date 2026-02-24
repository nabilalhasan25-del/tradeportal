using TradePortal.Domain.Common;

namespace TradePortal.Domain.Entities;

public class AuditLog : BaseEntity
{
    public int UserId { get; set; }
    public required string Action { get; set; } // e.g., "CreateRequest", "UpdateStatus"
    public required string EntityName { get; set; }
    public string? EntityId { get; set; }
    public string? OldValues { get; set; }
    public string? NewValues { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
}
