import { useState, useEffect } from 'react';
import { getAuthenticatedUser } from './common';
import { APP_ROUTES } from './constants';
import { useNavigate } from 'react-router-dom';

export function useUser() {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {

        // Funcion que obtiene el usuario con el token 
        getAuthenticatedUser()
            .then(({ user }) => {
                // console.log("custom", user)
                if (user == null) {
                    // Si no esta autenticado redireccionar al login
                    navigate(APP_ROUTES.LOGIN);
                    return;
                } else {
                    setUser(user);
                }
            });
    }, []);

    // console.log(user, "before return")
    return { user };
}