using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using TradePortal.Infrastructure.Data;
using TradePortal.Domain.Entities;
using TradePortal.Api.Helpers;

namespace TradePortal.Api.BackgroundServices;

public class ReservationExpiryService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly TimeSpan _checkInterval = TimeSpan.FromHours(6); // Check every 6 hours

    public ReservationExpiryService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await ProcessExpirations();
            await Task.Delay(_checkInterval, stoppingToken);
        }
    }

    private async Task ProcessExpirations()
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var notificationHelper = scope.ServiceProvider.GetRequiredService<NotificationHelper>();

        var now = DateTime.UtcNow;

        // 1. Find requests reaching expiry in 2 days (Alert)
        var alertThreshold = now.AddDays(2);
        var pendingAlerts = await context.Requests
            .Where(r => r.StatusId == 10 // "مقبول - حجز مؤقت"
                        && r.ReservationExpiryDate <= alertThreshold
                        && r.ReservationExpiryDate > now
                        && !context.Notifications.Any(n => n.RequestId == r.Id && n.Type == "expiry_warning"))
            .ToListAsync();

        foreach (var req in pendingAlerts)
        {
            await notificationHelper.NotifyRole("ProvinceEmployee", 
                "تنبيه قرب انتهاء حجز", 
                $"حجز شركة {req.CompanyName} سينتهي خلال 48 ساعة. يرجى استكمال إجراءات السجل.", 
                "expiry_warning", req.Id);
        }

        // 2. Find expired requests
        var expiredRequests = await context.Requests
            .Where(r => r.StatusId == 10 && r.ReservationExpiryDate <= now)
            .ToListAsync();

        foreach (var req in expiredRequests)
        {
            req.StatusId = 11; // "حجز ملغى - لعدم استكمال التأسيس"
            
            context.RequestActions.Add(new RequestAction
            {
                RequestId = req.Id,
                UserId = 1, // System/Admin User ID
                Role = "System",
                ActionType = "AutoCancelled",
                Note = "تم إلغاء الحجز تلقائياً لانقضاء المهلة القانونية (7 أيام)."
            });

            await notificationHelper.NotifyRole("ProvinceEmployee", 
                "تم إلغاء حجز تلقائياً", 
                $"تم إلغاء حجز شركة {req.CompanyName} لعدم مراجعة السجل التجاري خلال الموعد.", 
                "cancelled", req.Id);
        }

        if (pendingAlerts.Any() || expiredRequests.Any())
        {
            await context.SaveChangesAsync();
        }
    }
}
