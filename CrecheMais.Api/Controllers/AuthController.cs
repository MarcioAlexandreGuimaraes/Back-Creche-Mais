using Microsoft.AspNetCore.Mvc;
using CrecheMais.Api.Data;
using CrecheMais.Api.Models;
using System.Text.Json.Serialization;

namespace CrecheMais.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        // O construtor recebe o contexto do banco configurado no Program.cs
        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel dados)
        {
            if (dados == null || string.IsNullOrEmpty(dados.Email))
                return BadRequest(new { success = false, message = "Dados inválidos." });

            // Busca no banco: Comparamos o Email e a Senha (que está na classe Usuario)
            // com o Password (que vem do LoginModel/JavaScript)
            var usuario = _context.Usuarios
                .FirstOrDefault(u => u.Email == dados.Email && u.Senha == dados.Password);

            if (usuario != null)
            {
                return Ok(new { 
                    success = true, 
                    message = "Login realizado com sucesso!",
                    userType = usuario.TipoUsuario 
                });
            }

            return Unauthorized(new { success = false, message = "E-mail ou senha incorretos." });
        }

        // Endpoint para o login do Google que está no seu JS
        [HttpPost("google-check")]
        public IActionResult GoogleCheck([FromBody] GoogleLoginModel dados)
        {
            var usuario = _context.Usuarios.FirstOrDefault(u => u.Email == dados.Email);

            if (usuario == null)
            {
                // Se não existe no SQL, avisamos o Front para cadastrar
                return Ok(new { isNewUser = true });
            }

            return Ok(new { isNewUser = false });
        }
    }

    // Modelos de entrada (Data Transfer Objects)
    public class GoogleLoginModel
    {
        [JsonPropertyName("email")]
        public string Email { get; set; } = default!;
    }
}
