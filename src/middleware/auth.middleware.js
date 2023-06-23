const jwt = require('jsonwebtoken');
const { SECRET, CARDAPIO_KEY } = require('../config/config');
const pool = require('../database/index');

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
            jwt.verify(token, SECRET, async (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: 'Token inválido!' });
                }

                const queryVerificaAtivado = "SELECT ativado FROM usuarios WHERE email=?";
                const [respAtivado] = await pool.query(queryVerificaAtivado, [decoded.email]);
                if (!respAtivado[0].ativado) {
                    return res.status(400).json({ message: "Sua conta foi desativada!" });
                }

                const queryVerificaExiste = "SELECT * FROM usuarios WHERE email=?";
                const [respExiste] = await pool.query(queryVerificaExiste, [decoded.email]);
                if (respExiste.length === 0) {
                    return res.status(400).json({ message: "Sua conta foi excluida!" });
                }
                
                next();
            });
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