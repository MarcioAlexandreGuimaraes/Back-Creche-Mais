
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        // 1. Aqui você validaria contra um Banco de Dados real (SQL Server, etc)
        // Exemplo simplificado de validação:
        if (request.Email == "admin@teste.com" && request.Password == "123456")
        {
            return Ok(new { 
                success = true, 
                message = "Login realizado com sucesso",
                userType = "complete" 
            });
        }

        return BadRequest(new { 
            success = false, 
            message = "E-mail ou senha incorretos." 
        });
    }
}

public class LoginRequest {
    public string Email { get; set; } = default!;
    public string Password { get; set; } = default!;
}
public class GoogleRequest {
    public string Email { get; set; } = default!;
}