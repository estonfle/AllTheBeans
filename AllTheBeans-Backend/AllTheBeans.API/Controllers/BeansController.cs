using AllTheBeans.Application.DTOs;
using AllTheBeans.Application.Services;
using AllTheBeans.Domain.Entities;
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

    [HttpGet(Name = "getAllBeans")]
    public async Task<ActionResult<PagedResultDto<CoffeeBean>>> GetBeans(
        [FromQuery] GetBeansDto dto)
    {
        var result = await _beanService.SearchBeansAsync(dto);
        return Ok(result);
    }

    [HttpGet("{id}", Name = "getBeanById")]
    public async Task<ActionResult<CoffeeBean?>> GetBean(int id)
    {
        var bean = await _beanService.GetBeanByIdAsync(id);
        if (bean == null) return NotFound();
        return Ok(bean);
    }

    [HttpGet("botd", Name = "getBeanOfTheDay")]
    public async Task<ActionResult<CoffeeBean>> GetBeanOfTheDay()
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