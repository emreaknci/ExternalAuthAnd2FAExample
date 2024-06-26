using ExternalAuthAnd2FAExample.Models;

namespace ExternalAuthAnd2FAExample.Utils.JWT
{
    public interface ITokenHandler
    {
        AccessToken CreateAccessToken(AppUser user);

    }
}
