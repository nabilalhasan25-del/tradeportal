using TradePortal.Domain.Common;

namespace TradePortal.Domain.Entities;

public class ChecklistTemplate : BaseEntity
{
    public required string ItemNameAr { get; set; }
    public string? Description { get; set; }
    public bool IsMandatory { get; set; } = true;
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public ICollection<RequestChecklist> RequestItems { get; set; } = new List<RequestChecklist>();
}
