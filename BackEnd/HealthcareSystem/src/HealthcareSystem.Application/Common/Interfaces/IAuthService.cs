namespace HealthcareSystem.Application.Common.Interface;
 public record RegisterDto(string Email,string Password,string Role,string FirstName,string LastName);
 public record LoginDto(string Email,string Password);
 public record AuthResult(string Token,string Email,string Role);
 public interface IAuthService
{
    Task<AuthResult> RegisterAsync(RegisterDto dto);
    Task<AuthResult> LoginAsync(LoginDto dto);
}