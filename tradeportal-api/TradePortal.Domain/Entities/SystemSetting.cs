using TradePortal.Domain.Common;

namespace TradePortal.Domain.Entities;

public class SystemSetting : BaseEntity
{
    public required string Key { get; set; }
    public required string Value { get; set; }
    public string? Description { get; set; }
    public string Group { get; set; } = "General"; // e.g., "Appearance", "Security", "Notifications"
}
