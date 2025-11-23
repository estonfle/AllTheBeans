using AllTheBeans.Application.DTOs;
using AllTheBeans.Domain.Entities;

namespace AllTheBeans.Application.Services;

public interface IBeanService
{
    Task<PagedResult<CoffeeBean>> SearchBeansAsync(string? query, int page, int pageSize);
    Task<CoffeeBean?> GetBeanByIdAsync(int id);
    Task<CoffeeBean> GetBeanOfTheDayAsync();
}