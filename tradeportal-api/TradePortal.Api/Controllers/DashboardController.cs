using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TradePortal.Api.Dtos;
using TradePortal.Domain.Entities;
using TradePortal.Infrastructure.Data;

namespace TradePortal.Api.Controllers;

/// <summary>
/// لوحة التحكم — إحصائيات حسب دور المستخدم
/// كل مسؤول يرى فقط الإحصائيات الخاصة بقسمه أو محافظته
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,ProvinceAdmin,ProvinceEmployee,CentralAuditorAdmin,CentralAuditor,IpExpertAdmin,IpExpert")]
[Tags("لوحة التحكم والإحصائيات")]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;

    public DashboardController(ApplicationDbContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    /// <summary>
    /// عرض إحصائيات لوحة التحكم حسب صلاحيات المستخدم
    /// </summary>
    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStatsDto>> GetStats()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();
        var userId = int.Parse(userIdClaim.Value);
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return Unauthorized();

        var roles = await _userManager.GetRolesAsync(user);
        var primaryRole = roles.FirstOrDefault() ?? "";

        // Build query based on role
        var requestsQuery = _context.Requests
            .Include(r => r.Province)
            .Include(r => r.Status)
            .Include(r => r.CompanyType)
            .AsQueryable();

        // Role-based scoping for Stats
        switch (primaryRole)
        {
            case "ProvinceAdmin":
                if (user.ProvinceId.HasValue)
                    requestsQuery = requestsQuery.Where(r => r.ProvinceId == user.ProvinceId);
                break;

            case "ProvinceEmployee":
                requestsQuery = requestsQuery.Where(r => r.SubmitterId == userId);
                break;

            case "CentralAuditorAdmin":
                // All auditor-relevant requests
                requestsQuery = requestsQuery.Where(r => 
                    r.StatusId == 1 || r.StatusId == 2 || r.StatusId == 3 || 
                    r.StatusId == 4 || r.StatusId == 5 || r.StatusId == 6 || 
                    r.StatusId == 8 || r.StatusId == 9 || r.StatusId == 11 || 
                    r.StatusId == 12);
                break;

            case "CentralAuditor":
                // Regular Auditor stats: Ready for Audit (2), IP Responded (4), or Referred (11) + Locked
                requestsQuery = requestsQuery.Where(r => 
                    r.StatusId == 2 || r.StatusId == 4 || r.StatusId == 11 || 
                    r.LockedById == userId);
                break;

            case "IpExpertAdmin":
                // IP Admin sees items pending review or responded
                requestsQuery = requestsQuery.Where(r => r.StatusId == 3 || r.StatusId == 4 || r.StatusId == 11);
                break;

            case "IpExpert":
                // Restricted pool for regular IP
                requestsQuery = requestsQuery.Where(r => (r.StatusId == 3 || r.StatusId == 4 || r.StatusId == 11) && 
                                                         (r.IpExpertId == null || r.IpExpertId == userId));
                break;

            case "Admin":
                // Full view
                break;

            default:
                // No stats for others
                requestsQuery = requestsQuery.Where(r => false);
                break;
        }

        var allRequests = await requestsQuery.ToListAsync();

        // Count active users (scoped)
        int activeUsers;
        if (primaryRole == "ProvinceAdmin")
        {
            activeUsers = await _context.Users
                .Where(u => u.IsActive && u.ProvinceId == user.ProvinceId)
                .CountAsync();
        }
        else if (primaryRole == "CentralAuditorAdmin")
        {
            activeUsers = await _context.UserRoles
                .Join(_context.Roles.Where(r => r.Name == "CentralAuditor" || r.Name == "CentralAuditorAdmin"),
                    ur => ur.RoleId, r => r.Id, (ur, r) => ur.UserId)
                .Distinct().CountAsync();
        }
        else if (primaryRole == "IpExpertAdmin")
        {
            activeUsers = await _context.UserRoles
                .Join(_context.Roles.Where(r => r.Name == "IpExpert" || r.Name == "IpExpertAdmin"),
                    ur => ur.RoleId, r => r.Id, (ur, r) => ur.UserId)
                .Distinct().CountAsync();
        }
        else
        {
            activeUsers = await _context.Users.Where(u => u.IsActive).CountAsync();
        }

        // Province breakdown (only for Admin)
        var provinceBreakdown = new List<ProvinceStatDto>();
        if (primaryRole == "Admin")
        {
            provinceBreakdown = await _context.Requests
                .GroupBy(r => new { r.ProvinceId, r.Province.NameAr })
                .Select(g => new ProvinceStatDto
                {
                    ProvinceId = g.Key.ProvinceId,
                    ProvinceName = g.Key.NameAr,
                    RequestCount = g.Count()
                })
                .OrderByDescending(p => p.RequestCount)
                .ToListAsync();
        }

        // Recent requests (last 10)
        var recentRequests = allRequests
            .OrderByDescending(r => r.CreatedAt)
            .Take(10)
            .Select(r => new RecentRequestDto
            {
                Id = r.Id,
                CompanyName = r.CompanyName,
                CompanyTypeName = r.CompanyType != null ? r.CompanyType.NameAr : null,
                ProvinceName = r.Province.NameAr,
                StatusName = r.Status.NameAr,
                StatusColor = r.Status.ColorCode,
                CreatedAt = r.CreatedAt
            })
            .ToList();

        return new DashboardStatsDto
        {
            TotalRequests = allRequests.Count,
            NewRequests = allRequests.Count(r => r.StatusId == 1),
            InReview = allRequests.Count(r => r.StatusId == 2),
            AwaitingIp = allRequests.Count(r => r.StatusId == 3),
            IpResponded = allRequests.Count(r => r.StatusId == 4),
            Accepted = allRequests.Count(r => r.StatusId == 5),
            Rejected = allRequests.Count(r => r.StatusId == 6),
            ActiveUsers = activeUsers,
            TotalProvinces = primaryRole == "Admin"
                ? await _context.Provinces.Where(p => p.IsActive).CountAsync()
                : 0,
            RecentRequests = recentRequests,
            ProvinceBreakdown = provinceBreakdown
        };
    }
}
