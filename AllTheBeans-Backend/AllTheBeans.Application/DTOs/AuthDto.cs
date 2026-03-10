using System.ComponentModel.DataAnnotations;

namespace AllTheBeans.Application.DTOs;

public record RegisterDto
{
    [Required] 
    public string Username { get; set; } = string.Empty;

    [Required] 
    [EmailAddress] 
    public string Email { get; set; } = string.Empty;
    [Required] 
    public string Password { get; set; } = string.Empty;
}

public record LoginDto
{
    [Required] 
    [EmailAddress] 
    public string Email { get; set; } = string.Empty;
    
    [Required] 
    public string Password { get; set; } = string.Empty;
}

public record AuthResponseDto{
    [Required]
    public string Token { get; set; } = string.Empty;

    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Email { get; set; } = string.Empty;
};