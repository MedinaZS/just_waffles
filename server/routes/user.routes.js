const Controller = require('../controllers/user.controller');

const { authenticate } = require('../config/jwt.config')

module.exports = (app) => {
    app.post('/api/user/register', Controller.registerUser);
    app.post('/api/user/login', Controller.loginUser);
    app.get('/api/user/auth',authenticate, Controller.getUserWithToken);
    app.get('/api/user/logout',authenticate, Controller.logoutUser);
    app.put('/api/user/edit', authenticate, Controller.update);
    app.delete('/api/user/delete',authenticate, Controller.delete);
}