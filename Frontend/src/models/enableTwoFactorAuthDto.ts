export interface EnableTwoFactorAuthDto{
    email:string;
    secretKey:string;
    authenticatorUri:string;
    code:string;
}
