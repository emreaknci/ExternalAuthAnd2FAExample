using Azure.Core;
using ExternalAuthAnd2FAExample.Models;
using ExternalAuthAnd2FAExample.Utils.JWT;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;
using OtpNet;
using System;
using System.Linq.Expressions;
using System.Text;

namespace ExternalAuthAnd2FAExample.Services
{
    public class UserService : IUserService
    {
        private readonly AppDBContext _dbContext;
        private readonly ITokenHandler _tokenHandler;

        public UserService(AppDBContext dbContext, ITokenHandler tokenHandler)
        {
            _dbContext = dbContext;
            _tokenHandler = tokenHandler;
        }

        public async Task<bool> EnableTwoFactorAuth(EnableTwoFactorAuthVM vm)
        {
            try
            {
                var totp = new Totp(Base32Encoding.ToBytes(vm.SecretKey));
                var verified = totp.VerifyTotp(vm.Code, out _, new VerificationWindow(2, 2)); // Adjust window size as needed
                if (verified)
                {
                    var userDb = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == vm.Email);
                    if (userDb != null)
                    {
                        userDb.SecretKey = vm.SecretKey;
                        userDb.IsTwoFactorEnabled = true;
                        var res = _dbContext.Users.Update(userDb);
                        await _dbContext.SaveChangesAsync();
                        return true;
                    }
                }
                return false;
            }
            catch (Exception ex)
            {

                return false;
            }

        }

        public async Task<bool> DisableTwoFactorAuth(string email)
        {
            try
            {
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
                if (user != null)
                {
                    user.SecretKey = string.Empty;
                    user.IsTwoFactorEnabled = false;
                    var res = _dbContext.Users.Update(user);
                    await _dbContext.SaveChangesAsync();
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                return false;
            }

        }

        public async Task<(string secretKey, string qrCodeUrl)> GenerateTwoFactorInfo(string email)
        {
            const string validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
            var random = new Random();

            var secretKeyBuilder = new StringBuilder(16);
            for (int i = 0; i < 16; i++)
            {
                secretKeyBuilder.Append(validChars[random.Next(validChars.Length)]);
            }

            var secretKey = secretKeyBuilder.ToString();

            var encodedUserEmail = Uri.EscapeDataString(email);
            var qrCodeUrl = $"otpauth://totp/{encodedUserEmail}?secret={secretKey}&issuer=TwoFactorAuthExample";

            return (secretKey, qrCodeUrl);
        }

        public async Task<AppUser> GetUser(Expression<Func<AppUser, bool>> expression)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(expression);
            return user;
        }

        public async Task<(bool is2FAEnabled, Utils.JWT.AccessToken? jwt)> LoginAsync(LoginVM vm)
        {
            try
            {
                var user = await _dbContext.Users.FirstOrDefaultAsync(m => m.Email == vm.Email);

                if (user != null && BCrypt.Net.BCrypt.Verify(vm.Password, user.Password))
                {
                    if (!user.IsTwoFactorEnabled)
                    {
                        var token = _tokenHandler.CreateAccessToken(user);
                        return (false, token);
                    }
                    else
                    {
                        return (true, null);
                    }
                }
                else
                {
                    return (false, null);
                }
            }
            catch (Exception ex)
            {
                return (false, null);
            }
        }


        public async Task<bool> RegisterAsync(RegisterVM vm)
        {
            try
            {
                bool isExist = await _dbContext.Users.AnyAsync(u => u.Email == vm.Email);
                if (isExist)
                {
                    return false;
                }
                AppUser user = new();

                user.FullName = vm.FullName;
                user.Email = vm.Email;

                user.Password = BCrypt.Net.BCrypt.HashPassword(vm.Password);

                var res = await _dbContext.Users.AddAsync(user);

                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<Utils.JWT.AccessToken?> VerifyTwoFactorAuthentication(TwoStepLoginVM vm)
        {
            try
            {
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == vm.Email);

                if (user != null && !string.IsNullOrEmpty(user.SecretKey) && !string.IsNullOrEmpty(vm.Code))
                {
                    var totp = new Totp(Base32Encoding.ToBytes(user.SecretKey));
                    var verifed = totp.VerifyTotp(vm.Code, out _, new VerificationWindow(2, 2));
                    var token = _tokenHandler.CreateAccessToken(user);
                    return token;
                }
                return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
