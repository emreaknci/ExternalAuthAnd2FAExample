using Azure.Core;
using ExternalAuthAnd2FAExample;
using ExternalAuthAnd2FAExample.Models;
using ExternalAuthAnd2FAExample.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

builder.Services.AddCustomServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();


app.MapPost("/register", async (RegisterVM vm, IUserService _userService) =>
{
    var result = await _userService.RegisterAsync(vm);
    return result ? Results.Ok() : Results.BadRequest();
});

app.MapPost("/login", async (LoginVM vm, IUserService _userService) =>
{
    var result = await _userService.LoginAsync(vm);
    return (result.is2FAEnabled && result.jwt == null) || (!result.is2FAEnabled && result.jwt != null)
    ? Results.Ok(new { result.jwt, result.is2FAEnabled })
    : Results.BadRequest();
});

app.MapGet("/", async (IUserService _userService, ClaimsPrincipal claimsPrincipal) =>
{
    var userEmail = claimsPrincipal.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)!.Value;
    var user = await _userService.GetUser(u => u.Email == userEmail);

    return user != null ? Results.Ok(user) : Results.BadRequest();
});


app.MapGet("/generate-2fa-qr", async (IUserService _userService, ClaimsPrincipal claimsPrincipal) =>
{
    var userEmail = claimsPrincipal.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)!.Value;
    var user = await _userService.GetUser(u => u.Email == userEmail);

    EnableTwoFactorAuthVM vm = new();
    vm.Email = userEmail;

    (string secretKey, string qrCodeUrl) = await _userService.GenerateTwoFactorInfo(vm.Email);

    vm.SecretKey = secretKey;
    vm.AuthenticatorUri = qrCodeUrl;

    return Results.Ok(vm);
});

app.MapPost("/enable-2fa", async (EnableTwoFactorAuthVM vm, IUserService _userService) =>
{
    var res = await _userService.EnableTwoFactorAuth(vm);
    return res ? Results.Ok(vm) : Results.BadRequest(vm);
});

app.MapGet("/disable-2fa", async (IUserService _userService, ClaimsPrincipal claimsPrincipal) =>
{
    var userEmail = claimsPrincipal.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)!.Value;
    var res = await _userService.DisableTwoFactorAuth(userEmail);

    return res ? Results.Ok() : Results.BadRequest();
});

app.MapPost("/verify-code", async (TwoStepLoginVM vm, IUserService _userService) =>
{
    var result = await _userService.VerifyTwoFactorAuthentication(vm);
    return result != null ? Results.Ok(result) : Results.BadRequest();

});

app.Run();
