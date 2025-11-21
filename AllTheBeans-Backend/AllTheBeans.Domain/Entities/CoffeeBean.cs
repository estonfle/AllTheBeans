using System.ComponentModel.DataAnnotations.Schema;

namespace AllTheBeans.Domain.Entities;

public class CoffeeBean
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public string Colour { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    
    [Column(TypeName = "decimal(18, 2)")]
    public decimal Cost { get; set; } 
}