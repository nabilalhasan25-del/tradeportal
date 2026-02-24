using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TradePortal.Infrastructure.Data;

namespace TradePortal.Infrastructure.Identity;

public class PermissionHandler : AuthorizationHandler<PermissionRequirement>
{
    private readonly ApplicationDbContext _context;

    public PermissionHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
    {
        if (context.User == null) return;

        // Admin has all permissions
        if (context.User.IsInRole("Admin"))
        {
            context.Succeed(requirement);
            return;
        }

        var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier) ?? context.User.FindFirst("nameid");
        if (userIdClaim == null) return;

        if (!int.TryParse(userIdClaim.Value, out int userId)) return;

        var hasPermission = await _context.UserRoles
            .Where(ur => ur.UserId == userId)
            .Join(_context.RolePermissions,
                ur => ur.RoleId,
                rp => rp.RoleId,
                (ur, rp) => rp.PermissionKey)
            .AnyAsync(pk => pk == requirement.Permission);

        if (hasPermission)
        {
            context.Succeed(requirement);
        }
    }
}
