using AllTheBeans.Domain.Entities;

namespace AllTheBeans.Application.Services;

public interface IBeanService
{
    Task<IEnumerable<CoffeeBean>> SearchBeansAsync(string? query);
    Task<CoffeeBean?> GetBeanByIdAsync(int id);
    Task<CoffeeBean> GetBeanOfTheDayAsync();
}