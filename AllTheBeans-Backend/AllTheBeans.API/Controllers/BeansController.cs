using AllTheBeans.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace AllTheBeans.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BeansController : ControllerBase
{
    private readonly IBeanService _beanService;

    public BeansController(IBeanService beanService)
    {
        _beanService = beanService;
    }

    [HttpGet]
    public async Task<IActionResult> GetBeans([FromQuery] string? search)
    {
        var result = await _beanService.SearchBeansAsync(search);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetBean(int id)
    {
        var bean = await _beanService.GetBeanByIdAsync(id);
        if (bean == null) return NotFound();
        return Ok(bean);
    }

    [HttpGet("botd")]
    public async Task<IActionResult> GetBeanOfTheDay()
    {
        try 
        {
            var bean = await _beanService.GetBeanOfTheDayAsync();
            return Ok(bean);
        }
        catch (Exception ex)
        {
            return Problem(ex.Message);
        }
    }
}