import axios, { AxiosResponse } from 'axios';
import StorageService from './storage.service';
import { AccessToken } from '../models/accessToken';
import { LoginDto } from '../models/loginDto';
import { RegisterDto } from '../models/registerDto';
import { User } from '../models/user';
import { EnableTwoFactorAuthDto } from '../models/enableTwoFactorAuthDto';
import { TwoStepLoginDto } from '../models/twoStepLoginDto';

const base_url = import.meta.env.VITE_BACKEND_ENDPOINT;

const axiosInstance = axios.create({
    baseURL: `${base_url}`,
    headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache"
    }
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = StorageService.getAccessToken();

        const bearerToken = token;

        config.headers.Authorization = `Bearer ${bearerToken}`;

        return config;
    },
    (error) => {
        console.log("InterceptorError: ", error)
        return Promise.reject(error);
    }
);

const BaseService = {
    async login(data: LoginDto): Promise<AxiosResponse<boolean, AccessToken>> {
        return await axiosInstance.post(`/login`, data);
    },

    async register(data: RegisterDto): Promise<AxiosResponse<boolean>> {
        return axiosInstance.post(`/register`, data);
    },

    async getUserInfo(): Promise<AxiosResponse<User>> {
        return axiosInstance.get(`/`);
    },

    async generate2FAuthQR(): Promise<AxiosResponse<EnableTwoFactorAuthDto>> {
        return axiosInstance.get('/generate-2fa-qr');
    },

    async enable2FAuth(dto: EnableTwoFactorAuthDto): Promise<AxiosResponse<boolean>> {
        return axiosInstance.post('/enable-2fa', dto);
    },

    async disable2FAuth(): Promise<AxiosResponse<boolean>> {
        return axiosInstance.get('/disable-2fa');
    },

    async verifyCode(dto: TwoStepLoginDto): Promise<AxiosResponse<AccessToken>> {
        return axiosInstance.post('/verify-code', dto);
    }
}




export default BaseService;