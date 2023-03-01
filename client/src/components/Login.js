import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getTokenFromLocalStorage, storeTokenInLocalStorage } from '../helpers/common';
import { API_ROUTES, APP_ROUTES } from '../helpers/constants';
import { setAuthToken } from '../helpers/setAuthToken';

// Bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';

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

    const [passwordType, setPasswordType] = useState("password")

    const onSubmitHandler = (event) => {
        event.preventDefault();

        axios.post(API_ROUTES.LOGIN, { email, password }, { withCredentials: true, credentials: 'include' })
            .then(response => {
                // Obtener el token del response
                const token = response.data.token;

                // Guardar el token JWT que se pasa como respuesta en el almacenamiento local
                storeTokenInLocalStorage(token);

                setAuthToken(token);

                // while (true) {
                //     if (!getTokenFromLocalStorage()) {
                //         console.log("No hay")
                //         return true;
                //     }else{
                // console.log("Si hay")
                navigate(APP_ROUTES.HOME);
                //         return false;
                //     }
                // }

            })
            .catch(err => {
                console.log(err);
                setErrors(err.response.data);
            });
    }

    return (

        <Container className='mt-5'>
            <Row className="justify-content-md-center">
                <Col md={6} className='border rounded-5 p-5 shadow '>
                    <h2 className='text-center'>Welcome Back!</h2>
                    <hr />
                    <Form onSubmit={onSubmitHandler} >

                        <Form.Group className='mb-3'>
                            <Form.Label>Email:</Form.Label>
                            <Form.Control type="email" placeholder='Enter email' onChange={(e) => setEmail(e.target.value)} />
                            <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
                        </Form.Group>

                        <Form.Group className='mb-3'>
                            <Form.Label>Password:</Form.Label>
                            <InputGroup>
                                <Form.Control type={passwordType} placeholder='Enter password' onChange={(e) => setPassword(e.target.value)} />
                                <InputGroup.Text>
                                    <span className="icon"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => { (passwordType === "text") ? setPasswordType("password") : setPasswordType("text") }}>

                                        <i className={"bi bi-eye" + (passwordType === "text" ? '-slash' : '')}></i>
                                    </span>
                                </InputGroup.Text>
                            </InputGroup>
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