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

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] OrderDto dto)
    {

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (string.IsNullOrEmpty(userId)) 
            return Unauthorized("User ID claim not found.");

        var order = await _orderService.CreateOrderAsync(dto, userId);

        return Ok(new { Message = "Order created successfully", OrderId = order.Id });
    }
}