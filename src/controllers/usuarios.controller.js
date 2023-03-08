const pool = require('../database/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../config/config');

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
        if (senha.length < 8 || senha.length > 20 || userName.length > 50 || userName.length < 3) {
            return res.status(400).json({errorCode: 400, message: 'Quantidade de caracteres errada. (userName): min. 3, max. 50; (senha): min. 8, max. 20.'});
        }

        // Conferindo se já existe o mesmo usuário
        try {
            const queryConfereUsuario = 'SELECT * FROM usuarios WHERE userName= ?';
            const [responseVerifica] = await pool.query(queryConfereUsuario, [userName]);
            if (responseVerifica.length !== 0) {
                return res.status(400).json({errorCode: 400, message: 'Esse usuário já existe.'});
            }

            // Cadastrando novo usuário
            // criando a senha
            userName = userName.trim();
            senha = senha.trim();

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
        const { userName, senha } = req.body;

        // Validação
        if (!userName || !senha) {
            return res.status(400).json({errorCode: 400, message: 'Faltam dados.'});
        }
        if (typeof userName !== 'string' || typeof senha !== 'string') {
            return res.status(400).json({errorCode: 400, message: 'Os dados devem ser do tipo string.'});
        }

        try {
            // Verificação da existência do usuário
            const queryVerificaUsuario = 'SELECT * FROM usuarios WHERE userName=?';
            const [response] = await pool.query(queryVerificaUsuario, [userName]);

            if (response.length === 0) {
                return res.status(404).json({errorCode: 404, message: 'Usuário não encontrado.'});
            }
            
            // Verificação da senha do usuário: compara a senha que o usuário digitou no front com a senha do banco de dados

            const verificaSenha = await bcrypt.compare(senha, response[0].senha);
            if (!verificaSenha) {
                return res.status(400).json({errorCode: 400, message: 'Senha incorreta.'});
            }

            // Gerando token de autorização na autenticação
            const token = jwt.sign({
                id: response[0].id,
                userName: response[0].userName
            }, SECRET, {
                expiresIn: '1d'
            });
            return res.status(200).json({message: 'Autenticação realizada com sucesso!', token});

        } catch (err) {
            console.log(err);
            res.status(500).json({errorCode: 500, message: 'Erro no servidor'});
        }
    }
}

module.exports = usuariosController;