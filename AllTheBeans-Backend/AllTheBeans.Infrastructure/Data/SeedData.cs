using System.Text.Json;
using AllTheBeans.Domain.Entities; // Uses Domain Entity
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace AllTheBeans.Infrastructure.Data;

public static class SeedData
{
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        // create a scope to resolve the DbContext
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Ensure the DB is created (Infrastructure concern)
        await context.Database.EnsureCreatedAsync();

        // Check if we need to seed
        if (!context.CoffeeBeans.Any())
        {
            // Robust way to find the file: look in the executing directory (bin) first
            var filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "assets", "beans.json");

            // Fallback: look in the current working directory (useful for local dev)
            if (!File.Exists(filePath))
            {
                filePath = Path.Combine(Directory.GetCurrentDirectory(), "assets", "beans.json");
            }

            if (File.Exists(filePath))
            {
                var jsonString = await File.ReadAllTextAsync(filePath);
                
                // Deserialize to internal DTO
                var rawBeans = JsonSerializer.Deserialize<List<RawBeanDto>>(jsonString);

                if (rawBeans != null)
                {
                    // Map Raw JSON DTO -> Domain Entity
                    var beans = rawBeans.Select(b => new CoffeeBean
                    {
                        Name = b.Name,
                        Description = b.Description,
                        Image = b.Image,
                        Colour = b.colour, // Matches JSON "colour" lowercase
                        Country = b.Country,
                        // Parse "£26.53" to decimal 26.53
                        Cost = decimal.TryParse(b.Cost.Replace("£", ""), out var c) ? c : 0
                    });

                    await context.CoffeeBeans.AddRangeAsync(beans);
                    await context.SaveChangesAsync();
                }
            }
        }
    }

    // Private DTO to match the specific shape of the JSON file
    // We do not expose this to the rest of the application
    private class RawBeanDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public string colour { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string Cost { get; set; } = string.Empty;
    }
}