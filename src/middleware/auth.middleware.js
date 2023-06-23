const jwt = require('jsonwebtoken');
const { SECRET, CARDAPIO_KEY } = require('../config/config');

const authMiddleware = {
    verificaUsuario: (req, res, next) => {
        // Pegando o token de autorização no header da requisição
        const authHeader = req.headers['authorization'];
        // Verificando se o token existe e formatando ele adequadamente
        const token = authHeader && authHeader.split(' ')[1];

        // Se o token não existir, o acesso é negado
        if (!token) {
            return res.status(401).json({ message: 'Acesso negado!' });
        }

        // Validando o token
        try {
            jwt.verify(token, SECRET);
            next();
        } catch (error){
            console.log(error);
            return res.status(403).json({ message: 'Token inválido!' });
        }
    },
    verificaChaveDeAcesso: (req, res, next) => {
        // Pegando a chave de acesso na Query String
        const { key } = req.query;

        // Verificando se ela existe
        if (!key) {
            return res.status(400).json({ message: 'Você precisa de uma chave para acessar esse recurso.' });
        }

        // Validando a chave de acesso
        try {
            if (!(key === CARDAPIO_KEY)) {
                return res.status(401).json({ message: 'Chave inválida!' });
            }
            next();
        } catch (error) {
            console.log(error);
            return res.status(400).json({message: "Ocorreu um erro inesperado!"});
        }
    }
}

module.exports = authMiddleware;