namespace ExternalAuthAnd2FAExample.Models
{
    public record RegisterVM
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
