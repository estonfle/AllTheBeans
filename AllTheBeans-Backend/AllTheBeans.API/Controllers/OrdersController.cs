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
    public async Task<IActionResult> PlaceOrder([FromBody] OrderDto dto)
    {
        // Extract User ID securely from the JWT Token claims
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (string.IsNullOrEmpty(userId)) 
            return Unauthorized("User ID claim not found.");

        // Delegate logic to the Service
        // Note: Exceptions (like KeyNotFound or ArgumentException) are 
        // handled by the GlobalExceptionHandler we set up earlier.
        var order = await _orderService.PlaceOrderAsync(dto, userId);

        return Ok(new { Message = "Order placed successfully", OrderId = order.Id });
    }
}