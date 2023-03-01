const jwt = require("jsonwebtoken");
// Obtener la llave secreta del archivo .env
const { JWT_SECRET } = process.env;

module.exports.authenticate = (req, res, next) => {
    
    jwt.verify(req.cookies.userToken, JWT_SECRET, (err, payload) => {
        if (err) {
            console.log("auth error:", err);
            res.status(401).json({ verified: false });
        } else {
            console.log('Authenticated');
            next();
        }
    });
}

