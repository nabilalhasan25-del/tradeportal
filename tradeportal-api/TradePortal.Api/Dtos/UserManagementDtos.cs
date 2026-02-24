namespace TradePortal.Api.Dtos;

/// <summary>
/// عرض بيانات المستخدم في صفحة إدارة المستخدمين
/// </summary>
public class UserListDto
{
    public int Id { get; set; }
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public required string FullName { get; set; }
    public int? ProvinceId { get; set; }
    public string? ProvinceName { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public IList<string> Roles { get; set; } = new List<string>();
}

/// <summary>
/// تحديث بيانات مستخدم موجود
/// </summary>
public class UpdateUserDto
{
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public bool? IsActive { get; set; }
    public string? Role { get; set; }
    public int? ProvinceId { get; set; }
}
