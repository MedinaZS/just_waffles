import axios from 'axios';

export const setAuthToken = token => {
    // Para que se agregue como header y se utilice en cada peticion
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    else
        delete axios.defaults.headers.common["Authorization"];
}