using System;
using TradePortal.Domain.Common;

namespace TradePortal.Domain.Entities;

public class Request : BaseEntity
{
    public required string CompanyName { get; set; }
    public string? NameEn { get; set; } // Optional English Name
    
    // Foreign Keys
    public int SubmitterId { get; set; }
    public int CompanyTypeId { get; set; }
    public int ProvinceId { get; set; }
    public int StatusId { get; set; }
    public int? InvoiceId { get; set; } // Linked payment invoice
    
    // Request Data
    public string? MainPdfPath { get; set; }
    public string? AuditorFeedback { get; set; }
    public string? IpVerdict { get; set; }
    public string? IpReportPath { get; set; }
    
    // Finalization (Registry) Data
    public string? RegistryNumber { get; set; }
    public DateTime? RegistryDate { get; set; }
    public DateTime? ReservationExpiryDate { get; set; } // 7-day countdown target
    
    // Concurrency / Locking (Take-Pick System)
    public int? LockedById { get; set; }
    public DateTime? LockedAt { get; set; }

    // IP Expert Handling
    public int? IpExpertId { get; set; }
    public string? IpExpertFeedback { get; set; }
    
    // Flexible Data
    public string? ExtraDataJson { get; set; } // Map to JSON in MySQL

    // Navigation Properties
    public User Submitter { get; set; } = null!;
    public CompanyType CompanyType { get; set; } = null!;
    public Province Province { get; set; } = null!;
    public RequestStatus Status { get; set; } = null!;
    public User? LockedBy { get; set; }
    public User? IpExpert { get; set; }
    public Invoice? Invoice { get; set; }
    
    public ICollection<RequestChecklist> ChecklistItems { get; set; } = new List<RequestChecklist>();
    public ICollection<RequestBusinessPurpose> SelectedPurposes { get; set; } = new List<RequestBusinessPurpose>();
    public ICollection<RequestAction> History { get; set; } = new List<RequestAction>();
}
