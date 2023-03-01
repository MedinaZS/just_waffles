import axios from 'axios';
import React from 'react'
import { Link, NavLink, useHref, useLocation, useNavigate } from 'react-router-dom'
import { getTokenFromLocalStorage, removeTokenFromLocalStorage } from '../helpers/common';
import { API_ROUTES, APP_ROUTES } from '../helpers/constants';
import { useUser } from '../helpers/customHook';

// Bootstrap
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';


const NavigationBar = ({ waffles }) => {
    const navigate = useNavigate();

    // Obtener la ruta actual para mostrar link de login o register
    const location = useLocation().pathname;

    const logout = () => {
        axios.get(API_ROUTES.LOGOUT, { withCredentials: true, credentials: 'include' })
            .then(() => {
                // Eliminar token de almacenamiento local
                removeTokenFromLocalStorage();
                // Navegar al login
                navigate(APP_ROUTES.LOGIN);
            })
    }

    return (
        <Navbar expand='md' className='bg-light-brown'>
            <Container fluid>

                <Navbar.Brand href='/'>
                    <div className='d-flex align-items-center' >
                        <h1>JustWaffles</h1>
                        <img src="./waffle.png" alt="waffle" width={40} height={40} className={"ms-3"} />
                    </div>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse className="justify-content-end">

                    {(getTokenFromLocalStorage()) //Si esta logeado
                        ? (
                            <Nav variant="pils" >
                                <Nav.Item>
                                    <NavLink to={'/'} className="nav-link">Home</NavLink>
                                </Nav.Item>
                                <Nav.Item>
                                    <NavLink to={'/craft-a-waffle'} className="nav-link">Craft a waffle</NavLink>
                                </Nav.Item>
                                <Nav.Item>
                                    <NavLink to={'/order'} className={"nav-link " + (waffles.length === 0 ? "disabled" : "")} >Order({waffles.length})</NavLink>
                                </Nav.Item>
                                <Nav.Item>
                                    <NavLink to={'/account'} className="nav-link">Account</NavLink>
                                </Nav.Item>
                                <Nav.Item>
                                    <Button className="nav-link btn-pink" onClick={logout}>Logout</Button>
                                </Nav.Item>
                            </Nav>
                        )
                        : (
                            <Nav>
                                <Nav.Item >
                                    {(location === APP_ROUTES.REGISTER) && <NavLink to={APP_ROUTES.LOGIN} className="btn btn-primary btn-pink">Already Have an Account? Login</NavLink>}

                                    {(location === APP_ROUTES.LOGIN) && <NavLink to={'/register'} className="btn btn-primary btn-pink">Don't have an Account? Register</NavLink>}
                                </Nav.Item>
                            </Nav>
                        )}

                </Navbar.Collapse>
            </Container >
        </Navbar >
    )
}

export default NavigationBar