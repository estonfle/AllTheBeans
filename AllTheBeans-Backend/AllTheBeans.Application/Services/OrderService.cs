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

    public async Task<Order> CreateOrderAsync(CreateOrderDto dto, string userId)
    {
        var order = new Order
        {
            UserId = userId,
            OrderDate = DateTime.UtcNow,
            Items = new List<OrderItem>()
        };

        // Loop through incoming items
        foreach (var itemDto in dto.Items)
        {
            // Validate Bean Existence
            var bean = await _beanRepository.GetByIdAsync(itemDto.BeanId);
            if (bean == null)
            {
                throw new KeyNotFoundException($"Bean with ID {itemDto.BeanId} not found.");
            }

            // Create OrderItem (Database snapshot)
            order.Items.Add(new OrderItem
            {
                CoffeeBeanId = bean.Id,
                Quantity = itemDto.Quantity,
                UnitPrice = bean.Cost // Snapshotting the price
            });
        }

        // Save the Parent (EF Core automatically saves the Children in the list)
        await _orderRepository.AddAsync(order);

        return order;
    }
}