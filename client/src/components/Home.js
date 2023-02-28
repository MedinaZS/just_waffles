import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../helpers/customHook';
import { API_ROUTES, APP_ROUTES, WAFFLE_OPTIONS } from '../helpers/constants';
import axios from 'axios';

// Bootstrap
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';

const Home = ({ waffles, setWaffles }) => {

    // Hacer ruta protegida obteniendo el user
    // Ya que dentro del hook esta si no hay user redireccionar al login
    const { user } = useUser();

    //For modals,alerts,etc
    const [showModalFavorite, setShowModalFavorite] = useState(false)
    const [showModalCheckout, setShowModalCheckout] = useState(false)

    const navigate = useNavigate();

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

    const obtainFavoriteOrder = () => {

        // Obtener la lista de pedidos hecho por el usuario
        axios.get(API_ROUTES.GET_ONE_ORDER + user._id, { withCredentials: true })
            .then(response => {
                let favoriteOrder = response.data;

                // Si no hay ninguno favorito emitir un alert (Modal)
                if (!favoriteOrder) {
                    setShowModalFavorite(true);
                } else {
                    // Guardar en local storage el pedido(Para que se mantenga igual al actualizar la pagina) y llevar al checkout (pagina order)

                    // Obtener la lista de waffles
                    // Mantener campos necesarios (esto elimina el id, createdAt, etc)
                    let waffleList = favoriteOrder.waffles.map(waffle => {
                        return {
                            quantity: waffle.quantity,
                            size: waffle.size,
                            doughType: waffle.doughType,
                            toppings: waffle.toppings,
                            price: waffle.price
                        }
                    });

                    // Set the waffles list, para que la pagina de order pueda consumir
                    setWaffles(waffleList);

                    // Save to local storage, se usa json stringify porque osino guarda como [object Object]
                    localStorage.setItem("waffleList", JSON.stringify(waffleList));

                    // Navegar a checkout / order
                    navigate(APP_ROUTES.ORDER)

                }

            })
            .catch(error => console.log("Something went wrong favorite order", error));
    }

    const buildRandomWaffle = () => {
        console.log("Build random");

        // Get options
        let sizesOptions = WAFFLE_OPTIONS.SIZES;
        let doughTypeOptions = WAFFLE_OPTIONS.DOUGH_TYPE;
        let toppingsOptions = WAFFLE_OPTIONS.TOPPINGS;


        // Obtener random de las opciones
        let size = sizesOptions[Math.floor(Math.random() * sizesOptions.length)];
        let doughType = doughTypeOptions[Math.floor(Math.random() * doughTypeOptions.length)];
        let toppingsList = [];

        // Get the keys of the topping object
        let keys = Object.keys(toppingsOptions);

        // Obtener varios toppings
        for (let i = 0; i < keys.length; i++) {
            // Get random number of topping qty
            let randomNumber = Math.floor(Math.random() * toppingsOptions[keys[i]].length);

            // console.log(randomNumber);

            // Obtener toppings aleatorios de cada tipo
            for (let x = 0; x < randomNumber; x++) {

                let alreadyTopping = true;

                // Seguir realizando hasta que encuentre los toppings y no se repita
                while (alreadyTopping) {

                    let randomTopping = toppingsOptions[keys[i]][Math.floor(Math.random() * toppingsOptions[keys[i]].length)];
                    randomTopping = randomTopping.title;

                    // Verificar si el topping existe
                    const found = toppingsList.find(element => element === randomTopping);

                    if (found) {
                        alreadyTopping = true
                    } else {
                        alreadyTopping = false
                        // Si no hay se agrega a la lista
                        toppingsList = [...toppingsList, randomTopping];
                    };
                }
            }
        }

        // console.log(toppingsList);

        //Calcular el precio segun tamaño y cantidad de toppingsList
        let price = (size === "Pequeño") ? WAFFLE_OPTIONS.PRICE_SMALL : WAFFLE_OPTIONS.PRICE_LARGE;

        // Agregar costo de toppingsList
        price += (toppingsList.length * WAFFLE_OPTIONS.PRICE_PER_TOPPING);

        // Guardar el waffle en local storage e ir al checkout
        // Create a new waffle
        let newWaffle = { quantity: 1, size, doughType, toppings: toppingsList, price }

        // New waffle list, Add to waffles list
        let waffleList = [...waffles, newWaffle];

        // console.log(waffleList);

        setWaffles(waffleList);

        // Save to local storage, se usa json stringify porque osino guarda como [object Object]
        localStorage.setItem("waffleList", JSON.stringify(waffleList));

        // Abrir modal de pregunta de continuar o no al checkout
        setShowModalCheckout(true);

    }

    return (
        // <div className='text-center mx-5'>
        <Container className='text-center'>

            <p className='fs-3 my-3'>QUICK OPTIONS</p>

            <Row xs={1} md={3} >

                <Col className='mb-3'>
                    <Card border='success'>
                        <Card.Header as={'h5'} >NEW ORDER</Card.Header>
                        <Card.Body>
                            <Card.Img style={{ maxWidth: '50%' }} variant='top' src="./new.png" alt="new" />
                            <Card.Subtitle className='my-3 text-muted'>Build a waffle from scratch</Card.Subtitle>
                            <Link to={"/craft-a-waffle"} className='btn btn-success d-block'>NEW ORDER</Link>
                        </Card.Body>
                    </Card>
                </Col>

                <Col className='mb-3'>
                    <Card border='warning'>
                        <Card.Header as={'h5'}>RE-ORDER MY FAVE</Card.Header>
                        <Card.Body>
                            <Card.Img style={{ maxWidth: '50%' }} variant='top' src="./favorite.png" alt="new" />
                            <Card.Subtitle className='my-3 text-muted'>Re-order pre selected fav order</Card.Subtitle>
                            <div className="d-grid">
                                <Button variant="warning" onClick={obtainFavoriteOrder}>RE-ORDER MY FAVE</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col className='mb-3'>
                    <Card border='primary'>
                        <Card.Header as={'h5'}>SURPRISE ME</Card.Header>
                        <Card.Body>
                            <Card.Img style={{ maxWidth: '50%' }} variant='top' src="./surprise.png" alt="surprise" />
                            <Card.Subtitle className='my-3 text-muted'>Build a random waffle</Card.Subtitle>
                            <div className="d-grid">
                                <Button variant="primary" onClick={buildRandomWaffle}>SURPRISE ME</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>


            {/* Modal favorite order*/}
            <Modal show={showModalFavorite} onHide={() => setShowModalFavorite(false)} centered >
                <Modal.Header closeButton>
                    <Modal.Title>Re order my favorite <i className="bi bi-exclamation-triangle-fill"></i></Modal.Title>
                </Modal.Header>
                <Modal.Body>You don't have any favorite order. Please select one in your account tab.</Modal.Body>
                <Modal.Footer>
                    {/* Al cerrar navegar a la pestaña account */}
                    <Button variant="secondary" onClick={() => { navigate(APP_ROUTES.ACCOUNT) }}>Ok</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal want to checkout */}
            <Modal show={showModalCheckout} onHide={() => setShowModalCheckout(false)} centered >
                <Modal.Header closeButton>
                    <Modal.Title>Random waffle</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p> Random waffle added succesfully.</p>
                    <p>You want to go to checkout?</p>
                </Modal.Body>
                <Modal.Footer>
                    {/* Al cerrar navegar a la pestaña account */}
                    <Button variant="secondary" onClick={() => { setShowModalCheckout(false) }}>No</Button>
                    <Button variant="primary" onClick={() => { navigate(APP_ROUTES.ORDER) }}>Yes</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default Home