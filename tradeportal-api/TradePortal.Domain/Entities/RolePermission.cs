using System.ComponentModel.DataAnnotations;
using TradePortal.Domain.Common;

namespace TradePortal.Domain.Entities;

public class RolePermission : BaseEntity
{
    [Required]
    public int RoleId { get; set; }
    
    [Required]
    public string PermissionKey { get; set; } = string.Empty;

    public string? Description { get; set; }
}
