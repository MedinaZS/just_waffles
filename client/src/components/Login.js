import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getTokenFromLocalStorage, storeTokenInLocalStorage } from '../helpers/common';
import { API_ROUTES, APP_ROUTES } from '../helpers/constants';

// Bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Se realiza dentro de useeffect para que realice esto ANTES de renderizar la pagina y no tire error por navegar mientras renderiza
        // Si hay un token guardado navegar al home, si no lo hay mostrar el register
        if (getTokenFromLocalStorage()) {
            navigate(APP_ROUTES.HOME)
        }
    }, [])


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({})


    const onSubmitHandler = (event) => {
        event.preventDefault();

        axios.post(API_ROUTES.LOGIN, { email, password }, { withCredentials: true, credentials: 'include' })
            .then(response => {
                // Obtener el token del response
                const token = response.data.token;

                // Guardar el token JWT que se pasa como respuesta en el almacenamiento local
                storeTokenInLocalStorage(token);

                // Navegar al home
                navigate(APP_ROUTES.HOME);
            })
            .catch(err => {
                console.log(err);
                setErrors(err.response.data);
            });
    }

    return (

        <Container className='mt-5'>
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <h2 className='text-center mb-5'>Welcome Back!</h2>
                    <Form onSubmit={onSubmitHandler} >
                        
                        <Form.Group className='mb-3'>
                            <Form.Label>Email:</Form.Label>
                            <Form.Control type="email" placeholder='Enter email' onChange={(e) => setEmail(e.target.value)} />
                            <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
                        </Form.Group>

                        <Form.Group className='mb-3'>
                            <Form.Label>Password:</Form.Label>
                            <Form.Control type="password" placeholder='Enter password' onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>

                        {errors.message ? <p className='text-danger text-center'> {errors.message}</p> : null}

                        <div className="d-grid">
                            <Button type='submit' variant='success'>Login</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default Login