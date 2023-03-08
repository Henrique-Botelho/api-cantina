const pool = require('../database/index');

//Objeto com todas as funcionalidades dos clientes
const clientesController = {
    cadastraCliente: async (req, res) => {
        const { nome, telefone } = req.body;

        //Validações
        if(!nome || !telefone){
            return res.status(400).json({ errorCode: 400, message: 'Todos os campos devem ser enviados.'})
        }

        if(nome.length > 50){
            return res.status(400).json({ errorCode: 400, message: 'Quantidade de caracteres para nome e/ou telefone inválidos.' })
        }

        nome = nome.trim();
        telefone = telefone.trim();

        //Consulta no banco de dados
        const queryInsereCliente = "INSERT INTO clientes (nome, numero) VALUES (?, ?)"
        try{
            const response = await pool.query(queryInsereCliente, [nome, telefone]);
            return res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });
        } catch(error){
            console.log('Erro ao cadastrar cliente' + error);
            return res.status(500).json({errorCode: 500, message: 'Erro no servidor.'});
        }
    },
    listaClientes: async (req, res) => {

        //Consulta no banco de dados
        const queryListaClientes = "SELECT * FROM clientes";
        try{
            const [response] = await pool.query(queryListaClientes);
            return res.status(200).json(response);
        } catch(error) {
            console.log('Erro ao listar todos os clientes: ' + error);
            return res.status(500).json({errorCode: 500, message: 'Erro do servidor'});
        }

    },
    atualizaCliente: async (req, res) => {
        //Puxando o id do cliente
        const { id } = req.params;
        const { nome, telefone } = req.body;

        //Validações
        if(typeof id !== 'number'){
            return res.status(400).json({errorCode: 400, message: 'O id deve ser um número.'})
        }

        //Consulta no banco de dados
        const queryAtualizaCliente = "UPDATE clientes SET nome = (?), numero = (?) WHERE id = (?)"
        try{
            const [response] = await pool.query(queryAtualizaCliente, [nome, telefone, id]);
            return res.status(200).json(response);
        } catch(error) {
            console.log('Erro ao atualizar cliente' + error)
            return res.status(500).json({errorCode: 500, message: 'Erro no servidor.'})
        }
    },
    deletaCliente: async (req, res) => {},
};

module.exports = clientesController;