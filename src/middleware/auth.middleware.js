const jwt = require('jsonwebtoken');

const authMiddleware = {
    verificaUsurio: (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({msg: 'Acesso negado!'});
        }
    }
}

module.exports = authMiddleware;