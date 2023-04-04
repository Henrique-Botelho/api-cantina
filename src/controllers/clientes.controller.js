const { response } = require('express');
const pool = require('../database/index');

// Expressão regular para validar se o nome contém apenas letras, espaços e hífens.
const validarNome = /^[a-zA-ZÀ-ú]+([ '-][a-zA-ZÀ-ú]+)*$/;

// Expressão regular para validar se o telefone contém apenas números.
const validarTelefone = /^[0-9]{11}$/;


// Criando objeto "clientesController"
const clientesController = {
    cadastraCliente: async (req, res) => {
        const { nome, telefone } = req.body;

        if (!nome || !telefone) {
            return res.status(400).json({ status: 400, message: 'Todos os campos devem ser enviados.' });
        }

        if (nome.length > 50 || nome.length < 8 || telefone.length !== 11) {
            return res.status(400).json({ status: 400, message: 'Quantidade de caracteres para nome e/ou telefone inválidos.' });
        }

        if (!validarNome.test(nome)) {
            return res.status(400).json({ status: 400, message: 'Nome deve conter apenas letras e espaços.' });
        }

        if (!validarTelefone.test(telefone)) {
            return res.status(400).json({ status: 400, message: 'Telefone deve conter apenas números.' });
        }

        try {
            const queryVerificaCliente = 'SELECT COUNT(*) as total FROM clientes WHERE nome = ? OR numero = ?';
            const response = await pool.query(queryVerificaCliente, [nome, telefone]);
            const totalClientes = response[0].total;

            if (totalClientes > 0) {
                return res.status(400).json({ status: 400, message: 'Cliente já cadastrado.' });
            }

            const queryInsereCliente = 'INSERT INTO clientes (nome, numero) VALUES (?, ?)';
            const response2 = await pool.query(queryInsereCliente, [nome, telefone]);

            return res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });
        } catch (error) {
            console.log('Erro ao cadastrar cliente' + error);
            return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' });
        }
    },

    listaClientes: async (req, res) => {
        // Selecionando todos os clientes na tabela clientes.
        const queryListaClientes = 'SELECT * FROM clientes';

        try {
            // Fazendo a operação.
            const [response] = await pool.query(queryListaClientes);
            return res.status(200).json(response);
        } catch (error) {
            // Resposta ao usuario que sua operação não foi realizada.
            console.log('Erro ao listar todos os clientes: ' + error);
            // Tratamento de erros durante o "Try"
            return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' });
        }

    },

    listaCLiente: async (req, res) => {
        //Recebendo o id do cliente passado nos parâmetros
        const { id } = req.params;

        //Validação
        if (!id) {
            // Caso não seja inserido nenhum id, reposta ao cliente que é necessário ser inserido.
            return res.status(400).json({ status: 400, message: 'É necessário informar o id do cliente a ser listado.' });
        }

        // Selecionando "nome" e "telefone" na tabela "clientes" onde o "id" seja igual ao inserido. 
        const queryListaCliente = 'SELECT nome, numero FROM clientes WHERE id = (?)';
        try {
            // Fazendo a operação.
            const [response] = await pool.query(queryListaCliente, id);
            return res.status(200).json(response);
        } catch (error) {
            // Resposta ao usuario que sua operação não foi realizada.
            console.log('Erro ao listar o cliente específico: ' + error);
            // Tratamento de erros durante o "Try"
            return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' });
        }
    },

    atualizaCliente: async (req, res) => {
        const { id } = req.params;
        const { nome, telefone } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'É necessário informar o id do cliente a ser atualizado.' });
        }

        if ((!nome && telefone) || (nome && !telefone)) {
            return res.status(400).json({ message: 'Nome e telefone devem ser atualizados juntos.' });
        }

        if (nome && !validarNome.test(nome)) {
            return res.status(400).json({ message: 'Nome deve conter apenas letras e espaços.' });
        }

        if (telefone && !validarTelefone.test(telefone)) {
            return res.status(400).json({ message: 'Telefone deve conter apenas números.' });
        }

        try {
            const queryVerificaCliente = 'SELECT * FROM clientes WHERE id = ?';
            const [response] = await pool.query(queryVerificaCliente, [id]);

            if (!response) {
                return res.status(404).json({ message: 'Cliente não encontrado.' });
            }

            const queryAtualizaCliente = 'UPDATE clientes SET nome = ?, numero = ? WHERE id = ?';
            await pool.query(queryAtualizaCliente, [nome, telefone, id]);

            return res.status(200).json({ message: 'Cliente atualizado com sucesso!' });
        } catch (error) {
            console.log('Erro ao atualizar cliente: ' + error);
            return res.status(500).json({ message: 'Erro no contato com o servidor.' });
        }
    },


    deletaCliente: async (req, res) => {
        const { id } = req.params;
        const ID = parseInt(id);

        if (!ID) {
            return res.json({ message: 'É necessário informar o id do cliente a ser deletado.' }).status(400);
        }

        const queryBuscaCliente = 'SELECT * FROM clientes WHERE id = ?';

        try {
            const [rows] = await pool.query(queryBuscaCliente, ID);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Cliente não encontrado.' });
            }

            const queryDeletaCliente = 'DELETE FROM clientes WHERE id = ?';
            const [response] = await pool.query(queryDeletaCliente, ID);
            return res.status(200).json({ message: 'Cliente deletado com sucesso.' });
        } catch (error) {
            console.log('Erro ao tentar deletar o cliente: ' + error);
            return res.status(400).json({ message: 'Erro no contato com o servidor ou existem compras relacionadas ao cliente.' }).status(500);
        }
    }

};

module.exports = clientesController;