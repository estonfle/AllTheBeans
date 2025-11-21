using AllTheBeans.Application.DTOs;
using AllTheBeans.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace AllTheBeans.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var errors = await _authService.RegisterAsync(dto);

        if (errors.Any())
        {
            return BadRequest(errors);
        }

        return Ok(new { Message = "User registered successfully" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto);

        if (result == null)
        {
            return Unauthorized(new { Detail = "Invalid username or password" });
        }

        return Ok(result);
    }
}