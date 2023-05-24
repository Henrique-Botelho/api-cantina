const pool = require('../database/index');

// Criando objeto "produtosController"
const produtosController = {
    // Criando a função "pegaTodosProdutos"
    pegaTodosProdutos: async (req, res) => {
        // Utilizando a query para selecionar todos os produtos
        const queryPegaTodosProdutos = 'SELECT * FROM produtos';

        try {
            // Fazendo a operação.
            const [response] = await pool.query(queryPegaTodosProdutos);
            // Exibindo os produtos
            return res.status(200).json(response);
        } catch (error) {
            // Resposta ao usuário que sua operação não foi realizada
            console.log('Erro ao listar todos os produtos: ' + error);
            // Tratamento de erros durante o "Try"
            return res.status(500).json({ message: 'Erro no contato com o servidor.' });
        }
    },
    // Criando a função "insereProduto"
    insereProduto: async (req, res) => {
        // Recebendo as variáveis "nome", "preco", "categoria" e "descricao" do body.
        let { nome, preco, categoria, descricao } = req.body;

        // Verificando se todos os campos estão preenchidos.
        if (!nome || !preco || !categoria || !descricao) {
            return res.status(400).json({ message: 'Todos os campos devem ser enviados.' });
        }
        // Verificando se quantidade de caracteres inseridos no nome está entre o mínimo e o máximo pedido.
        if (nome.length > 50 || categoria.length > 30) {
            return res.status(400).json({ message: 'Número de caracteres do nome ou da categoria muito grande.' });
        }
        // Verificando se o campo preco é do tipo number.
        if (typeof preco !== 'number') {
            preco = parseFloat(preco);
            if (Number.isNaN(preco)) { // is not number
                return res.status(400).json({ message: 'O campo preço deve ser do tipo número.' });
            }
        }
        // Verificando se os campos "nome", "categoria" e "descrição" são do tipo string.
        if ((typeof nome !== 'string') || (typeof categoria !== 'string') || (typeof descricao !== 'string')) {
            return res.status(400).json({ message: 'As colunas nome, categoria e descrição devem ser do tipo strings.' });
        }
        //Excluindo os espaços do começo e fim da string com método ".trim"
        nome = nome.trim();
        categoria = categoria.trim();
        descricao = descricao.trim();
        // Transformando todos os carácteres em minúsculo pelo método ".toLowerCase"
        nome = nome.toLowerCase();
        categoria = categoria.toLowerCase();
        descricao = descricao.toLowerCase();

        // Inserindo um novo produto na tabela produtos.
        const queryInsereProduto = 'INSERT INTO produtos (nome, preco, categoria, descricao) VALUES (?, ?, ?, ?)';
        try {
            // Realizando a operação
            await pool.query(queryInsereProduto, [nome, preco, categoria, descricao]);
            // Resposta ao usuario que seu produto foi inserido com sucesso
            return res.status(201).json({ message: 'Produto criado com sucesso!' });
        } catch (error) {
            // Resposta ao usuario que sua operação não foi realizada 
            console.log('Erro ao registrar um novo produto: ' + error);
            // Tratamento de erros durante o "Try"
            return res.status(500).json({ message: 'Erro no contato com o servidor.' })
        }
    },

    // Criando a função "atualizaProduto"
    atualizaProduto: async (req, res) => {
        // Recebendo o "id" dos parâmetros
        const { id } = req.params;
        // Recebendo as variáveis "nome", "preco", "categoria" e "descricao" do body.
        let { nome, preco, categoria, descricao } = req.body;

        // Verificando se todos os campos estão preenchidos.
        if (!nome || !preco || !categoria || !descricao) {
            return res.status(400).json({ message: 'Todos os campos devem ser enviados.' });
        }
        // Verificando se quantidade de caracteres inseridos no nome está entre o mínimo e o máximo pedido.
        if (nome.length > 50 || categoria.length > 30) {
            return res.status(400).json({ message: 'Número de caracteres do nome ou da categoria muito grande.' });
        }
        // Verificando se o campo preco é do tipo number.
        if (typeof preco !== 'number') {
            preco = parseFloat(preco);
            if (Number.isNaN(preco)) { // is not number
                return res.status(400).json({ message: 'O campo preço deve ser do tipo número.' });
            }
        }
        // Verificando se os campos "nome", "categoria" e "descrição" são do tipo string.
        if ((typeof nome !== 'string') || (typeof categoria !== 'string') || (typeof descricao !== 'string')) {
            return res.status(400).json({ message: 'As colunas nome, categoria e descrição devem ser do tipo strings.' });
        }
        //Excluindo os espaços do começo e fim da string com método ".trim"
        nome = nome.trim();
        categoria = categoria.trim();
        descricao = descricao.trim();
        // Transformando todos os carácteres em minúsculo pelo método ".toLowerCase"
        nome = nome.toLowerCase();
        categoria = categoria.toLowerCase();
        descricao = descricao.toLowerCase();

        // Selecionando o produto com o "id" informado
        const querySelecionaProduto = 'SELECT * FROM produtos WHERE id = ?';
        try {
            // Realizando a operação
            const [result] = await pool.query(querySelecionaProduto, [id]);
            const produto = result[0];
            if (!produto) {
                return res.status(404).json({ message: 'Produto não encontrado.' });
            }

            // Comparando os dados do produto no banco de dados com os dados enviados pelo cliente
            if (produto.nome === nome && produto.preco === preco && produto.categoria === categoria && produto.descricao === descricao) {
                return res.status(200).json({ message: 'As informações do Produto não foram alteradas.'});
            }

            // Atualizando o produto com os novos dados
            const queryAtualizaProduto = 'UPDATE produtos SET nome=?, preco=?, categoria=?, descricao=? WHERE id=?';
            const values = [nome, preco, categoria, descricao, id];
            await pool.query(queryAtualizaProduto, values);
            return res.status(200).json({ message: 'Produto atualizado com sucesso.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao atualizar o produto.' });
        }
    },


    // Criando a função "deletaProduto"
    deletaProduto: async (req, res) => {
        // Recebendo o "id" dos parâmetros
        const { id } = req.params;
        // Verificando se o id foi definido
        if (!id) {
            return res.status(400).json({ message: 'Envie o ID do produto para realizar a operação.' });
        }
        // Selecionando o produto a ser excluído pelo ID
        const querySelecionaProduto = 'SELECT * FROM produtos WHERE id = ?';
        try {
            // Realizando a operação
            const [response] = await pool.query(querySelecionaProduto, [id]);
            // Verificando se o produto existe
            if (response.length === 0) {
                return res.status(404).json({ message: 'Produto não encontrado.' });
            }
            // Excluindo o produto da tabela produtos
            const queryDeletaProduto = 'DELETE FROM produtos WHERE id = ?';
            await pool.query(queryDeletaProduto, [id]);
            // Resposta ao usuario que seu produto foi excluído com sucesso
            return res.status(200).json({ message: 'Produto excluído com sucesso!' });
        } catch (error) {
            // Resposta ao usuario que sua operação não foi realizada 
            console.log('Erro ao excluir o produto: ' + error);
            // Tratamento de erros durante o "Try"
            return res.status(500).json({ message: 'Erro no contato com o servidor.' })
        }
    }

}

module.exports = produtosController;