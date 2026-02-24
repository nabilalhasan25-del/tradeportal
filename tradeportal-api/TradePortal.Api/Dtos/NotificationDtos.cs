using System;

namespace TradePortal.Api.Dtos;

public class NotificationDto
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Message { get; set; } = null!;
    public string Type { get; set; } = null!;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
    public int? RequestId { get; set; }
}

public class MarkReadDto
{
    public int NotificationId { get; set; }
}
