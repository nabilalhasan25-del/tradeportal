using System;
using TradePortal.Domain.Common;

namespace TradePortal.Domain.Entities;

public class ProvinceFeeRule : BaseEntity
{
    public int ProvinceId { get; set; }
    public required string FeeName { get; set; }
    public decimal Amount { get; set; }
    public bool IsActive { get; set; } = true;
    
    // Navigation
    public Province Province { get; set; } = null!;
}
