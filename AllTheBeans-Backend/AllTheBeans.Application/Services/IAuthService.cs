using AllTheBeans.Application.DTOs;
using Microsoft.AspNetCore.Identity;

namespace AllTheBeans.Application.Services;

public interface IAuthService
{
    Task<AuthResponseDto?> LoginAsync(LoginDto dto);
    Task<IEnumerable<IdentityError>> RegisterAsync(RegisterDto dto);
}