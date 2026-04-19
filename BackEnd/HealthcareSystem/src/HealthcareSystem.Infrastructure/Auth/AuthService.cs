using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HealthcareSystem.Application.Common.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace HealthcareSystem.Infrastructure.Auth;

public class AuthService : IAuthService
{
    private readonly UserManager<IdentityUser> _users;
    private readonly IConfiguration _config;

    public AuthService(UserManager<IdentityUser> users, IConfiguration config)
    { _users = users; _config = config; }

    public async Task<AuthResultDto> RegisterAsync(RegisterDto dto)
    {
        var user = new IdentityUser { UserName = dto.Email, Email = dto.Email };
        var result = await _users.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
        await _users.AddToRoleAsync(user, dto.Role);
        return new AuthResultDto(GenerateToken(user, dto.Role), dto.Email, dto.Role);
    }

    public async Task<AuthResultDto> LoginAsync(LoginDto dto)
    {
        var user = await _users.FindByEmailAsync(dto.Email)
            ?? throw new Exception("Invalid credentials");
        if (!await _users.CheckPasswordAsync(user, dto.Password))
            throw new Exception("Invalid credentials");
        var roles = await _users.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? "Patient";
        return new AuthResultDto(GenerateToken(user, role), dto.Email, role);
    }

    private string GenerateToken(IdentityUser user, string role)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email!),
            new Claim(ClaimTypes.Role, role)
        };
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(int.Parse(_config["Jwt:ExpiryMinutes"]!)),
            signingCredentials: creds);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}