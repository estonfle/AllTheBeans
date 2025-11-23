using AllTheBeans.Application.DTOs;
using AllTheBeans.Application.Services;
using AllTheBeans.Domain.Entities;
using AllTheBeans.Domain.Interfaces;
using FluentAssertions;
using Moq;
using Xunit;

namespace AllTheBeans.Tests.Services;

public class OrderServiceTests
{
    private readonly Mock<IOrderRepository> _mockOrderRepo;
    private readonly Mock<IBeanRepository> _mockBeanRepo;
    private readonly OrderService _service;

    public OrderServiceTests()
    {
        _mockOrderRepo = new Mock<IOrderRepository>();
        _mockBeanRepo = new Mock<IBeanRepository>();
        _service = new OrderService(_mockOrderRepo.Object, _mockBeanRepo.Object);
    }

    [Fact]
    public async Task PlaceOrder_ShouldCalculateTotals_AndSave()
    {
        // Arrange
        var userId = "user-123";
        var bean = new CoffeeBean { Id = 1, Cost = 10.00m };
        var dto = new CreateOrderDto 
        { 
            Items = new List<CreateOrderItemDto> { new() { BeanId = 1, Quantity = 2 } } 
        };

        _mockBeanRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(bean);

        // Act
        var result = await _service.CreateOrderAsync(dto, userId);

        // Assert
        result.UserId.Should().Be(userId);
        result.Items.Should().HaveCount(1);
        result.Items.First().UnitPrice.Should().Be(10.00m); // Snapshot check
        _mockOrderRepo.Verify(r => r.AddAsync(It.IsAny<Order>()), Times.Once);
    }

    [Fact]
    public async Task CancelOrder_ShouldThrowUnauthorized_IfUserDoesNotOwnOrder()
    {
        // Arrange
        var orderId = 5;
        var existingOrder = new Order { Id = orderId, UserId = "owner-user" };
        var maliciousUser = "hacker-user";

        _mockOrderRepo.Setup(r => r.GetByIdAsync(orderId)).ReturnsAsync(existingOrder);

        // Act
        var action = async () => await _service.CancelOrderAsync(orderId, maliciousUser);

        // Assert
        await action.Should().ThrowAsync<UnauthorizedAccessException>();
        _mockOrderRepo.Verify(r => r.DeleteAsync(It.IsAny<Order>()), Times.Never);
    }

    [Fact]
    public async Task UpdateOrder_ShouldReplaceItems()
    {
        // Arrange
        var orderId = 1;
        var userId = "owner";
        var order = new Order { Id = orderId, UserId = userId, Items = new List<OrderItem>() };
        
        var dto = new UpdateOrderDto { Items = new List<CreateOrderItemDto> { new() { BeanId = 2, Quantity = 5 } } };
        var bean = new CoffeeBean { Id = 2, Cost = 5m };

        _mockOrderRepo.Setup(r => r.GetByIdAsync(orderId)).ReturnsAsync(order);
        _mockBeanRepo.Setup(r => r.GetByIdAsync(2)).ReturnsAsync(bean);

        // Act
        await _service.UpdateOrderAsync(orderId, dto, userId);

        // Assert
        order.Items.Should().HaveCount(1);
        order.Items.First().Quantity.Should().Be(5);
        _mockOrderRepo.Verify(r => r.UpdateAsync(order), Times.Once);
    }
}