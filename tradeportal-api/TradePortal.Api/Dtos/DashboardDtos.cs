namespace TradePortal.Api.Dtos;

/// <summary>
/// إحصائيات لوحة التحكم - تُعرض حسب دور المستخدم
/// </summary>
public class DashboardStatsDto
{
    public int TotalRequests { get; set; }
    public int NewRequests { get; set; }
    public int InReview { get; set; }
    public int AwaitingIp { get; set; }
    public int IpResponded { get; set; }
    public int Accepted { get; set; }
    public int Rejected { get; set; }
    public int ActiveUsers { get; set; }
    public int TotalProvinces { get; set; }
    public List<RecentRequestDto> RecentRequests { get; set; } = new();
    public List<ProvinceStatDto> ProvinceBreakdown { get; set; } = new();
}

public class RecentRequestDto
{
    public int Id { get; set; }
    public required string CompanyName { get; set; }
    public string? CompanyTypeName { get; set; }
    public required string ProvinceName { get; set; }
    public required string StatusName { get; set; }
    public string? StatusColor { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ProvinceStatDto
{
    public int ProvinceId { get; set; }
    public required string ProvinceName { get; set; }
    public int RequestCount { get; set; }
}
