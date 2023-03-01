const { User } = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

const orderController = require('../controllers/order.controller');

//Register
module.exports.registerUser = async (req, res) => {

    // try {
    //     // Crear el nuevo usuario
    //     const newUser = await User.init().then(() => User.create(req.body));

    //     // Generar el token
    //     const userToken = jwt.sign({ _id: newUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    //     // Contiene el token, mientras no se expire o no haga logout puede utilizar la app, httponly para que la cookie no sea desencriptada
    //     // Nombre, token, clave secreta, tiempo de expiracion
    //     res.status(201).cookie('userToken', userToken, JWT_SECRET, { httpOnly: true })

    //         // Enviar token por json para poder guardarlo en el frontend
    //         .json({ user: newUser, token: userToken })

    //     console.log("Usertoken register succesfully", userToken);
    // }
    // catch (error) {
    //     res.status(400).json(error);
    // }

    User.findOne({ email: req.body.email }) //find if email exits
        .then(user => {

            if (!user) {
                // Crear el nuevo usuario
                User.create(req.body)
                    .then(newUser => {
                        const userToken = jwt.sign({ _id: newUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

                        // Contiene el token, mientras no se expire o no haga logout puede utilizar la app, httponly para que la cookie no sea desencriptada
                        // Nombre, token, clave secreta, tiempo de expiracion
                        res.status(201).cookie('userToken', userToken, JWT_SECRET, { httpOnly: true })
                            // Enviar token por json para poder guardarlo en el frontend
                            .json({ user: newUser, token: userToken })

                        console.log("Usertoken register succesfully", userToken);
                    })
                    .catch(error => res.status(400).json(error));
            }else{
                res.status(400).json({errors:{email:{message:"This email already exists"}}})
            }

        })
        .catch(error => res.status(400).json(error));


}

//Login
module.exports.loginUser = async (req, res) => {

    User.findOne({ email: req.body.email }) //find the user with the email
        .then(user => {
            if (user === null) {
                res.status(400).json({ message: "Invalid email or password" });// Si no existe ese usuario enviar un error 
            } else {

                bcrypt.compare(req.body.password, user.password)// Validar que la contraseña ingresada sea igual a la contraseña en la base de datos
                    .then(passwordIsValid => {

                        if (passwordIsValid) {
                            // Generar el token si es que la contraseña coincide
                            const userToken = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
                            // Contiene el token, mientras no se expire o no haga logout puede utilizar la app, httponly para que la cookie no sea desencriptada
                            // Enviar token por json para poder guardarlo en el frontend
                            res.cookie("userToken", userToken, { httpOnly: true }).json({ token: userToken });

                        } else {
                            res.status(400).json({ message: "Invalid email or password" });// Si no es correcta la contraseña emitir un error
                        }
                    })
                    .catch(err => res.status(400).json({ message: "Invalid email or password" }));
            }
        })
        .catch(err => res.status(400).json(err));

}



module.exports.getUserWithToken = (req, res) => {
    const defaultReturnUser = { user: null };

    try {
        const token = String(req?.headers?.authorization?.replace('Bearer ', ''));
        const decoded = jwt.verify(token, JWT_SECRET);

        User.findById({ _id: decoded._id })
            .then(user => {
                if (user === null) {
                    res.status(400).json(defaultReturnUser); //Si no se encontro el usuario devolver el default 
                    return;
                }
                // Eliminar el password del user
                user.password = undefined;
                // Devolver como respuesta el usuario
                res.status(200).json({ user });

            })
            .catch((error) => {
                console.log("Something went wrong (getOne)", error);
                res.status(400).json(defaultReturnUser);
            });

    } catch (error) {
        console.log("Something went wrong (getOne token)", error);
        // 
    }
}

//Update 
module.exports.update = (req, res) => {

    try {
        // Get the token
        const token = String(req?.headers?.authorization?.replace('Bearer ', ''));

        const decoded = jwt.verify(token, JWT_SECRET);

        User.findByIdAndUpdate({ _id: decoded._id }, req.body, { runValidators: true })
            .then(response => {
                res.json(response);
                console.log("User udpated succesfully");
            })
            .catch((error) => {
                console.log("Something went wrong (update)", error);
                res.status(400).json(error)
            });


    } catch (error) {
        console.log("Something went wrong (update token)", error);
    }

}

//Delete
module.exports.delete = (req, res) => {
    try {
        User.findByIdAndDelete(req.params.id)
            .then((response) => {
                res.clearCookie('userToken');
                res.json(response);
                console.log("User delete succesfully");
                // Eliminar ordenes relacionadas al user 
                orderController.deleteManyOrders(req.params.id);
                // Eliminar la cookie 
            })
            .catch((error) => {
                console.log("Something went wrong (delete user)", error);
                res.status(400).json(error)
            });


    } catch (error) {
        console.log("Something went wrong (delete token)", error);
    }

}



//Logout
module.exports.logoutUser = (req, res) => {
    // Eliminar la cookie 
    res.clearCookie('userToken');
    // Emitir un mensaje
    res.json({ message: 'User logout' });

}
