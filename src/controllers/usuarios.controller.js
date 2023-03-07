const pool = require('../database/index');
const bcrypt = require('bcrypt');

const usuariosController = {
    cadastraUsuario: async (req, res) => {
        let { userName, senha, confirmaSenha } = req.body;

        // Validação
        if (!userName || !senha || !confirmaSenha) {
            return res.status(400).json({errorCode: 400, message: 'Faltam dados.'});
        }
        if (senha !== confirmaSenha) {
            return res.status(400).json({errorCode: 400, message: 'As senhas não são iguais.'});
        }
        if (typeof userName !== 'string' || typeof senha !== 'string' || typeof confirmaSenha !== 'string') {
            return res.status(400).json({errorCode: 400, message: "Todos os dados devem ser do tipo String."});
        }
        if (senha.length < 8) {
            return res.status(400).json({errorCode: 400, message: 'A senha deve ter no mínimo 8 caracteres.'});
        }
        if (senha.length > 20) {
            return res.status(400).json({errorCode: 400, message: 'A senha deve ter no máximo 20 caracteres.'});
        }
        if (userName.length > 50) {
            return res.status(400).json({errorCode: 400, message: 'O nome de usuário deve ter no máximo 50 caracteres.'});
        }
        if (userName.length < 3) {
            return res.status(400).json({errorCode: 400, message: 'O nome de usuário deve ter no mínimo 3 caracteres.'});
        }

        // Conferindo se já existe o mesmo usuário
        try {
            const queryConfereUsuario = 'SELECT * FROM usuarios WHERE userName= ?';
            const [responseVerifica] = await pool.query(queryConfereUsuario, [userName]);
            if (responseVerifica.length !== 0) {
                return res.status(400).json({errorCode: 400, message: 'Esse usuário já existe.'});
            }

            userName = userName.trim();
            senha = senha.trim();

            // Cadastrando novo usuário
            // criando a senha
            const salt = await bcrypt.genSalt(12);
            const senhaHash = await bcrypt.hash(senha, salt);

            const queryCadastraUsuario = 'INSERT INTO usuarios (userName, senha) VALUES (?,?)';
            const [response] = await pool.query(queryCadastraUsuario, [userName, senhaHash]);

            res.status(201).json({message: 'Usuário cadastrado com sucesso!'});

        } catch (error) {
            res.status(500).json({errorCode:500, message: 'Erro no servidor.'});
            console.log(error);
        }
    },
    login: async (req, res) => {

    }
}

module.exports = usuariosController;