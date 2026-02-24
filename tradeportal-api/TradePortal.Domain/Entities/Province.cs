using TradePortal.Domain.Common;

namespace TradePortal.Domain.Entities;

public class Province : BaseEntity
{
    public required string NameAr { get; set; }
    public string? NameEn { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<Request> Requests { get; set; } = new List<Request>();
}
