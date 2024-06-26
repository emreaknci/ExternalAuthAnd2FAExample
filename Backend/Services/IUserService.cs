using ExternalAuthAnd2FAExample.Models;
using ExternalAuthAnd2FAExample.Utils.JWT;
using System.Linq.Expressions;

namespace ExternalAuthAnd2FAExample.Services
{
    public interface IUserService
    {
        Task<bool> RegisterAsync(RegisterVM vm);
        Task<(bool is2FAEnabled, AccessToken? jwt)> LoginAsync(LoginVM vm);

        Task<AppUser> GetUser(Expression<Func<AppUser, bool>> expression);
        Task<(string secretKey, string qrCodeUrl)> GenerateTwoFactorInfo(string email);
        Task<bool> EnableTwoFactorAuth(EnableTwoFactorAuthVM vm);
        Task<bool> DisableTwoFactorAuth(string email);
        Task<AccessToken?> VerifyTwoFactorAuthentication(TwoStepLoginVM vm);

    }
}
