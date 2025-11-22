using AllTheBeans.Domain.Entities;

namespace AllTheBeans.Domain.Interfaces;

public interface IOrderRepository
{
    Task AddAsync(Order order);
    Task<Order?> GetByIdAsync(int id);
    Task UpdateAsync(Order order);
    Task DeleteAsync(Order order);
    Task<IEnumerable<Order>> GetOrdersByUserIdAsync(string userId);
}