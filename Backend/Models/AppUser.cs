using System.ComponentModel.DataAnnotations;

namespace ExternalAuthAnd2FAExample.Models
{
    public class AppUser
    {
        [Key]
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public bool IsTwoFactorEnabled { get; set; }
        public string? SecretKey { get; set; } 
    }
}
