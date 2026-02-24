using Microsoft.AspNetCore.Identity;
using TradePortal.Domain.Common;

namespace TradePortal.Domain.Entities;

public class User : IdentityUser<int>
{
    public required string FullName { get; set; }
    public int? ProvinceId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    public bool IsDeleted { get; set; } = false;

    // Navigation properties
    public Province? Province { get; set; }
    public ICollection<Request> SubmitedRequests { get; set; } = new List<Request>();
    public ICollection<Request> LockedRequests { get; set; } = new List<Request>();
    public ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
}
