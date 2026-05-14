using System.ComponentModel.DataAnnotations;

namespace CrecheMais.Api.Models
{
    public class Usuario
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Email { get; set; } = default!;
        [Required]
        public string Senha { get; set; } = default!;
        public string TipoUsuario { get; set; } = default!; // Admin, Pai, Professor
    }
}