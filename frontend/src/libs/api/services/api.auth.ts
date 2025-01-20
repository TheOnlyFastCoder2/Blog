import { instance, headers } from '../api.config';
import {AxiosResponse} from 'axios';


export default abstract class AuthService {
    static authMeByJWT (accessToken:string): Promise<AxiosResponse<IUserDTO, any>> {
        return instance.get('/auth/verify-token', {
            baseURL: instance.defaults.baseURL,
            headers: {
                ...headers,
                Authorization: `Bearer ${accessToken}`,
            }
        });
    }

    static signIn (data:ISignInDTO): Promise<AxiosResponse<IUserDTO, any>> {
        return instance.post('/auth/sign-in', data);
    }

    static signUp(data:ISignUpDTO): Promise<AxiosResponse<string, any>>  {
        return instance.post('/auth/sign-up', data);
    }
}


export interface ISignInDTO {
    email: string, 
    password: string,
}

export interface ISignUpDTO {
    username: string,
    email: string,
    password: string,
}

export interface IUserDTO {
    id: number;
    email: string;
    username: string;
    created_at: Date;
    token: string;
}