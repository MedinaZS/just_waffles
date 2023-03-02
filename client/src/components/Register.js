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
import InputGroup from 'react-bootstrap/InputGroup';

const Register = () => {

    const navigate = useNavigate();

    useEffect(() => {
        // Se realiza dentro de useeffect para que realice esto ANTES de renderizar la pagina y no tire error por navegar mientras renderiza
        // Si hay un token guardado navegar al home, si no lo hay mostrar el register
        if (getTokenFromLocalStorage()) {
            navigate(APP_ROUTES.HOME)
        }
        // Colocar para que trackee cuando cargue el user redireccione al home
    }, [])


    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({})


    const [passwordType, setPasswordType] = useState("password")
    const [confirmType, setConfirmType] = useState("password")



    const onSubmitHandler = (event) => {
        event.preventDefault();

        let newUser = { firstName, lastName, email, address, city, password, confirmPassword };

        axios.post(API_ROUTES.REGISTER, newUser, { withCredentials: true, credentials: 'include' })
            .then(response => {
                // console.log(response);
                // Cuando se registra exitosamente
                // Obtener el token del response
                const token = response.data.token;

                // Guardar el token JWT que se pasa como respuesta en el almacenamiento local
                storeTokenInLocalStorage(token);
                // Navegar al home
                navigate(APP_ROUTES.HOME);
            })
            .catch(err => {
                // console.log(err);
                setErrors(err.response.data.errors);
            });
    }

    return (

        <Container className='mt-5'>
            <Row className="justify-content-md-center">
                <Col md={6} className='border rounded-5 py-3 px-5 shadow '>
                    <h2 className='text-center'>Register</h2>
                    <hr />
                    <Form onSubmit={onSubmitHandler} >

                        <Row className='mb-3'>
                            <Col sm={12} md={6}>
                                <Form.Group>
                                    <Form.Label>First Name:</Form.Label>
                                    <Form.Control type="text" placeholder='Enter first name' onChange={(e) => setFirstName(e.target.value)} />
                                    {errors.firstName && <span className='text-danger'> {errors.firstName.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Last Name:</Form.Label>
                                    <Form.Control type="text" placeholder='Enter last name' onChange={(e) => setLastName(e.target.value)} />
                                    {errors.lastName && <span className='text-danger offset-md-4'> {errors.lastName.message}</span>}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className='mb-3'>
                            <Form.Label>Email:</Form.Label>
                            <Form.Control type="email" placeholder='Enter email' onChange={(e) => setEmail(e.target.value)} />
                            {errors.email && <p className='text-danger'> {errors.email.message}</p>}
                        </Form.Group>

                        <Row>
                            <Col sm={12} md={8}>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Address:</Form.Label>
                                    <Form.Control type="text" placeholder='Enter address' onChange={(e) => setAddress(e.target.value)} />
                                    {errors.address && <p className='text-danger'> {errors.address.message}</p>}
                                </Form.Group>
                            </Col>

                            <Col sm={12} md={4}>
                                <Form.Group className='mb-3'>
                                    <Form.Label>City:</Form.Label>
                                    <Form.Control type="text" placeholder='Enter city' onChange={(e) => setCity(e.target.value)} />
                                    {errors.city && <p className='text-danger'> {errors.city.message}</p>}
                                </Form.Group>
                            </Col>
                        </Row>

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
                            {errors.password && <p className='text-danger'> {errors.password.message}</p>}
                        </Form.Group>

                        <Form.Group className='mb-3'>
                            <Form.Label>Confirm:</Form.Label>
                            <InputGroup>
                                <Form.Control type={confirmType}  placeholder='Enter confirm password' onChange={(e) => setConfirmPassword(e.target.value)} />
                                <InputGroup.Text>
                                    <span className="icon"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => { (confirmType === "text") ? setConfirmType("password") : setConfirmType("text") }}>

                                        <i className={"bi bi-eye" + (confirmType === "text" ? '-slash' : '')}></i>
                                    </span>
                                </InputGroup.Text>
                            </InputGroup>
                            {errors.confirmPassword && <p className='text-danger'> {errors.confirmPassword.message}</p>}
                        </Form.Group>

                        <div className="d-grid">
                            <Button type='submit' variant='success'>Sign up</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container >
    )
}

export default Register