using TradePortal.Domain.Common;

namespace TradePortal.Domain.Entities;

public class RequestStatus : BaseEntity
{
    public required string NameAr { get; set; }
    public string? ColorCode { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public ICollection<Request> Requests { get; set; } = new List<Request>();
}
