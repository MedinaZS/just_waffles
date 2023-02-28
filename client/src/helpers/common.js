import { API_ROUTES } from './constants';
import axios from 'axios';
import { setAuthToken } from './setAuthToken';


export function storeTokenInLocalStorage(token) {
    localStorage.setItem('token', token);
    // Colocar en el header de axios
    setAuthToken(token);
}

export function removeTokenFromLocalStorage() {
    localStorage.removeItem('token');
    // Remover del header de axios
    setAuthToken();
}

export function getTokenFromLocalStorage() {
    return localStorage.getItem('token');

}

// Obtener el usuario autenticado mediante el token guardado en local storage
export async function getAuthenticatedUser() {

    const defaultReturnUser = {user: null };
    try {
        // Obtener token de almacenamiento
        const token = getTokenFromLocalStorage();

        // Si no hay token 
        if (!token) {
            return defaultReturnUser;
        }

        // Si hay token hacer peticion a api para obtener user
        const response = await axios.get(API_ROUTES.GET_USER);

        return response.data;
    }
    catch (err) {
        console.log('getAuthenticatedUser, Something Went Wrong', err);
        return defaultReturnUser;
    }
}

export const numberFormat = (value) => {
    return new Intl.NumberFormat().format(value);
}
