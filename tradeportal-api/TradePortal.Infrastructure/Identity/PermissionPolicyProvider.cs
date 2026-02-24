using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

namespace TradePortal.Infrastructure.Identity;

public class PermissionPolicyProvider : IAuthorizationPolicyProvider
{
    public DefaultAuthorizationPolicyProvider FallbackPolicyProvider { get; }

    public PermissionPolicyProvider(IOptions<AuthorizationOptions> options)
    {
        FallbackPolicyProvider = new DefaultAuthorizationPolicyProvider(options);
    }

    public Task<AuthorizationPolicy> GetDefaultPolicyAsync() => FallbackPolicyProvider.GetDefaultPolicyAsync();

    public Task<AuthorizationPolicy?> GetFallbackPolicyAsync() => FallbackPolicyProvider.GetFallbackPolicyAsync();

    public async Task<AuthorizationPolicy?> GetPolicyAsync(string policyName)
    {
        // Try to get existing policy (e.g. Roles)
        var policy = await FallbackPolicyProvider.GetPolicyAsync(policyName);
        if (policy != null) return policy;

        // If not found, assume it's a Permission Key and create a custom policy
        var customPolicy = new AuthorizationPolicyBuilder()
            .AddRequirements(new PermissionRequirement(policyName))
            .Build();

        return customPolicy;
    }
}
