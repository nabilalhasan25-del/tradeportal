using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using TradePortal.Api.Hubs;
using TradePortal.Domain.Entities;
using TradePortal.Infrastructure.Data;

namespace TradePortal.Api.Helpers;

public class NotificationHelper
{
    private readonly ApplicationDbContext _context;
    private readonly IHubContext<TradePortalHub> _hubContext;

    public NotificationHelper(ApplicationDbContext context, IHubContext<TradePortalHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    public async Task NotifyUser(int userId, string title, string message, string type, int? requestId = null)
    {
        await NotifyUsers(new[] { userId }, title, message, type, requestId);
    }

    public async Task NotifyUsers(IEnumerable<int> userIds, string title, string message, string type, int? requestId = null)
    {
        var notifications = new List<Notification>();
        foreach (var userId in userIds)
        {
            notifications.Add(new Notification
            {
                UserId = userId,
                Title = title,
                Message = message,
                Type = type,
                RequestId = requestId,
                IsRead = false
            });
        }

        _context.Notifications.AddRange(notifications);
        await _context.SaveChangesAsync();

        // Broadcast via SignalR to each user specifically
        foreach (var userId in userIds)
        {
            var userNotif = notifications.FirstOrDefault(n => n.UserId == userId);
            await _hubContext.Clients.User(userId.ToString()).SendAsync("NewNotification", new { 
                id = userNotif?.Id ?? 0,
                title, 
                message, 
                type, 
                requestId,
                createdAt = DateTime.UtcNow
            });
        }
        
        // Also broadcast the general event for list refreshes if needed (keep existing broadcasting)
        // Note: The existing broadcasting in controller already handles list refreshes.
    }

    public async Task NotifyRole(string roleName, string title, string message, string type, int? requestId = null)
    {
        try
        {
            // Robust join query to find users by role name
            var users = await (from u in _context.Users
                               join ur in _context.UserRoles on u.Id equals ur.UserId
                               join r in _context.Roles on ur.RoleId equals r.Id
                               where r.Name == roleName
                               select u.Id).ToListAsync();

            if (users.Any())
            {
                await NotifyUsers(users, title, message, type, requestId);
            }
        }
        catch (Exception)
        {
            // Fail silent on notifications to prevent main flow crash
            // In production, we'd log this.
        }
    }

    public async Task BroadcastRequestCreated(object requestDto)
    {
        await _hubContext.Clients.All.SendAsync("RequestCreated", requestDto);
    }

    public async Task BroadcastRequestUpdated(object requestDto)
    {
        await _hubContext.Clients.All.SendAsync("RequestUpdated", requestDto);
    }
}
