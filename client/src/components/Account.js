import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { API_ROUTES, APP_ROUTES } from '../helpers/constants';
import { useUser } from '../helpers/customHook';
import { numberFormat, removeTokenFromLocalStorage } from '../helpers/common';


// Boostrap
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import FormCheck from 'react-bootstrap/FormCheck';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';

const Account = () => {
    // Hacer ruta protegida obteniendo el user
    // Ya que dentro del hook esta si no hay user redireccionar al login
    const { user } = useUser();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [errors, setErrors] = useState({});

    // Lista de pedidos
    const [orderList, setOrderList] = useState([]);

    // For modals,alerts,etc
    const [showAlert, setShowAlert] = useState(false)
    const [showModalDelete, setModalDelete] = useState(false)

    const navigate = useNavigate();


    useEffect(() => {
        // Si hay un usuario prepopulate los campos
        if (user) {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setEmail(user.email);
            setAddress(user.address);
            setCity(user.city);

            // Obtener la lista de pedidos hecho por el usuario
            axios.get(API_ROUTES.GET_ORDERS + user._id, { withCredentials: true })
                .then(response => {
                    // console.log(response.data);
                    setOrderList(response.data);
                })
        }
        // Como tarda en cargar el user trackear cuando cambia para efectuar los set
    }, [user]);

    // Si tarda obtener el user mostrar cargando
    if (!user) {
        return (
            <Container className='text-center mt-5 p-5'>
                <Spinner animation="border" role="status" style={{ width: '6rem', height: '6rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();

        let updateUser = { firstName, lastName, email, address, city };

        axios.put(API_ROUTES.UPDATE_USER, updateUser, { withCredentials: true, credentials: 'include' })
            .then(response => {
                console.log(response);
                // Limpiar los errores
                setErrors({});
                ShowAlert();
            })
            .catch(err => {
                // console.log(err);
                // Setear los errores con lo que envia el server
                setErrors(err.response.data.errors);
            });
    }

    const deleteAccount = () => {
        console.log("Delete", user);
        console.log(API_ROUTES.DELETE_USER + user._id);


        axios.delete(API_ROUTES.DELETE_USER + user._id, { withCredentials: true, credentials: 'include' })
            .then(response => {
                console.log(response);
                // Eliminar token de almacenamiento
                removeTokenFromLocalStorage();
                // Redigirir al login 
                navigate(APP_ROUTES.LOGIN);
            })
            .catch(err => {
                console.log(err);
            });
    }

    // For update alert
    const ShowAlert = () => {
        setShowAlert(true);
        setTimeout(() => { setShowAlert(false) }, 2000);
    }

    const setFavorite = (orderId) => {
        // console.log(orderId);

        // Para editar pasar el user id para hacer la busqueda de las ordenes por user y el id de la orden en especifico a cambiar por true
        axios.put("http://localhost:8000/api/order/edit", { user: user._id, order: orderId }, { withCredentials: true })
            .then(response => {
                // console.log(response);

                // Actualizar la vista
                updateFavoriteDOM(orderId);
            })
            .catch(err => {
                console.log(err);
            });


    }

    const updateFavoriteDOM = (orderId) => {

        // PARA MODIFICAR EN LA VISTA Y NO TENER QUE TRAER DE LA BD DE NUEVO

        // Hacer una copia de los pedidos
        // Poner todos los favorite en false
        // Colocar en true el que corresponde con el id
        let newOrderList = [...orderList];

        newOrderList = newOrderList.map((order) => {
            if (order._id === orderId) {
                return { ...order, favorite: true }
            }
            return { ...order, favorite: false }
        })

        setOrderList(newOrderList);
    }


    return (
        <Row className='m-3'>
            <Col md={6} className='pe-5 mb-4'>

                <Row className='mb-3'>
                    <Col xs={12} md={12} lg={8}>
                        <h3>Account Info</h3>
                    </Col>
                    <Col xs={12} md={12} lg={4}>
                        <div className='d-grid'>
                            <Button variant="danger" onClick={() => setModalDelete(true)}>
                                Delete my account
                            </Button>
                        </div>
                    </Col>
                </Row>

                <Alert show={showAlert} variant="success">
                    Updated succesfully
                </Alert>

                <Form onSubmit={onSubmitHandler}>
                    <Row className='mb-3'>
                        <Col xs={12} md={3} lg={2}>
                            <Form.Label>First Name:</Form.Label>
                        </Col>
                        <Col xs={12} md={9} lg={10}>
                            <Form.Control type="text" onChange={(e) => setFirstName(e.target.value)} value={firstName} />
                        </Col>
                        <Col xs={12} md={{ span: 9, offset: 3 }} lg={{ span: 10, offset: 2 }} >
                            {errors.firstName && <span className='text-danger'> {errors.firstName.message}</span>}
                        </Col>
                    </Row>

                    <Row className='mb-3'>
                        <Col xs={12} md={3} lg={2}>
                            <Form.Label>Last Name:</Form.Label>
                        </Col>
                        <Col xs={12} md={9} lg={10}>
                            <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </Col>
                        <Col xs={12} md={{ span: 9, offset: 3 }} lg={{ span: 10, offset: 2 }} >
                            {errors.lastName && <span className='text-danger'> {errors.lastName.message}</span>}
                        </Col>
                    </Row>

                    <Row className='mb-3'>
                        <Col xs={12} md={3} lg={2}>
                            <Form.Label>Email:</Form.Label>
                        </Col>
                        <Col xs={12} md={9} lg={10}>
                            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Col>
                        <Col xs={12} md={{ span: 9, offset: 3 }} lg={{ span: 10, offset: 2 }} >
                            {errors.email && <span className='text-danger'> {errors.email.message}</span>}
                        </Col>
                    </Row>

                    <Row className='mb-3'>
                        <Col xs={12} md={3} lg={2}>
                            <Form.Label >Address:</Form.Label>
                        </Col>
                        <Col xs={12} md={9} lg={10}>
                            <Form.Control type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                        </Col>
                        <Col xs={12} md={{ span: 9, offset: 3 }} lg={{ span: 10, offset: 2 }} >
                            {errors.address && <span className='text-danger'> {errors.address.message}</span>}
                        </Col>
                    </Row>

                    <Row className='mb-3'>
                        <Col xs={12} md={3} lg={2}>
                            <Form.Label>City:</Form.Label>
                        </Col>
                        <Col xs={12} md={9} lg={10}>
                            <Form.Control type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                        </Col>
                        <Col xs={12} md={{ span: 9, offset: 3 }} lg={{ span: 10, offset: 2 }} >
                            {errors.city && <span className='text-danger'> {errors.city.message}</span>}
                        </Col>
                    </Row>

                    <div className='d-grid'>
                        <Button type='submit' variant='success' >UPDATE</Button>
                    </div>
                </Form>
            </Col>
            <Col md={6} className='pe-5 mb-4'>

                <h3 className='mb-3'>Past Orders</h3>
                {/* Cuando no se hizo ningun pedido */}
                {orderList.length === 0 &&
                    <p>Not orders yet...</p>
                }

                <Container className='mt-4'>
                    {/* Lista de pedidos */}
                    {orderList &&
                        orderList.map((order, index) => (
                            <Row key={index}>
                                <Col sm={8} className="ps-0">
                                    <p>{order.date}</p>

                                    {/* Mapear los waffles */}
                                    {order.waffles.map((waffle, i) => (
                                        <p key={i}>
                                            {waffle.quantity} - {waffle.size} - {waffle.doughType} - {waffle.toppings.map((topping, x) => <span key={x}>{topping}. </span>)} - {numberFormat(waffle.price)}
                                        </p>
                                    ))}
                                </Col>
                                <Col sm={4}>
                                    {/* Pasar el id de la orden a modificar */}
                                    <FormCheck type={'checkbox'} id={`default-${index}`} label={'Favorite'} checked={order.favorite} onChange={() => setFavorite(order._id)} />
                                </Col>
                                <hr />
                            </Row>
                        ))}
                </Container>
            </Col>


            {/* Modal to delete account */}
            <Modal show={showModalDelete} onHide={() => setModalDelete(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete account</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete your account? </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalDelete(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => { deleteAccount(); setModalDelete(false); }}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Row>
    )
}

export default Account