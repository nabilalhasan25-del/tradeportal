using TradePortal.Domain.Common;

namespace TradePortal.Domain.Entities;

public class Notification : BaseEntity
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public required string Title { get; set; }
    public required string Message { get; set; }
    public required string Type { get; set; } // 'new', 'success', 'info', 'warning', 'error'
    public bool IsRead { get; set; }
    public int? RequestId { get; set; }
    public Request? Request { get; set; }
}
