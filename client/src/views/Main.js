import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CraftAWaffle from '../components/CraftAWaffle'
import Home from '../components/Home'
import Login from '../components/Login'
import NavigationBar from '../components/NavigationBar'
import Order from '../components/Order'
import Register from '../components/Register'
import { APP_ROUTES } from '../helpers/constants'
import Account from '../components/Account'
import Footer from '../components/Footer'

const Main = () => {
	const [waffles, setWaffles] = useState([]);

	useEffect(() => {
		// Se utiliza json.parse para convertirlo en objeto de nuevo para utilizarlo con js
		let waffleList = JSON.parse(localStorage.getItem("waffleList"));

		if (waffleList) {
			// console.log((waffleList));
			setWaffles(waffleList)
		};

	}, []);

	return (

		<BrowserRouter>
			<NavigationBar waffles={waffles} />
			<main className='flex-shrink-0'>
				<Routes>
					{/* Using protected route */}
					<Route path={APP_ROUTES.LOGIN} element={<Login />} />
					<Route path={APP_ROUTES.REGISTER} element={<Register />} />
					<Route path={APP_ROUTES.ACCOUNT} element={<Account />} />
					<Route path={APP_ROUTES.CRAFT_A_WAFFLE} element={<CraftAWaffle waffles={waffles} setWaffles={setWaffles} />} />
					<Route path={APP_ROUTES.ORDER} element={<Order waffles={waffles} setWaffles={setWaffles} />} />
					<Route path={APP_ROUTES.HOME} element={<Home waffles={waffles} setWaffles={setWaffles} />} />

					<Route path="*" element={<p className='text-center fs-4'>Path not resolved</p>} />
				</Routes>
			</main>
			{/* <Footer /> */}
		</BrowserRouter>

	)
}

export default Main