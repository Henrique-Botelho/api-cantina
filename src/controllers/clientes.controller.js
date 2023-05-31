const { response } = require('express');
const pool = require('../database/index');

// Expressão regular para validar se o nome contém apenas letras, espaços e hífens.
const validarNome = /^[a-zA-ZÀ-ú]+([ '-][a-zA-ZÀ-ú]+)*$/;

// Expressão regular para validar se o numero contém apenas números.
const validarNumero = /^[0-9]{8,}$/;

// Criando objeto "clientesController"
const clientesController = {
    cadastraCliente: async (req, res) => {
        const { nome, numero, email } = req.body;

        if (!nome || !numero || !email) {
            return res.status(400).json({ message: 'Todos os campos devem ser enviados.' });
        }

        if (nome.length > 50 || numero.length < 8) {
            return res.status(400).json({ message: 'Quantidade de caracteres para nome e/ou numero inválidos.' });
        }

        if (!validarNome.test(nome)) {
            return res.status(400).json({ message: 'Nome deve conter apenas letras e espaços.' });
        }

        if (!validarNumero.test(numero)) {
            return res.status(400).json({ message: 'O telefone deve conter apenas números e no mínimo 8 caracteres.' });
        }

        try {
            const queryBuscaCliente = 'SELECT * FROM clientes WHERE numero = ? OR email= ?';
            const [rows] = await pool.query(queryBuscaCliente, [numero, email]);

            if (rows.length > 0) {
                return res.status(400).json({ message: 'Já existe um cliente cadastrado com este número de telefone ou email.' });
            }

            const queryInsereCliente = 'INSERT INTO clientes (nome, numero, email) VALUES (?, ?, ?)';
            await pool.query(queryInsereCliente, [nome, numero, email]);

            return res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });
        } catch (error) {
            console.log('Erro ao cadastrar cliente' + error);
            return res.status(500).json({ message: 'Erro no contato com o servidor.' });
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
            return res.status(500).json({ message: 'Erro no contato com o servidor.' });
        }

    },

    listaCliente: async (req, res) => {
        //Recebendo o id do cliente passado nos parâmetros
        const { id } = req.params;

        //Validação
        if (!id) {
            // Caso não seja inserido nenhum id, reposta ao cliente que é necessário ser inserido.
            return res.status(400).json({ message: 'É necessário informar o id do cliente a ser listado.' });
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
            return res.status(500).json({ message: 'Erro no contato com o servidor.' });
        }
    },

    atualizaCliente: async (req, res) => {
        const { id } = req.params;
        const { nome, numero } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'É necessário informar o id do cliente a ser atualizado.' });
        }

        const verificaID = 'SELECT * FROM clientes WHERE id = ?';

        try {
            const [rows] = await pool.query(verificaID, [id]);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Cliente não encontrado. Não é possível atualizar.' });
            }

            if (nome) {
                if (!validarNome.test(nome)) {
                    return res.status(400).json({ message: 'Nome deve conter apenas letras e espaços.' });
                }
                if (nome.length < 8 || nome.length > 50) {
                    return res.status(400).json({ message: 'Quantidade de caracteres para nome inválida.' });
                }
            }

            if (numero) {
                if (!validarNumero.test(numero)) {
                    return res.status(400).json({ message: 'Número deve conter apenas números.' });
                }
                if (numero.length !== 11) {
                    return res.status(400).json({ message: 'Quantidade de caracteres para número inválida.' });
                }
            }

            // verifica se há mudanças antes de atualizar
            if (nome === rows[0].nome && numero === rows[0].numero) {
                return res.status(200).json({ message: 'As informações do cliente não foram alteradas.' });
            }

            const queryAtualizaCliente = 'UPDATE clientes SET nome = ?, numero = ? WHERE id = ?';
            const response = await pool.query(queryAtualizaCliente, [nome, numero, id]);

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

        const queryBuscaCompras = "SELECT * FROM compras WHERE id_cliente=? AND status=0";

        const queryBuscaCliente = 'SELECT * FROM clientes WHERE id = ?';

        try {
            const [comprasNaoPagas] = await pool.query(queryBuscaCompras, [ID]);

            if (comprasNaoPagas.length !== 0) {
                return res.status(400).json({ message: "Esse cliente possui compras não pagas!" });
            }

            const [rows] = await pool.query(queryBuscaCliente, ID);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Cliente não encontrado.' });
            }
            const queryDeletaCliente = 'DELETE FROM clientes WHERE id = ?';
            await pool.query(queryDeletaCliente, ID);
            return res.status(200).json({ message: 'Cliente deletado com sucesso.' });
        } catch (error) {
            console.log('Erro ao tentar deletar o cliente: ' + error);
            return res.status(400).json({ message: 'Ocorreu um erro inesperado!' }).status(500);
        }
    }
};

module.exports = clientesController;
