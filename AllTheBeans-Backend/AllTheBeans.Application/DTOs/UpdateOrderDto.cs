using System.ComponentModel.DataAnnotations;

namespace AllTheBeans.Application.DTOs;

public record UpdateOrderDto
{
    [Required]
    [MinLength(1, ErrorMessage = "Order must contain at least one item")]
    public List<CreateOrderItemDto> Items { get; set; } = new();
}