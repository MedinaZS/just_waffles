import axios from 'axios';
import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { WAFFLE_OPTIONS } from '../helpers/constants';
import { useUser } from '../helpers/customHook';

import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const CraftAWaffle = ({ waffles, setWaffles }) => {

    // Hacer ruta protegida obteniendo el user
    // Ya que dentro del hook esta si no hay user redireccionar al login
    const { user } = useUser();

    // Opciones disponibles
    const [sizesOptions, setSizesOptions] = useState(WAFFLE_OPTIONS.SIZES);
    const [doughTypesOptions, setDoughTypesOptions] = useState(WAFFLE_OPTIONS.DOUGH_TYPE);
    const [toppingsOptions, setToppingsOptions] = useState(WAFFLE_OPTIONS.TOPPINGS);

    const [size, setSize] = useState(sizesOptions[0]);
    const [doughType, setDoughType] = useState(doughTypesOptions[0]);
    const [quantity, setQuantity] = useState(1);

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

        // Obtener todos los toppings que estan en true
        let toppingsList = [];

        // Obtener las llaves del objeto topping (dulce, salado, frutas, etc)
        const keys = Object.keys(toppingsOptions);

        // Obtener todos los toppings que estan en true
        keys.forEach((key) => {
            toppingsOptions[key].filter(item => {
                if (item.checked) {
                    toppingsList = [...toppingsList, item.title];
                }
                return item
            });
        })

        //Calcular el precio segun tamaño y cantidad de toppingsList
        let price = (size === "Small") ? WAFFLE_OPTIONS.PRICE_SMALL : WAFFLE_OPTIONS.PRICE_LARGE;

        // Agregar costo de toppingsList
        price += (toppingsList.length * WAFFLE_OPTIONS.PRICE_PER_TOPPING);

        // Multiplicar por la cantidad de waffles
        price *= quantity;

        // Create a new waffle
        let newWaffle = { quantity, size, doughType, toppings: toppingsList, price }

        // New waffle list, Add to waffles list
        let waffleList = [...waffles, newWaffle];

        // console.log(newWaffle);

        setWaffles(waffleList);

        // Save to local storage, se usa json stringify porque osino guarda como [object Object]
        localStorage.setItem("waffleList", JSON.stringify(waffleList));

        clearInputs();
    }

    const clearInputs = () => {
        setSize("pequeño");
        setDoughType("vainilla");
        setQuantity(1);
        setToppingsOptions(WAFFLE_OPTIONS.TOPPINGS)
        // setToppingsList([]);
    }

    const saveTopping = (topping, type) => {

        // Modificar el que se checkeo segun en donde esta ubicado,dulce, fruta o salado
        // toppings[type] = ej. toppings[dulces]... 
        // Si es el titulo del topping cambiar
        let toppingUpdate = toppingsOptions[type].map(item => (item.title === topping) ? { ...item, checked: !item.checked } : { ...item });

        // Actualizar el objeto toppings que tiene las llaves dulce fruta o salado
        // Se hace una copia de los toppings y se cambia el key (dulce,fruta,salado) segun lo elegido
        let newToppings = { ...toppingsOptions, [type]: toppingUpdate }

        // Setear los toppings nuevamente con lo actualizado
        setToppingsOptions(newToppings);
    }

    return (
        <Container className='m-3 mt-5 mx-auto'>

            <h2 className='text-center mb-4'>CRAFT-A-WAFFLE</h2>

            <Form onSubmit={onSubmitHandler}>

                {/* Size, doughType, qty */}
                <Row className='mb-3'>
                    <Col md={4}>
                        <Form.Group className='mb-3'>
                            <Form.Label>Size:</Form.Label>

                            <Form.Select value={size} onChange={(e) => setSize(e.target.value)}>
                                {sizesOptions.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                ))}
                            </Form.Select>

                        </Form.Group>
                    </Col>

                    <Col md={4}>
                        <Form.Group className='mb-3'>
                            <Form.Label>Dough Type:</Form.Label>

                            <Form.Select value={doughType} onChange={(e) => setDoughType(e.target.value)}>
                                {doughTypesOptions.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                ))}
                            </Form.Select>

                        </Form.Group>
                    </Col>

                    <Col md={4}>
                        <Form.Group className='mb-3'>
                            <Form.Label>Qty:</Form.Label>
                            <Form.Control type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                        </Form.Group>
                    </Col>
                </Row>


                {/* Toppings */}
                <h4 className='text-center'>TOPPINGS</h4>

                <Row className='mb-5'>
                    {/* Dulces */}
                    <Col xs={12} md={4}>
                        <p className='text-center'>Sweet</p>
                        <hr />
                        {toppingsOptions.sweet.map((topping, index) => (
                            <Form.Check
                                type="checkbox"
                                label={topping.title}
                                id={topping.title}
                                value={topping.title}
                                onChange={(e) => saveTopping(e.target.value, "sweet")}
                                checked={topping.checked}
                                key={index}
                            />
                        ))}
                    </Col>

                    {/* Frutas */}
                    <Col xs={12} md={4}>
                        <p className='text-center'>Fruit</p>
                        <hr />
                        {toppingsOptions.fruit.map((topping, index) => (
                            <Form.Check
                                type="checkbox"
                                label={topping.title}
                                id={topping.title}
                                value={topping.title}
                                onChange={(e) => saveTopping(e.target.value, "fruit")}
                                checked={topping.checked}
                                key={index}
                            />
                        ))}
                    </Col>

                    {/* Salados */}
                    <Col xs={12} md={4}>
                        <p className='text-center'>Salty</p>
                        <hr />
                        {toppingsOptions.salty.map((topping, index) => (
                            <Form.Check
                                type="checkbox"
                                label={topping.title}
                                id={topping.title}
                                value={topping.title}
                                onChange={(e) => saveTopping(e.target.value, "salty")}
                                checked={topping.checked}
                                key={index}
                            />
                        ))}
                    </Col>
                </Row>

                <Row className='mb-3'>
                    <Col xs={12} md={6} className="mb-3">
                        <div className='d-grid'>
                            <Button type='submit' variant='success'>ADD TO ORDER</Button>
                        </div>
                    </Col>
                    <Col xs={12} md={6}>
                        <div className='d-grid'>
                            <Link to={"/order"} className={'btn btn-primary ' + (waffles.length === 0 ? " disabled" : "")}>CONTINUE TO CHECKOUT</Link>
                        </div>
                    </Col>
                </Row>
            </Form>

        </Container>
    )
}

export default CraftAWaffle