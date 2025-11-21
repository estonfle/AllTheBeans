using AllTheBeans.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AllTheBeans.Infrastructure.Data;

public class AppDbContext : IdentityDbContext<User>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<CoffeeBean> CoffeeBeans { get; set; }
    public DbSet<BeanOfTheDay> BeanOfTheDays { get; set; }
    public DbSet<Order> Orders { get; set; }
}