const jwt = require('jsonwebtoken');
const { SECRET } = require('../config/config');

const authMiddleware = {
    verificaUsurio: (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({msg: 'Acesso negado!'});
        }

        try {
            jwt.verify(token, SECRET);
            next();
        } catch (error){
            console.log(error);
            return res.status(400).json({errorCode: 400, message: 'Token inválido!'});
        }
    }
}

module.exports = authMiddleware;