using AllTheBeans.Application.DTOs;
using AllTheBeans.Domain.Entities;

namespace AllTheBeans.Application.Services;

public interface IOrderService
{
    /// <summary>
    /// Validates and places an order for a specific user.
    /// </summary>
    /// <param name="List of CreateOrderItemDto">The order details (BeanId, Quantity)</param>
    /// <param name="userId">The ID of the authenticated user</param>
    /// <returns>The created Order entity</returns>
    Task<Order> CreateOrderAsync(CreateOrderDto dto, string userId);
}