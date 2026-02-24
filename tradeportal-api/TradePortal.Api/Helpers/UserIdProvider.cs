using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace TradePortal.Api.Helpers;

public class UserIdProvider : IUserIdProvider
{
    public string? GetUserId(HubConnectionContext connection)
    {
        // Use NameIdentifier (sub/id) claim as the SignalR user ID
        return connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }
}
