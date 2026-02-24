using System;
using TradePortal.Domain.Common;

namespace TradePortal.Domain.Entities;

public class RequestAction : BaseEntity
{
    public int RequestId { get; set; }
    public int UserId { get; set; }
    public required string Role { get; set; }
    public required string ActionType { get; set; } // e.g., "Accepted", "Rejected", "ReturnedForModification"
    public string? Note { get; set; }
    public bool IsInternal { get; set; } = false; // Internal notes between leadership
    
    // Navigation
    public Request Request { get; set; } = null!;
    public User User { get; set; } = null!;
}
