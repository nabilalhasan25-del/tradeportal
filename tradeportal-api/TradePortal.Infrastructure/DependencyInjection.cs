using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TradePortal.Domain.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TradePortal.Application.Interfaces;
using TradePortal.Infrastructure.Repositories;
using TradePortal.Infrastructure.Identity;
using TradePortal.Infrastructure.Data;
using System.Threading.Tasks;

namespace TradePortal.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        // Fallback for Railway/Cloud environments if traditional config is missing
        if (string.IsNullOrEmpty(connectionString) || connectionString.Contains("localhost"))
        {
            var railwayUrl = configuration["MYSQL_URL"];
            if (!string.IsNullOrEmpty(railwayUrl))
            {
                if (railwayUrl.StartsWith("mysql://", StringComparison.OrdinalIgnoreCase))
                {
                    var uri = new Uri(railwayUrl);
                    var userInfo = uri.UserInfo.Split(':');
                    var rUser = userInfo[0];
                    var rPass = userInfo.Length > 1 ? userInfo[1] : "";
                    var rHost = uri.Host;
                    var rPort = uri.Port == -1 ? 3306 : uri.Port;
                    var rDb = uri.AbsolutePath.TrimStart('/');
                    
                    connectionString = $"Server={rHost};Port={rPort};Database={rDb};User={rUser};Password={rPass};SSL Mode=None;";
                }
                else
                {
                    connectionString = railwayUrl;
                }
            }
            else
            {
                // Try individual Railway variables
                var host = configuration["MYSQLHOST"];
                var port = configuration["MYSQLPORT"];
                var user = configuration["MYSQLUSER"];
                var pass = configuration["MYSQLPASSWORD"];
                var db = configuration["MYSQLDATABASE"];

                if (!string.IsNullOrEmpty(host) && !string.IsNullOrEmpty(user))
                {
                    connectionString = $"Server={host};Port={port};Database={db};User={user};Password={pass};";
                }
            }
        }

        // DB DEBUG: Print final decision and scan environment keys
        var debugConn = string.IsNullOrEmpty(connectionString) ? "NULL" : 
                       (connectionString.Contains("localhost") ? "DEFAULT_LOCALHOST" : "OVERRIDDEN_BY_ENV");
        Console.WriteLine($"[DB DEBUG] Connection Source Detected: {debugConn}");
        
        if (debugConn != "OVERRIDDEN_BY_ENV")
        {
            Console.WriteLine("[DB DEBUG] Scanning configuration keys starting with 'MYSQL' or 'Connection'...");
            foreach (var kvp in configuration.AsEnumerable())
            {
                if (kvp.Key.Contains("MYSQL", StringComparison.OrdinalIgnoreCase) || 
                    kvp.Key.Contains("Connection", StringComparison.OrdinalIgnoreCase))
                {
                    Console.WriteLine($"[DB DEBUG] Key Found: {kvp.Key} (Length: {kvp.Value?.Length ?? 0})");
                }
            }
        }

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 33)),
                mysqlOptions => mysqlOptions
                    .MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)
                    .EnableRetryOnFailure(
                        maxRetryCount: 10,
                        maxRetryDelay: TimeSpan.FromSeconds(30),
                        errorNumbersToAdd: null)));

        services.AddIdentity<User, IdentityRole<int>>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequiredLength = 6;
            options.Password.RequireNonAlphanumeric = false;
            
            // Allow Arabic characters in specific
            options.User.AllowedUserNameCharacters = string.Empty;
        })
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders();

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = "Bearer";
            options.DefaultChallengeScheme = "Bearer";
        })
        .AddJwtBearer("Bearer", options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!)),
                ValidateIssuer = true,
                ValidIssuer = configuration["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudience = configuration["Jwt:Audience"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.FromMinutes(5)
            };

            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    var accessToken = context.Request.Query["access_token"];
                    var path = context.HttpContext.Request.Path;
                    if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                    {
                        context.Token = accessToken;
                    }
                    return Task.CompletedTask;
                },
                OnTokenValidated = async context =>
                {
                    var userManager = context.HttpContext.RequestServices.GetRequiredService<UserManager<User>>();
                    var userIdClaim = context.Principal?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value 
                                      ?? context.Principal?.FindFirst("nameid")?.Value;

                    if (!string.IsNullOrEmpty(userIdClaim))
                    {
                        var user = await userManager.FindByIdAsync(userIdClaim);
                        if (user == null || !user.IsActive || user.IsDeleted)
                        {
                            context.Fail("هذا الحساب تم تعطيله أو حذفه");
                        }
                    }
                    else
                    {
                        context.Fail("توكن غير صالح");
                    }
                }
            };
        });

        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<BusinessPurposeSeeder>();

        // Dynamic RBAC Real-time Enforcement
        services.AddAuthorization();
        services.AddSingleton<IAuthorizationPolicyProvider, PermissionPolicyProvider>();
        services.AddScoped<IAuthorizationHandler, PermissionHandler>();

        return services;
    }
}
