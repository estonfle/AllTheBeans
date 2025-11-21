namespace AllTheBeans.Domain.Entities;
public class Order
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int CoffeeBeanId { get; set; }
    public int Quantity { get; set; }
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
}