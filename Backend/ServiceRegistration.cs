using ExternalAuthAnd2FAExample.Services;
using ExternalAuthAnd2FAExample.Utils.JWT;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TokenHandler = ExternalAuthAnd2FAExample.Utils.JWT.TokenHandler;

namespace ExternalAuthAnd2FAExample
{
    public static class ServiceRegistration
    {
        public static void AddCustomServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AppDBContext>(options => options.UseSqlServer(configuration.GetConnectionString("SQLServer")));
            AddJWt(services, configuration);
            services.AddTransient<ITokenHandler, TokenHandler>();
            services.AddScoped<IUserService,UserService>();
        }

        private static void AddJWt(IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<TokenSettings>(configuration.GetSection("TokenSettings"));
            services.AddSingleton<ITokenSettings>(p => p.GetRequiredService<IOptions<TokenSettings>>().Value);

            var tokenSettings = configuration.GetSection("TokenSettings").Get<TokenSettings>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidIssuer = tokenSettings.Issuer,
                    ValidAudience = tokenSettings.Audience,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenSettings.SecurityKey))
                };
            });
        }

    }
}
