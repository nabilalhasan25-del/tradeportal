using TradePortal.Domain.Common;

namespace TradePortal.Domain.Entities;

public class RequestBusinessPurpose : BaseEntity
{
    public int RequestId { get; set; }
    public int BusinessPurposeId { get; set; }
    public string? Complement { get; set; }

    // Navigation Properties
    public Request Request { get; set; } = null!;
    public BusinessPurpose BusinessPurpose { get; set; } = null!;
}
