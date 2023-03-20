const pool = require('../database/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../config/config');

// Criando objeto "usuariosController"
const usuariosController = {
    cadastraUsuario: async (req, res) => {
        // Recebendo as variáveis "userName", "senha", "confirmaSenha" do body.
        let { userName, senha, confirmaSenha } = req.body;

        // Verificando se todos os campos estão preenchidos
        if (!userName || !senha || !confirmaSenha) {
            return res.status(400).json({errorCode: 400, message: 'Faltam dados.'});
        }
        // Verificando a igualdade nos campos "senha" e "confirmaSenha".
        if (senha !== confirmaSenha) {
            return res.status(400).json({errorCode: 400, message: 'As senhas não são iguais.'});
        }
        // Verificando se todos os dados inseridos são do tipo string.
        if (typeof userName !== 'string' || typeof senha !== 'string' || typeof confirmaSenha !== 'string') {
            return res.status(400).json({errorCode: 400, message: "Todos os dados devem ser do tipo String."});
        }
        // Verificando se quantidade de caracteres inseridos está entre o mínimo e o máximo pedido.
        if (senha.length < 8 || senha.length > 20 || userName.length > 50 || userName.length < 3) {
            return res.status(400).json({errorCode: 400, message: 'Quantidade de caracteres errada. (userName): min. 3, max. 50; (senha): min. 8, max. 20.'});
        }

        try {
            // Verificando se já existe algum usuário com o nome inserido.
            const queryConfereUsuario = 'SELECT * FROM usuarios WHERE userName= ?';
            const [responseVerifica] = await pool.query(queryConfereUsuario, [userName]);
            if (responseVerifica.length !== 0) {
                return res.status(400).json({errorCode: 400, message: 'Esse usuário já existe.'});
            }

            // Cadastrando novo usuário
            userName = userName.trim();
            // Cadastrando nova senha.
            senha = senha.trim();

            // Gerando o "Salt" do "Hash" da senha.
            const salt = await bcrypt.genSalt(12);
            // Gerando o "Hash" da senha, "Salt" e senha são parametros para a função.
            const senhaHash = await bcrypt.hash(senha, salt);

            // Inserindo um novo cadastro na tabela usuários.
            const queryCadastraUsuario = 'INSERT INTO usuarios (userName, senha) VALUES (?,?)';
            const [response] = await pool.query(queryCadastraUsuario, [userName, senhaHash]);

            // Resposta ao cliente que seu usuário foi cadastrado.
            res.status(201).json({message: 'Usuário cadastrado com sucesso!'});

        } catch (error) {
            // Tratamento de erros durante o "Try"
            res.status(500).json({errorCode:500, message: 'Erro no servidor.'});
            console.log(error);
        }
    },
    login: async (req, res) => {
        const { userName, senha } = req.body;
        // Recebendo as variáveis "userName" e "senha" do body.

        // Verificando se todos os campos estão preenchidos
        if (!userName || !senha) {
            return res.status(400).json({errorCode: 400, message: 'Faltam dados.'});
        }
        // Verificando se todos os dados inseridos são do tipo string.
        if (typeof userName !== 'string' || typeof senha !== 'string') {
            return res.status(400).json({errorCode: 400, message: 'Os dados devem ser do tipo string.'});
        }

        try {
            // Verificando se o nome de usuário inserido existe.
            const queryVerificaUsuario = 'SELECT * FROM usuarios WHERE userName=?';
            const [response] = await pool.query(queryVerificaUsuario, [userName]);

            if (response.length === 0) {
                return res.status(404).json({errorCode: 404, message: 'Usuário não encontrado.'});
                // Respota ao usuário caso o nome inserido não exista.
            }
            
            // Verificando se a senha inserida é a mesma registrada no Banco de Dados.
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
            // Resposta ao cliente que a autenticação foi realizada.

        } catch (err) {
            console.log(err);
            res.status(500).json({errorCode: 500, message: 'Erro no servidor'});
            // Tratamento de erros durante o "Try"
        }
    }
}

module.exports = usuariosController;