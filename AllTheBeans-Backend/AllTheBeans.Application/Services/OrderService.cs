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
            Items = new List<OrderItem>()
        };

        foreach (var itemDto in dto.Items)
        {
            var bean = await _beanRepository.GetByIdAsync(itemDto.BeanId);
            if (bean == null)
            {
                throw new KeyNotFoundException($"Bean with ID {itemDto.BeanId} not found.");
            }

            order.Items.Add(new OrderItem
            {
                CoffeeBeanId = bean.Id,
                Quantity = itemDto.Quantity,
                UnitPrice = bean.Cost 
            });
        }

        await _orderRepository.AddAsync(order);

        return order;
    }

    public async Task<IEnumerable<OrderResponseDto>> GetUserOrdersAsync(string userId)
    {
        var orders = await _orderRepository.GetOrdersByUserIdAsync(userId);

        // Map Entity -> Response DTO
        return orders.Select(o => new OrderResponseDto(
            o.Id,
            o.OrderDate,
            o.Items.Sum(i => i.Quantity * i.UnitPrice), // Calculate Total
            o.Items.Select(i => new OrderItemResponseDto(
                i.CoffeeBeanId,
                i.CoffeeBean.Name,
                i.CoffeeBean.Image,
                i.Quantity,
                i.UnitPrice
            )).ToList()
        ));
    }

    public async Task UpdateOrderAsync(int orderId, UpdateOrderDto dto, string userId)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);

        if (order == null) throw new KeyNotFoundException($"Order {orderId} not found");
        if (order.UserId != userId) throw new UnauthorizedAccessException("Not authorized");

        // STRATEGY: Clear existing items and re-add new ones
        // This handles removing items, adding items, and changing quantities all at once.
        order.Items.Clear();

        foreach (var itemDto in dto.Items)
        {
            var bean = await _beanRepository.GetByIdAsync(itemDto.BeanId);
            if (bean == null) throw new KeyNotFoundException($"Bean {itemDto.BeanId} not found");

            order.Items.Add(new OrderItem
            {
                OrderId = orderId, // Link to parent
                CoffeeBeanId = bean.Id,
                Quantity = itemDto.Quantity,
                UnitPrice = bean.Cost // Re-snapshot price
            });
        }

        await _orderRepository.UpdateAsync(order);
    }

    public async Task CancelOrderAsync(int orderId, string userId)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null) throw new KeyNotFoundException($"Order {orderId} not found");
        if (order.UserId != userId) throw new UnauthorizedAccessException("Not authorized");

        await _orderRepository.DeleteAsync(order);
    }
}