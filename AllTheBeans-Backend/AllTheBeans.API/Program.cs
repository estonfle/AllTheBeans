using AllTheBeans.Application.Services;
using AllTheBeans.Domain.Entities;
using AllTheBeans.Domain.Interfaces;
using AllTheBeans.Infrastructure.Data;
using AllTheBeans.Infrastructure.Repositories;
using AllTheBeans.API.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using System.Text;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Localisation services to the container
builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<User, IdentityRole>(options =>
    {
        options.User.RequireUniqueEmail = true; 

        // Loosen password rules for development simplicity
        options.Password.RequireDigit = false;
        options.Password.RequiredLength = 4;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireLowercase = false;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddScoped<IBeanRepository, BeanRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IBeanService, BeanService>();
builder.Services.AddScoped<IOrderService, OrderService>(); 
builder.Services.AddScoped<IAuthService, AuthService>(); 

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
});

builder.Services.AddControllers(options =>
{
    options.Conventions.Add(new RouteTokenTransformerConvention(
        new SlugifyParameterTransformer()));
        
    // This forces Swagger to ONLY generate 'application/json' responses.
    // It prevents the 'text/plain' bug in Orval's MSW generator!
    options.Filters.Add(new ProducesAttribute("application/json"));

    // Forces the API to only ACCEPT application/json (Cleans up the requestBody in Swagger!)
    options.Filters.Add(new ConsumesAttribute("application/json"));
})
// Optional: Localise built-in DataAnnotations (e.g. [Required],[MaxLength])
    .AddDataAnnotationsLocalization(); 

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    // Add this line to force all query parameters to be camelCase
    options.DescribeAllParametersInCamelCase(); 
});

builder.Services.AddCors(opt => opt.AddPolicy("AllowReact", p => 
    p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

var app = builder.Build();

await SeedData.Initialize(app.Services);

// 2. Configure Request Localisation
var supportedCultures = new[] { "en-GB", "en" };

var localizationOptions = new RequestLocalizationOptions()
    .SetDefaultCulture("en-GB"); // Make English UK the default

app.UseExceptionHandler(); 

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReact");

app.UseRequestLocalization(localizationOptions);

app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();

app.Run();