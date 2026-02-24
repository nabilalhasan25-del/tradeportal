using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TradePortal.Domain.Entities;

public class BusinessPurpose
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    // Section
    public int SectionId { get; set; }
    [MaxLength(10)]
    public string SectionCode { get; set; } = string.Empty;
    [MaxLength(255)]
    public string SectionName { get; set; } = string.Empty;

    // Sub-section / Sector
    public int SectorId { get; set; }
    [MaxLength(10)]
    public string SectorCode { get; set; } = string.Empty;
    [MaxLength(255)]
    public string SectorName { get; set; } = string.Empty;

    // Group
    public int GroupId { get; set; }
    [MaxLength(10)]
    public string GroupCode { get; set; } = string.Empty;
    [MaxLength(255)]
    public string GroupName { get; set; } = string.Empty;

    // Branch
    public int BranchId { get; set; }
    [MaxLength(10)]
    public string BranchCode { get; set; } = string.Empty;
    [MaxLength(255)]
    public string BranchName { get; set; } = string.Empty;

    // Category
    public int CategoryId { get; set; }
    [MaxLength(10)]
    public string CategoryCode { get; set; } = string.Empty;
    [MaxLength(255)]
    public string CategoryName { get; set; } = string.Empty;

    // Activity (The specific purpose)
    public int ActivityId { get; set; }
    [MaxLength(20)]
    public string ActivityCode { get; set; } = string.Empty;
    public string ActivityName { get; set; } = string.Empty;

    [MaxLength(20)]
    public string ISIC4Code { get; set; } = string.Empty;

    // Legal & Financial Requirements
    [MaxLength(255)]
    public string? AuthorityName { get; set; }
    public string? ApprovalRequirement { get; set; }
    public decimal? MinimumCapital { get; set; }
    [MaxLength(10)]
    public string? Icon { get; set; }
}
