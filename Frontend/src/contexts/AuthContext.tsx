import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import StorageService from "../services/storage.service";
import { LoginDto } from "../models/loginDto";
import { AccessToken } from "../models/accessToken";
import { User } from "../models/user";
import BaseService from "../services/_base.service";
import { TwoStepLoginDto } from "../models/twoStepLoginDto";

interface AuthContextProps {
    isAuthenticated: boolean;
    logout: () => void;
    login: (loginDto: LoginDto) => void;
    verifyTwoFactorAuth: (dto: TwoStepLoginDto) => void;
    currentUser: User | null;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextProps>({
    isAuthenticated: false,
    logout: () => { },
    login: (loginDto: LoginDto) => { },
    currentUser: null,
    setCurrentUser: () => { },
    verifyTwoFactorAuth: (dto: TwoStepLoginDto) => { }
});

export const AuthProvider = ({ children }: any) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const checkToken = async () => {
            const token = StorageService.getAccessToken();
            if (token) {
                setIsAuthenticated(true);
                getUserInfo()
                return;
            }
            setIsAuthenticated(false);
            return;
        }

        checkToken();
        console.log(isAuthenticated)
    }, [isAuthenticated])

    const logout = () => {
        StorageService.clearAccessToken();
        setIsAuthenticated(false);
        setCurrentUser(null);
    }

    const login = async (loginDto: LoginDto) => {
        await BaseService.login(loginDto).then((res: any) => {

            const is2FAEnabled = res.data.is2FAEnabled;
            const token = res.data.jwt?.token ?? null;

            if (!is2FAEnabled) {
                if (token) {
                    StorageService.setAccessToken(token);
                    setIsAuthenticated(true);
                    toast.success("Giriş başarılı");
                    getUserInfo();
                } else {
                    setIsAuthenticated(false);
                    toast.error("Giriş başarısız");
                }
            } else {
                const user: User = {
                    email: loginDto.email,
                    isTwoFactorEnabled: true,
                    fullName: "",
                    id: 0,
                    password: "",
                }
                setCurrentUser(user);

            }

        }).catch((err: any) => {
            console.log(err)
            setIsAuthenticated(false);
            toast.error(err.response.data?.message || "Giriş yapılırken bir hata oluştu");
        })
    }

    const verifyTwoFactorAuth = async (dto: TwoStepLoginDto) => {
        BaseService.verifyCode(dto).then(res => {
            const token=res.data.token;
            StorageService.setAccessToken(token);
            setIsAuthenticated(true);
            toast.success("Giriş başarılı");
            getUserInfo();

        }).catch(err => {
            console.log(err)
            toast.error(err.response.data?.message || "Giriş yapılırken bir hata oluştu");
        })
    }

    const getUserInfo = () => {
        BaseService.getUserInfo().then((res) => {
            const user = res.data as User;
            setCurrentUser(user);
        }).catch((err) => {
            console.log(err)
        })
    }


    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            logout,
            login,
            currentUser,
            setCurrentUser,
            verifyTwoFactorAuth
        }}>
            {children}
        </AuthContext.Provider>
    )
}