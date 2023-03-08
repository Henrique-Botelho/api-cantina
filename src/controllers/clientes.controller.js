const pool = require('../database/index');

//Objeto com todas as funcionalidades dos clientes
const clientesController = {
    cadastraCliente: async (req, res) => {
        const { nome, telefone } = req.body;

        //Validações
        if(!nome || !telefone){
            return res.status(400).json({ errorCode: 400, message: 'Todos os campos devem ser enviados.'})
        }

        if(nome.length > 50 || telefone.length !== 11){
            return res.status(400).json({ errorCode: 400, message: 'Quantidade de caracteres para nome e/ou telefone inválidos.' })
        }

        nome = nome.trim();
        telefone = telefone.trim();

        const queryInsereCliente = "INSERT INTO clientes (nome, telefone) VALUES (?, ?)"
        try{
            const response = await pool.query(queryInsereCliente, [nome, telefone]);
            res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });
        } catch(error){
            res.status(500).json({errorCode: 500, message: 'Erro no servidor.'});
            console.log('Erro ao cadastrar cliente' + error);
        }

        res.status(200).json({nome, telefone});
    },
    listaClientes: async (req, res) => {},
    atualizaCliente: async (req, res) => {},
    deletaCliente: async (req, res) => {},
};

module.exports = clientesController;