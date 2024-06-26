namespace ExternalAuthAnd2FAExample.Models
{
    public record LoginVM
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
