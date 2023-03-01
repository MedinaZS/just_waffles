import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { API_ROUTES, APP_ROUTES } from '../helpers/constants';
import { useUser } from '../helpers/customHook';
import { numberFormat } from '../helpers/common';

// React Boostrap
import Image from 'react-bootstrap/Image';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

const Order = ({ waffles, setWaffles }) => {

    // Hacer ruta protegida obteniendo el user
    // Ya que dentro del hook esta si no hay user redireccionar al login
    const { user } = useUser();

    const [method, setMethod] = useState("carry out");
    const [totalPrice, setTotalPrice] = useState(0);

    const [confirmOrder, setConfirmOrder] = useState(false);

    const navigate = useNavigate();


    useEffect(() => {
        console.log("Use effect")
        let totalPrice = 0;
        waffles.forEach(waffle => {
            totalPrice += waffle.price;
        });
        setTotalPrice(totalPrice);
    }, [waffles])

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

        const date = new Date().toLocaleDateString('py-PY');

        let newOrder = { method, waffles, id: user._id, totalPrice, date };

        // axios.post('http://localhost:8000/api/order/new', { method, image, treasureChest, phrase, position, pegLeg, eyePatch, hookHand }, {withCredentials:true})
        axios.post(API_ROUTES.SAVE_ORDER, newOrder, { withCredentials: true })
            .then(res => {
                console.log("Create order succesfully", res);
                // Reset
                cleanOrder();
                // Confirmar pedido
                setConfirmOrder(true);
            })
            .catch(err => {
                console.log("Error creating order ", err);
            });
    }

    const cleanOrder = () => {
        // Resetear todo
        // Vaciar lista de waffles
        setWaffles([]);
        // Eliminar lista de waffles de local storage
        localStorage.removeItem("waffleList");
    }

    const startOver = () => {
        cleanOrder();

        // Navegar hacia el home
        navigate(APP_ROUTES.HOME);
    }

    return (
        <Container className='m-4 mx-auto'>
            {/* Si el pedido fue confirmado */}
            {confirmOrder && (
                <div className='text-center'>
                    <Image src='check.png' width={'200'}></Image>
                    <h3 className='mt-5'>Your order has been confirmed</h3>
                    <Link className='btn btn-primary btn-lg mt-5' to={APP_ROUTES.HOME} >Back to Home</Link>
                </div>
            )}

            {/*Si el pedido no fue confirmado  */}
            {!confirmOrder && (
                <>
                    <p className='fs-3 text-center'>YOUR ORDER</p>

                    <Form onSubmit={onSubmitHandler}>

                        <Form.Group className="mb-3">
                            <Form.Label>Method:</Form.Label>
                            <Form.Select value={method} onChange={(e) => setMethod(e.target.value)}>
                                <option value="carry out">Carry Out</option>
                                <option value="delivery">Delivery</option>
                            </Form.Select>
                        </Form.Group>

                        <h4 className='mt-4'>Detail</h4>
                        <hr />

                        <Table striped bordered size='sm' >
                            <thead>
                                <tr>
                                    <th>Qty</th>
                                    <th>Size</th>
                                    <th>Dough Type</th>
                                    <th>Toppigs</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {waffles && waffles.map((waffle, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{waffle.quantity}</td>
                                            <td>{waffle.size}</td>
                                            <td>{waffle.doughType}</td>
                                            <td>{
                                                waffle.toppings && waffle.toppings.map((topping, index) =>
                                                    (<span key={index}>{topping + ". "}</span>))}
                                                {waffle.toppings.length === 0 && 'No toppings'}
                                            </td>
                                            <td>{numberFormat(waffle.price)}</td>
                                        </tr>)
                                })}
                            </tbody>
                        </Table>

                        <h3 className='text-end'>Total {numberFormat(totalPrice)}</h3>

                        <Row className='my-3'>
                            <Col xs={12} md={6} className="mb-3">
                                <div className='d-grid'>
                                    <Button type='button' variant='danger' onClick={startOver}>START OVER</Button>
                                </div>
                            </Col>
                            <Col xs={12} md={6}>
                                <div className='d-grid'>
                                    <Button type='submit' variant='success' >PURCHASE</Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </>
            )}
        </Container>
    )
}

export default Order