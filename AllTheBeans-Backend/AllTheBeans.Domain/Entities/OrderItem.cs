using System.ComponentModel.DataAnnotations.Schema;

namespace AllTheBeans.Domain.Entities;

public class OrderItem
{
    public int Id { get; set; }
    
    public int OrderId { get; set; }
    public Order Order { get; set; } = null!; 

    public int CoffeeBeanId { get; set; }
    public CoffeeBean CoffeeBean { get; set; } = null!; 

    public int Quantity { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal UnitPrice { get; set; } 
}