const { Order } = require('../models/order.model');

const { User } = require('../models/user.model');

// To format createdat mongo timestamp
const dayjs = require('dayjs')

//Create
module.exports.create = (req, res) => {

    // Validaciones
    const { method, waffles, id, totalPrice, date } = req.body;

    // Verificar si se enviaron todos los datos
    if (!method || !waffles || !id || !totalPrice) {
        res.statusMessage = "El metodo, la lista de waffles, el usuario y el precio total son obligatorios";
        return res.status(400).end();
    } else {
        // Buscar si existe el usuario enviado
        User.findById(id)
            .then(usuarioEncontrado => {
                // Si no hay usuario
                if (!usuarioEncontrado) {
                    res.statusMessage = "El usuario indicado no existe";
                    return res.status(404).end();
                } else {
                    // Crear nueva orden
                    const newOrder = {
                        method,
                        user: id,
                        waffles,
                        totalPrice
                    }

                    Order.create(newOrder)
                        .then((ordenCreada) => {
                            console.log("Created succesfully"); res.json(ordenCreada);
                        })
                        .catch((error) => {
                            console.log("Something went wrong (create order)", error);
                            res.status(400).json(error)
                        });


                }
            })
            .catch(error => console.log("Something went wrong finding user", error));
    }
}

//Get All
module.exports.getAll = (req, res) => {
    // Obtener las ordenes que sean del usuario
    const { userId } = req.params;

    // Sort / ordenar por fecha descendente
    Order.find({ user: userId }).sort({createdAt: -1})
        .then(response => {
            // Modificar el campo que por default esta vacio y guardar la fecha formateada de timestamps con dayjs
            response.map((order) => order.date = dayjs(order.createdAt).format('DD/MM/YYYY'))

            res.json(response);
            // console.log(response);
        })
        .catch((error) => console.log("Something went wrong (getAll orders)", error));
}

//Get one (favorite)
module.exports.getOne = (req, res) => {
    // Get the user 
    const { userId } = req.params;

    // Argumentos
    let conditions = { user: userId, favorite: true };

    Order.findOne(conditions)
        .then(response => res.json(response))
        .catch((error) => console.log("Something went wrong (getOne)", error));
}


//Update 
module.exports.update = (req, res) => {

    console.log("Update order");

    // Obtener el user para buscar las ordenes a cambiar, y el id de la orden que queda en favorito
    const { user, order } = req.body;

    console.log(req.body);

    // Crear argumentos
    let conditions = { user, favorite: true };
    let update = { $set: { favorite: false } };
    // New: true para que traiga como respuesta el actualizado
    let options = { multi: true, new: true };

    // Colocar en falso el que actualmente esta en true, y colocar en true el seleccionado
    Order.findOneAndUpdate(conditions, update, options)
        .then((response) => {
            console.log(response);

            // Argumentos
            conditions = { _id: order };
            update = { $set: { favorite: true } };
            // New: true para que traiga como respuesta el actualizado
            options = { new: true };

            Order.findByIdAndUpdate(conditions, update, options)
                .then(response => {
                    console.log("Poniendo en true: ", response)
                    res.json(response);// Si no existe ese usuario enviar un error 
                })
                .catch(error => {
                    console.log("Something went wrong upating order in true");
                    res.status(400).json(error)
                })
                
        })
        .catch(error => {
            console.log("Something went wrong upating order false");
            res.status(400).json(error)
        })
}
