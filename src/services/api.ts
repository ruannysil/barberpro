import axios, { AxiosError } from 'axios'
import { parseCookies } from 'nookies'

import { AuthTokenError } from './errors/AuthTokenError';

import { signOut } from '../content/AuthContext';

export function setupAPIClient(ctx = undefined) {
    let cookies = parseCookies(ctx);

    const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
            Authorization: `Bearer ${cookies['@barber.token']}`
        }
    })

    api.interceptors.response.use(res => {
        return res;
    }, () => (error: AxiosError) => {
        if (error.response.data === 401) {
            if (typeof window !== undefined) {
                // deslogar usuario
                signOut();

            } else {
                return Promise.reject(new AuthTokenError)
            }
        }

        return Promise.reject(error);
    })

    return api;
}