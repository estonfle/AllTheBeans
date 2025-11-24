using System.Security.Claims;
using AllTheBeans.Application.DTOs;
using AllTheBeans.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AllTheBeans.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    // GET: api/orders (History)
    [HttpGet]
    public async Task<IActionResult> GetMyOrders()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var orders = await _orderService.GetUserOrdersAsync(userId);
        return Ok(orders);
    }

    // POST: api/orders (Create)
    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var order = await _orderService.CreateOrderAsync(dto, userId);
        return Ok(new { Message = "Order placed", OrderId = order.Id });
    }

    // PUT: api/orders/5 (Modify)
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateOrder(int id, [FromBody] UpdateOrderDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        await _orderService.UpdateOrderAsync(id, dto, userId);
        return Ok(new { Message = "Order updated successfully" });
    }

    // DELETE: api/orders/5 (Cancel)
    [HttpDelete("{id}")]
    public async Task<IActionResult> CancelOrder(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        await _orderService.CancelOrderAsync(id, userId);
        return Ok(new { Message = "Order cancelled successfully" });
    }
}