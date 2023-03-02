
import './App.css';
import { getTokenFromLocalStorage } from './helpers/common';
import { setAuthToken } from './helpers/setAuthToken';
import Main from './views/Main';

function App() {

	// Si no se hace esto no se pasa por header en los axios y genera jwt malformed
	//check jwt token
	const token = getTokenFromLocalStorage();

	if (token) {
		setAuthToken(token);
	}

	return (
		<div className='d-flex flex-column' style={{height:'100vh'}}>
			<Main />
		</div>
	);
}

export default App;
