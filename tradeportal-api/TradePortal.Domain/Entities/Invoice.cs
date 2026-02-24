using System;
using TradePortal.Domain.Common;

namespace TradePortal.Domain.Entities;

public class Invoice : BaseEntity
{
    public required string InvoiceNum { get; set; }
    public decimal Amount { get; set; }
    public bool IsPaid { get; set; } = false;
    public string? ReceiptNum { get; set; }
    public string? ReceiptPath { get; set; } // Uploaded receipt file (independent from ReceiptNum)
    
    // Foreign Key
    public int RequestId { get; set; }
    
    // Navigation
    public Request Request { get; set; } = null!;
}
