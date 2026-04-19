using HealthcareSystem.Application.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthcareSystem.API.Controllers;
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthorizationService _auth;
    public AuthController(IAuthorizationService auth)
    {
        _auth=auth;
    }
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
     try
        {
            return Ok(await _auth.Register(dto));
        }   
        catch(Exception ex)
        {
            return BadRequest(new
            {
                message=ex.Message
            });
        }
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        try
        {
            return Ok(await _auth.LoginAsync(dto));
        }
        catch(Exception ex)
        {
            return Unauthorized(new {message=ex.Message});
        }
        
    }
}