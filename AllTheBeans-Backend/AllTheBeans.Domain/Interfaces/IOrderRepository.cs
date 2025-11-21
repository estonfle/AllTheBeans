using AllTheBeans.Domain.Entities;

namespace AllTheBeans.Domain.Interfaces;

public interface IOrderRepository
{
    Task AddAsync(Order order);
}