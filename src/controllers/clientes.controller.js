const { response } = require('express');
const pool = require('../database/index');

//Objeto com todas as funcionalidades dos clientes
const clientesController = {
    cadastraCliente: async (req, res) => {
        const { nome, telefone } = req.body;

        //Validações
        if(!nome || !telefone){
            return res.status(400).json({ status: 400, message: 'Todos os campos devem ser enviados.'});
        }
        if(nome.length > 50 || nome.length < 16){
            return res.status(400).json({ status: 400, message: 'Quantidade de caracteres para nome e/ou telefone inválidos.' });
        }
        if(telefone.length < 11 || telefone.length > 11){
            return res.status(400).json({status: 400, message: 'Faltam números para realização do cadastro'});
        }
        if(typeof nome !== 'string' || typeof telefone !== 'string'){
            return res.status(400).json({status: 400, message: 'Dados não são do tipo string.'});
        }

        //Consulta no banco de dados
        const queryInsereCliente = 'INSERT INTO clientes (nome, numero) VALUES (?, ?)'
        try{
            const response = await pool.query(queryInsereCliente, [nome, telefone]);
            console.log(response);
            return res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });
            
        } catch(error){
            console.log('Erro ao cadastrar cliente' + error);
            return res.status(500).json({status: 500, message: 'Erro no contato com o servidor.'});
        }
    },

    listaClientes: async (req, res) => {
        //Consulta no banco de dados
        const queryListaClientes = 'SELECT * FROM clientes';
        try{
            const [response] = await pool.query(queryListaClientes);
            return res.status(200).json(response);
        } catch(error) {
            console.log('Erro ao listar todos os clientes: ' + error);
            return res.status(500).json({status: 500, message: 'Erro no contato com o servidor.'});
        }

    },

    listaCLiente: async (req, res) => {
        //Pegando o id do cliente passado nos parâmetros
        const { id } = req.params;

        //Validação
        if(!id){
            return res.status(400).json({status: 400, message: 'É necessário informar o id do cliente a ser listado.'});
        }

        //Consulta no banco de dados 
        const queryListaCliente = 'SELECT nome, telefone FROM clientes WHERE id = (?)';
        try {
            const [response] = await pool.query(queryListaCliente, id);
            return res.status(200).json(response);
        } catch (error) {
            console.log('Erro ao listar o cliente específico: ' + error);
            return res.status(500).json({status: 500, message: 'Erro no contato com o servidor.'});
        }
    },

    atualizaCliente: async (req, res) => {
        //Puxando o id do cliente
        const { id } = req.params;
        const { nome, telefone } = req.body;

        //Validações
        if(!id){
            return res.status(400).json({status: 400, message: 'É necessário informar o id do cliente a ser atualizado.'});
        }
        if(nome && telefone){
            //Consulta no banco de dados
            const queryAtualizaCliente = 'UPDATE clientes SET nome = (?), numero = (?) WHERE id = (?)';
            try{
                const response = await pool.query(queryAtualizaCliente, [nome, telefone, id]);
                console.log(response)
                return res.status(200).json({ message: 'Cliente atualizado com sucesso.' });
            } catch(error) {
                console.log('Erro ao atualizar cliente' + error)
                return res.status(500).json({status: 500, message: 'Erro no contato com o servidor.'})
            }


        } else{
            
            if(!nome && !telefone){
                console.log('É necessário informar o nome e/ou o telefone do cliente a ser alterado.')
                return res.status(400).json({status: 400, message: 'É necessário informar o nome e/ou o telefone do cliente a ser alterado.'});
    
            } else if(!nome){
                const queryAtualizaCliente = 'UPDATE clientes SET numero = (?) WHERE id = (?)';
                await pool.query(queryAtualizaCliente, [telefone, id]).then(
                    res.status(200).json({status: 200, message: 'Cliente atualizado com sucesso.'})
                )
                .catch((error) => {
                    console.log('Erro ao atualizar cliente' + error)
                    return res.status(500).json({status: 500, message: 'Erro no contato com o servidor.'})});

            } else {
                const queryAtualizaCliente = 'UPDATE clientes SET nome = (?) WHERE id = (?)';
                await pool.query(queryAtualizaCliente, [nome, id]).then(
                    res.status(200).json({status: 200, message: 'Cliente atualizado com sucesso.'})
                )
                .catch((error) => {
                    console.log('Erro ao atualizar cliente' + error)
                    return res.status(500).json({status: 500, message: 'Erro no contato com o servidor.'})});
            }
        }
    },

    deletaCliente: async (req, res) => {
        const { id } = req.params;

        //Validações
        if(!id){
            return res.status(400).json({status: 400, message: 'É necessário informar o id do cliente a ser deletado.'});
        }
        
        //Consulta no banco de dados
        const queryDeletaCliente = 'DELETE * FROM clientes WHERE id = (?)';
        try{
            const [response] = await pool.query(queryDeletaCliente, id);
            console.log(response);
            return res.status(200).json({ message: 'Cliente deletado com sucesso.' });
        } catch (error) {
            console.log('Erro ao tentar deletar o cliente: ' + error);
            return res.status(500).json({status: 500, message: 'Erro no contato com o servidor, verificar se há compras relacionadas ao cliente.'});
        }
        
    },
};

module.exports = clientesController;