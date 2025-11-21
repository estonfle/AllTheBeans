using AllTheBeans.Application.DTOs;
using AllTheBeans.Domain.Entities;
using AllTheBeans.Domain.Interfaces;

namespace AllTheBeans.Application.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IBeanRepository _beanRepository;

    public OrderService(IOrderRepository orderRepository, IBeanRepository beanRepository)
    {
        _orderRepository = orderRepository;
        _beanRepository = beanRepository;
    }

    public async Task<Order> PlaceOrderAsync(OrderDto dto, string userId)
    {
        // 1. Validation: Ensure Quantity is valid
        if (dto.Quantity <= 0)
        {
            throw new ArgumentException("Quantity must be at least 1.");
        }

        // 2. Validation: Ensure the Bean actually exists
        var bean = await _beanRepository.GetByIdAsync(dto.BeanId);
        if (bean == null)
        {
            throw new KeyNotFoundException($"Coffee Bean with ID {dto.BeanId} not found.");
        }

        // 3. Business Logic: Create the Order Entity
        // Note: In a more complex system, we might calculate total cost here 
        // or snapshot the price, but per requirements, we store the basic details.
        var order = new Order
        {
            UserId = userId,
            CoffeeBeanId = dto.BeanId,
            Quantity = dto.Quantity,
            OrderDate = DateTime.UtcNow
        };

        // 4. Persistence
        await _orderRepository.AddAsync(order);

        return order;
    }
}