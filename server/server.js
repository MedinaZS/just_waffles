const express = require('express');
const cors = require('cors'); //Cors
const app = express();
const cookieParser = require('cookie-parser');

//tengo un archivo .env
require('dotenv').config();

// This will fire our mongoose.connect statement to initialize our database connection
require('../server/config/mongoose.config');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Damos a saber que se usa credenciales
// app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(cors(
    {
        origin: 'http://localhost:3000',
        credentials: true,
    }
))

//Routes
require('../server/routes/order.routes')(app);
require('../server/routes/user.routes')(app);

app.listen(8000, () => {
    console.log("Listening at Port 8000")
})
