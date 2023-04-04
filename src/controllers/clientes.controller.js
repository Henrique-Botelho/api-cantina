const { response } = require('express');
const pool = require('../database/index');

// Expressão regular para validar se o nome contém apenas letras, espaços e hífens.
const validarNome = /^[a-zA-ZÀ-ú]+([ '-][a-zA-ZÀ-ú]+)*$/;

// Expressão regular para validar se o telefone contém apenas números.
const validarTelefone = /^[0-9]{11}$/;


// Criando objeto "clientesController"
const clientesController = {
    cadastraCliente: async (req, res) => {
        // Recebendo as variáveis "nome" e "telefone" do body.
        const { nome, telefone } = req.body;
        
        // Verificando se todos os campos estão preenchidos
        if(!nome || !telefone){
            return res.status(400).json({ status: 400, message: 'Todos os campos devem ser enviados.'});
        }
        // Verificando se quantidade de caracteres inseridos no nome está entre o mínimo e o máximo pedido.
        if(nome.length > 50 || nome.length < 8){
            return res.status(400).json({ status: 400, message: 'Quantidade de caracteres para nome e/ou telefone inválidos.' });
        }
        // Verificando se quantidade de caracteres inseridos no telefone está entre o mínimo e o máximo pedido.
        if(telefone.length < 11 || telefone.length > 11){
            return res.status(400).json({status: 400, message: 'Quantidade de caracteres inválida'});
        }

        if (!validarNome.test(nome)) {
            return res.status(400).json({ status: 400, message: 'Nome deve conter apenas letras e espaços.' });
        }
        if (!validarTelefone.test(telefone)) {
            return res.status(400).json({ status: 400, message: 'Telefone deve conter apenas números.' });
        }
        // Verificando se todos os dados inseridos são do tipo string.
        if(typeof nome !== 'string' || typeof telefone !== 'string'){
            return res.status(400).json({status: 400, message: 'Dados não são do tipo string.'});
        }

        // Inserindo os dados do cliente no banco de dados.
        try {
            const queryInsereCliente = 'INSERT INTO clientes (nome, numero) VALUES (?, ?)';
            const response = await pool.query(queryInsereCliente, [nome, telefone]);
            console.log(response);
            return res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });
        } catch(error) {
            console.log('Erro ao cadastrar cliente' + error);
            return res.status(500).json({status: 500, message: 'Erro no contato com o servidor.'});
        }
    },

    listaClientes: async (req, res) => {
        // Selecionando todos os clientes na tabela clientes.
        const queryListaClientes = 'SELECT * FROM clientes';
        
        try{
            // Fazendo a operação.
            const [response] = await pool.query(queryListaClientes);
            return res.status(200).json(response);
        } catch(error) {
            // Resposta ao usuario que sua operação não foi realizada.
            console.log('Erro ao listar todos os clientes: ' + error);
            // Tratamento de erros durante o "Try"
            return res.status(500).json({status: 500, message: 'Erro no contato com o servidor.'});
        }

    },

    listaCLiente: async (req, res) => {
        //Recebendo o id do cliente passado nos parâmetros
        const { id } = req.params;

        //Validação
        if(!id){
            // Caso não seja inserido nenhum id, reposta ao cliente que é necessário ser inserido.
            return res.status(400).json({status: 400, message: 'É necessário informar o id do cliente a ser listado.'});
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
            return res.status(500).json({status: 500, message: 'Erro no contato com o servidor.'});
        }
    },

    atualizaCliente: async (req, res) => {
        //Recebendo o id do cliente
        const { id } = req.params;
        const { nome, telefone } = req.body;

        if(!id) {
            // Caso não seja inserido nenhum id, reposta ao cliente que é necessário ser inserido.
            return res.status(400).json({status: 400, message: 'É necessário informar o id do cliente a ser atualizado.'});
        }

        const verificaID = 'SELECT * FROM clientes WHERE id = (?)';

        // try {
            
        // } catch (error) {
            
        // }

        // const verificaCliente = async () => {
        //     const resposta = await pool.query(verificaID, id).then(res.status(200).json(resposta)).catch((error) => {
        //         console.log('Erro ao verificar cliente' + error);
        //         return res.status(500).json({ message: 'Cliente inexistente ou problemas com servidor.'});
        //     });
        // };

        if(nome && telefone){

        // Verificando se quantidade de caracteres inseridos no nome está entre o mínimo e o máximo pedido.
        if(nome.length > 50 || nome.length < 8){
            return res.status(400).json({ status: 400, message: 'Quantidade de caracteres inválida para o nome.' });
        }
        // Verificando se quantidade de caracteres inseridos no telefone está entre o mínimo e o máximo pedido.
        if(telefone.length < 11 || telefone.length > 11){
            return res.status(400).json({status: 400, message: 'Quantidade de caracteres inválida para o telefone.'});
        }
        // Verificando se todos os dados inseridos são do tipo string.
        if(typeof nome !== 'string' || typeof telefone !== 'string'){
            return res.status(400).json({status: 400, message: 'Dados não são do tipo string.'});
        }

        if (!validarNome.test(nome)) {
            return res.status(400).json({ status: 400, message: 'Nome deve conter apenas letras e espaços.' });
        }
        if (!validarTelefone.test(telefone)) {
            return res.status(400).json({ status: 400, message: 'Telefone deve conter apenas números.' });
        }


            // Atualizando os dados "nome" e "numero" da tabela "clientes" onde o id seja igual ao inserido. 
            const queryAtualizaCliente = 'UPDATE clientes SET nome = (?), numero = (?) WHERE id = (?)';
            try{
                // Fazendo a operação.
                const response = await pool.query(queryAtualizaCliente, [nome, telefone, id]);
                console.log(response)
                // Resposta ao usuario que a operação foi um sucesso.
                return res.status(200).json({ message: 'Cliente atualizado com sucesso.' });
            } catch(error) {
                // Resposta ao usuario que sua operação não foi realizada.
                console.log('Erro ao atualizar cliente' + error)
                // Tratamento de erros durante o "Try"
                return res.status(500).json({status: 500, message: 'Erro no contato com o servidor.'})
            }


        } else{
            
            if(!nome && !telefone){
                // Caso não seja inserido algum dos dados, reposta ao cliente que é necessário ser inserido.
                console.log('É necessário informar o nome e/ou o telefone do cliente a ser alterado.')
                return res.status(400).json({status: 400, message: 'É necessário informar o nome e/ou o telefone do cliente a ser alterado.'});
    
            } else if(!nome){

                // Verificando se quantidade de caracteres inseridos no telefone está entre o mínimo e o máximo pedido.
                if(telefone.length < 11 || telefone.length > 11){
                    return res.status(400).json({status: 400, message: 'Quantidade de caracteres inválida para o telefone.'});
                }
                // Verificando se os dados inseridos são do tipo string.
                if(typeof telefone !== 'string'){
                    return res.status(400).json({status: 400, message: 'Dados não são do tipo string.'});
                }

                if (!validarTelefone.test(telefone)) {
                    return res.status(400).json({ status: 400, message: 'Telefone deve conter apenas números.' });
                }

                // Atualizando os dados "numero" da tabela "clientes" onde o id seja igual ao inserido.
                const queryAtualizaCliente = 'UPDATE clientes SET numero = (?) WHERE id = (?)';
                // Fazendo a operação.
                await pool.query(queryAtualizaCliente, [telefone, id]).then(
                    // Resposta ao usuario que a operação foi um sucesso.
                    res.status(200).json({status: 200, message: 'Cliente atualizado com sucesso.'})
                )
                .catch((error) => {
                    // Resposta ao usuario que sua operação não foi realizada.
                    console.log('Erro ao atualizar cliente' + error)
                    // Tratamento de erros durante o "Try"
                    return res.status(500).json({status: 500, message: 'Erro no contato com o servidor.'})});

            } else {

                // Verificando se quantidade de caracteres inseridos no nome está entre o mínimo e o máximo pedido.
                if(nome.length > 50 || nome.length < 8){
                    return res.status(400).json({ status: 400, message: 'Quantidade de caracteres inválida para o nome.' });
                }

                // Verificando se os dados inseridos são do tipo string.
                if(typeof nome !== 'string'){
                    return res.status(400).json({status: 400, message: 'Dados não são do tipo string.'});
                }

                if (!validarNome.test(nome)) {
                    return res.status(400).json({ status: 400, message: 'Nome deve conter apenas letras e espaços.' });
                }

                // Atualizando os dados "nome" da tabela "clientes" onde o id seja igual ao inserido.
                const queryAtualizaCliente = 'UPDATE clientes SET nome = (?) WHERE id = (?)';
                // Fazendo a operação.
                await pool.query(queryAtualizaCliente, [nome, id]).then(
                    // Resposta ao usuario que a operação foi um sucesso.
                    res.status(200).json({status: 200, message: 'Cliente atualizado com sucesso.'})
                )
                .catch((error) => {
                    // Resposta ao usuario que sua operação não foi realizada.
                    console.log('Erro ao atualizar cliente' + error)
                    // Tratamento de erros durante o "Try"
                    return res.status(500).json({status: 500, message: 'Erro no contato com o servidor.'})});
            }
        }
    },

    deletaCliente: async (req, res) => {
        const { id } = req.params;
        const ID = parseInt(id);
    
        if (!ID) {
            return res.json({ message: 'É necessário informar o id do cliente a ser deletado.' }).status(400);
        }
    
        const queryDeletaCliente = 'DELETE FROM clientes WHERE id = ?';
    
        try {
            const [response] = await pool.query(queryDeletaCliente, ID);
            return res.status(200).json({ message: 'Cliente deletado com sucesso.' });

        } catch (error) {
            console.log('Erro ao tentar deletar o cliente: ' + error);
            return res.status(400).json({ message: 'Erro no contato com o servidor ou existem compras relacionadas ao cliente.' }).status(500);
        }
    }
    
};

module.exports = clientesController;