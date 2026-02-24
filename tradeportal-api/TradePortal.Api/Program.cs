using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.FileProviders;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using TradePortal.Api.Hubs;
using TradePortal.Domain.Entities;
using TradePortal.Infrastructure;
using TradePortal.Infrastructure.Data;
using Microsoft.AspNetCore.SignalR;
using TradePortal.Api.Helpers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "TradePortal API - بوابة التجارة",
        Version = "v1",
        Description = "API for Trade Portal - إدارة العلامات التجارية"
    });

    // JWT Auth in Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "أدخل التوكن هنا: Bearer {token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });

    // Configure Swagger to use the xml documentation file
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = System.IO.Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);
});

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.SetIsOriginAllowed(_ => true) // Allow any origin in dev
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Add Infrastructure Layer
builder.Services.AddSignalR();
builder.Services.AddScoped<NotificationHelper>();
builder.Services.AddScoped<NameValidationService>();
builder.Services.AddSingleton<IUserIdProvider, UserIdProvider>();
builder.Services.AddInfrastructure(builder.Configuration);

// Background Services
builder.Services.AddHostedService<TradePortal.Api.BackgroundServices.ReservationExpiryService>();

var app = builder.Build();

// Seed Database on startup
await TradePortalInitializer.InitializeAsync(app.Services);

app.UseStaticFiles(); // Enable usage of wwwroot
app.UseCors("AllowFrontend");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "TradePortal API v1 - بوابة التجارة");
        c.RoutePrefix = string.Empty; // Swagger at root URL
    });
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<TradePortalHub>("/hubs/tradeportal");

app.Run();
