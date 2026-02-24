using System.ComponentModel.DataAnnotations;

namespace TradePortal.Api.Dtos;

public class LoginDto
{
    [Required]
    public required string UserName { get; set; }
    
    [Required]
    public required string Password { get; set; }
}

public class RegisterDto
{
    [Required]
    public required string UserName { get; set; }
    
    [Required]
    [EmailAddress]
    public required string Email { get; set; }
    
    [Required]
    public required string FullName { get; set; }
    
    [Required]
    [MinLength(6)]
    public required string Password { get; set; }
    
    public int? ProvinceId { get; set; }
    
    [Required]
    public required string Role { get; set; }
}

public class UserDto
{
    public int Id { get; set; }
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public required string FullName { get; set; }
    public int? ProvinceId { get; set; }
    public string? Token { get; set; }
    public IList<string> Roles { get; set; } = new List<string>();
    public IList<string> Permissions { get; set; } = new List<string>();
}
