using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;

namespace AllTheBeans.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GreetingController : ControllerBase
{
    private readonly IStringLocalizer<SharedResource> _localizer;

    public GreetingController(IStringLocalizer<SharedResource> localizer)
    {
        _localizer = localizer;
    }

    [HttpGet(Name = "greeting")]
    public async Task<ActionResult> Get()
    {
        // This will look for a key called "WelcomeMessage" in the .resx file
        var message = _localizer["WelcomeMessage"].Value;
        
        return Ok(new { Message = message });
    }
}