using AllTheBeans.Domain.Entities;
using AllTheBeans.Domain.Interfaces;
using AllTheBeans.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AllTheBeans.Infrastructure.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _context;

    public OrderRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Order?> GetByIdAsync(int id)
{
    return await _context.Orders
        .Include(o => o.Items)
        .ThenInclude(i => i.CoffeeBean) 
        .FirstOrDefaultAsync(o => o.Id == id);
}

    public async Task AddAsync(Order order)
    {
        // Add the entity to the DbSet
        await _context.Orders.AddAsync(order);
        
        // Commit changes to the database
        await _context.SaveChangesAsync();
    }
}