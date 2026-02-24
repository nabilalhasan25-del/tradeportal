namespace TradePortal.Api.Dtos;

public class BusinessPurposeDto
{
    public int Id { get; set; }
    public string ActivityCode { get; set; } = null!;
    public string ActivityName { get; set; } = null!;
    public string ISIC4Code { get; set; } = null!;
    public string? AuthorityName { get; set; }
    public string? ApprovalRequirement { get; set; }
    public decimal? MinimumCapital { get; set; }
    public string? Complement { get; set; }
}

public class RequestChecklistItemDto
{
    public int TemplateId { get; set; }
    public string? TemplateName { get; set; }
    public bool IsProvided { get; set; }
}
public class RequestDto
{
    public int Id { get; set; }
    public required string CompanyName { get; set; }
    public string? NameEn { get; set; }
    public int CompanyTypeId { get; set; }
    public string? CompanyTypeName { get; set; }
    public int ProvinceId { get; set; }
    public string? ProvinceName { get; set; }
    public int StatusId { get; set; }
    public string? StatusName { get; set; }
    public string? StatusColor { get; set; }
    public string? AuditorFeedback { get; set; }
    public string? IpVerdict { get; set; }
    public int? LockedById { get; set; }
    public string? LockedByName { get; set; }
    public DateTime? LockedAt { get; set; }
    public string? MainPdfPath { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? AttachmentPath { get; set; }
    public DateTime? SubmissionDate { get; set; }
    
    // IP Expert fields
    public int? IpExpertId { get; set; }
    public string? IpExpertUserName { get; set; }
    public string? IpExpertFeedback { get; set; }
    public string? IpReportPath { get; set; }

    // Registry & Reservation
    public string? RegistryNumber { get; set; }
    public DateTime? RegistryDate { get; set; }
    public DateTime? ReservationExpiryDate { get; set; }

    // Invoice info
    public int? InvoiceId { get; set; }
    public string? InvoiceNum { get; set; }
    public bool? IsPaid { get; set; }
    public string? ReceiptNum { get; set; }
    public string? ReceiptPath { get; set; }

    public List<BusinessPurposeDto> SelectedPurposes { get; set; } = new();
    public List<RequestChecklistItemDto> ChecklistItems { get; set; } = new();
    public List<RequestActionDto> History { get; set; } = new();
}

public class CreateRequestDto
{
    public required string CompanyName { get; set; }
    public string? NameEn { get; set; }
    public int CompanyTypeId { get; set; }
    public int ProvinceId { get; set; }
    public string? MainPdfPath { get; set; }
    public bool IsPaid { get; set; } = true; // Default true for backwards compat
    public List<SelectedPurposeInputDto> SelectedPurposes { get; set; } = new();
    public List<SelectedChecklistInputDto> ChecklistItems { get; set; } = new();
}

public class SelectedChecklistInputDto
{
    public int TemplateId { get; set; }
    public bool IsProvided { get; set; }
}

public class SelectedPurposeInputDto
{
    public int PurposeId { get; set; }
    public string? Complement { get; set; }
}

public class UpdateRequestStatusDto
{
    public int StatusId { get; set; }
    public string? Comment { get; set; } // Map to AuditorFeedback
    public string? AuditorFeedback { get; set; }
    public string? IpVerdict { get; set; }
}

public class TechnicalReportDto
{
    public required string Feedback { get; set; }
    public string? ReportPath { get; set; }
}

public class RequestActionDto
{
    public int UserId { get; set; }
    public string? UserName { get; set; }
    public string? Role { get; set; }
    public required string ActionType { get; set; }
    public string? Note { get; set; }
    public bool IsInternal { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ConfirmPaymentDto
{
    public required string ReceiptNum { get; set; }
    public string? ReceiptPath { get; set; }
}

public class FinalizeRegistryDto
{
    public required string RegistryNumber { get; set; }
    public DateTime RegistryDate { get; set; }
}
public class ForwardLeadershipDto
{
    public required string TargetRole { get; set; }
    public string? Note { get; set; }
}

public class DirectorDecisionDto
{
    public required string Action { get; set; } // "forward" or "return"
    public string? Note { get; set; }
}

public class MinisterDecisionDto
{
    public bool IsApproved { get; set; }
    public string? Note { get; set; }
}
