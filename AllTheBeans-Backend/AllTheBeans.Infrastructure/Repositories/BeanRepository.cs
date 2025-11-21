using AllTheBeans.Domain.Entities;
using AllTheBeans.Domain.Interfaces;
using AllTheBeans.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AllTheBeans.Infrastructure.Repositories;

public class BeanRepository : IBeanRepository
{
    private readonly AppDbContext _context;

    public BeanRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CoffeeBean>> GetAllAsync() => 
        await _context.CoffeeBeans.ToListAsync();

    public async Task<CoffeeBean?> GetByIdAsync(int id) => 
        await _context.CoffeeBeans.FindAsync(id);

    public async Task<CoffeeBean?> GetBotdAsync(DateTime date)
    {
        var log = await _context.BeanOfTheDays.FirstOrDefaultAsync(l => l.Date == date);
        if (log == null) return null;
        return await _context.CoffeeBeans.FindAsync(log.CoffeeBeanId);
    }

    public async Task<IEnumerable<CoffeeBean>> GetBeansExcludingAsync(int beanId) =>
        await _context.CoffeeBeans.Where(b => b.Id != beanId).ToListAsync();

    public async Task AddBotdAsync(BeanOfTheDay log)
    {
        _context.BeanOfTheDays.Add(log);
        await _context.SaveChangesAsync();
    }
    
    public async Task AddRangeAsync(IEnumerable<CoffeeBean> beans)
    {
        await _context.CoffeeBeans.AddRangeAsync(beans);
        await _context.SaveChangesAsync();
    }
}