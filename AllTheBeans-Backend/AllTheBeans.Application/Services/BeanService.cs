using AllTheBeans.Application.DTOs;
using AllTheBeans.Domain.Entities;
using AllTheBeans.Domain.Interfaces;

namespace AllTheBeans.Application.Services;

public class BeanService : IBeanService
{
    private readonly IBeanRepository _repository;

    public BeanService(IBeanRepository repository)
    {
        _repository = repository;
    }

    public async Task<PagedResult<CoffeeBean>> SearchBeansAsync(string? query, int page, int pageSize)
    {
        var allBeans = await _repository.GetAllAsync();

        if (!string.IsNullOrWhiteSpace(query))
        {
            var s = query.ToLower();
            allBeans = allBeans.Where(b => 
            b.Name.ToLower().Contains(s) ||
            b.Description.ToLower().Contains(s) ||
            b.Colour.ToLower().Contains(s) ||
            b.Country.ToLower().Contains(s) ||
            b.Cost.ToString().Contains(s));
        }

        var list = allBeans.ToList();
        var totalCount = list.Count;
        
        var pagedItems = list
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return new PagedResult<CoffeeBean>
        {
            Items = pagedItems,
            TotalCount = totalCount,
            PageNumber = page,
            PageSize = pageSize
        };
    }

    public async Task<CoffeeBean?> GetBeanByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<CoffeeBean> GetBeanOfTheDayAsync()
    {
        var today = DateTime.UtcNow.Date;
        
        // 1. Check if today already has a bean
        var existingLog = await _repository.GetBotdAsync(today);
        if (existingLog != null) return existingLog;

        // 2. Logic: Get yesterday's bean to exclude it
        var yesterday = today.AddDays(-1);
        var lastLog = await _repository.GetBotdAsync(yesterday);
        int excludeId = lastLog?.Id ?? 0;

        // 3. Get available beans
        var candidates = (await _repository.GetBeansExcludingAsync(excludeId)).ToList();
        
        if (!candidates.Any()) throw new Exception("No beans available for BOTD");

        // 4. Select Random
        var randomBean = candidates[new Random().Next(candidates.Count)];

        // 5. Persist Logic
        await _repository.AddBotdAsync(new BeanOfTheDay
        {
            CoffeeBeanId = randomBean.Id,
            Date = today
        });

        return randomBean;
    }
}