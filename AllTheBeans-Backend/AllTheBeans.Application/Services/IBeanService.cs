using AllTheBeans.Application.DTOs;
using AllTheBeans.Domain.Entities;

namespace AllTheBeans.Application.Services;

public interface IBeanService
{
    Task<PagedResultDto<CoffeeBean>> SearchBeansAsync(GetBeansDto dto);
    Task<CoffeeBean?> GetBeanByIdAsync(int id);
    Task<CoffeeBean> GetBeanOfTheDayAsync();
}