namespace TradePortal.Domain.Enums;

public enum RequestStatusEnum
{
    New = 1,
    InAuditing = 2,
    PendingIpResponse = 3,
    IpResponded = 4,
    Accepted = 5,
    Rejected = 6,
    AwaitingPayment = 7,
    PendingDirectorReview = 8,
    PendingMinisterAssistantReview = 9,
    TemporarilyReserved = 10,
    CancelledForNonCompletion = 11,
    Finalized = 12,
    CancelledByStriking = 13,
    LeadershipResponded = 14 // عاد من المدير أو المعاون للمدقق
}
