namespace ExternalAuthAnd2FAExample.Models
{
    public record EnableTwoFactorAuthVM
    {
        public string Email { get; set; }
        public string SecretKey { get; set; }
        public string AuthenticatorUri { get; set; }
        public string Code { get; set; }
    }
    public record TwoStepLoginVM
    {
        public string Email { get; set; }
        public string Code { get; set; }
    }
}
