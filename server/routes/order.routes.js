const Controller = require('../controllers/order.controller');
// Para que no se pueda acceder a las rutas si no esta autenticado
const { authenticate } = require('../config/jwt.config')

module.exports = function(app){
    app.get('/api/order/list/:userId' , authenticate, Controller.getAll);
    app.post('/api/order/new' , authenticate, Controller.create);
    app.get('/api/order/:userId' , authenticate, Controller.getOne);
    app.put('/api/order/edit' , authenticate, Controller.update);
    // app.delete('/api/order/delete/:id' , authenticate, Controller.delete);
}