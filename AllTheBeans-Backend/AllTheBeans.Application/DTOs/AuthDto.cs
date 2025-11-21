using System.ComponentModel.DataAnnotations;

namespace AllTheBeans.Application.DTOs;

public record RegisterDto
{
    [Required] public string Username { get; set; } = string.Empty;
    [Required] public string Email { get; set; } = string.Empty;
    [Required] public string Password { get; set; } = string.Empty;
}

public record LoginDto
{
    [Required] public string Username { get; set; } = string.Empty;
    [Required] public string Password { get; set; } = string.Empty;
}

public record AuthResponseDto(string Token, string Username);