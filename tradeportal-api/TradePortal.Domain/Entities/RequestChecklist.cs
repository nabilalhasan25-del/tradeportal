using TradePortal.Domain.Common;

namespace TradePortal.Domain.Entities;

public class RequestChecklist : BaseEntity
{
    public int RequestId { get; set; }
    public int TemplateId { get; set; }
    
    public bool IsProvided { get; set; } = false;
    public string? FilePath { get; set; }
    public string? Notes { get; set; }

    // Navigation properties
    public Request Request { get; set; } = null!;
    public ChecklistTemplate Template { get; set; } = null!;
}
