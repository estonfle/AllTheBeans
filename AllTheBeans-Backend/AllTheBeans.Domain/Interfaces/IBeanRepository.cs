using AllTheBeans.Domain.Entities;

namespace AllTheBeans.Domain.Interfaces;

public interface IBeanRepository
{
    Task<IEnumerable<CoffeeBean>> GetAllAsync();
    Task<CoffeeBean?> GetByIdAsync(int id);
    Task<CoffeeBean?> GetBotdAsync(DateTime date);
    Task<IEnumerable<CoffeeBean>> GetBeansExcludingAsync(int beanId);
    Task AddBotdAsync(BeanOfTheDay botd);
    Task AddRangeAsync(IEnumerable<CoffeeBean> beans); 
}