using System.ComponentModel.DataAnnotations;

namespace AllTheBeans.Application.DTOs;

public record CreateOrderItemDto
{
    [Required] public int BeanId { get; set; }
    [Required] [Range(1, 100)] public int Quantity { get; set; }
}

public record CreateOrderDto
{
    [Required]
    [MinLength(1, ErrorMessage = "Order must contain at least one item")]
    public List<CreateOrderItemDto> Items { get; set; } = new();
}