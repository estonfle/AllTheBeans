namespace AllTheBeans.Application.DTOs;

public record OrderItemResponseDto(
    int BeanId, 
    string BeanName, 
    string Image, 
    int Quantity, 
    decimal UnitPrice
);

public record OrderResponseDto(
    int OrderId, 
    DateTime OrderDate, 
    decimal TotalCost, 
    List<OrderItemResponseDto> Items
);