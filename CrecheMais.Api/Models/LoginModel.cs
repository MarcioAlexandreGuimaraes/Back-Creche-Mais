using System.Text.Json.Serialization;

namespace CrecheMais.Api.Models
{
    public class LoginModel
    {
        [JsonPropertyName("Email")] // Garante que o C# entenda o "Email" vindo do JS
        public string Email { get; set; } = default!;

        [JsonPropertyName("Password")] // Mapeia o "Password" do JS para esta propriedade
        public string Password { get; set; } = default!;
    }
}