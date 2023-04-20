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
            return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' });
        }
    },
    // Criando a função "pegaProdutoCategoria"
    pegaProdutoCategoria: async (req, res) => {
        // Recebendo a variável "categoria" dos parâmetros
        let { categoria } = req.params;

        // Verificando se a categoria foi definida
        if (!categoria) {
            return res.status(400).json({ status: 400, message: 'Envie uma categoria para realizar a operação.' });
        }
        // Transformando todos os carácteres em minúsculo pelo método ".toLowerCase"
        categoria = categoria.toLowerCase();

        // Selecionando todos os produtos = a categoria selecionada
        const queryPegaProdutoCategoria = 'SELECT * FROM produtos WHERE categoria= ? ORDER BY nome';
        try {
            // Realizando a operação
            const [response] = await pool.query(queryPegaProdutoCategoria, [categoria]);
            return res.status(200).json(response);
        } catch (error) {
            // Resposta ao cliente que sua operação não foi realizada
            console.log('Erro ao listar produtos dessa categoria: ' + error);
            // Tratamento de erros durante o "Try"
            return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' });
        }
    },
    // Criando a função "insereProduto"
    insereProduto: async (req, res) => {
        // Recebendo as variáveis "nome", "preco", "categoria" e "descricao" do body.
        let { nome, preco, categoria, descricao } = req.body;

        // Verificando se todos os campos estão preenchidos.
        if (!nome || !preco || !categoria || !descricao) {
            return res.status(400).json({ status: 400, message: 'Todos os campos devem ser enviados.' });
        }
        // Verificando se quantidade de caracteres inseridos no nome está entre o mínimo e o máximo pedido.
        if (nome.length > 50 || categoria.length > 30) {
            return res.status(400).json({ status: 400, message: 'Número de caracteres do nome ou da categoria muito grande.' });
        }
        // Verificando se o campo preco é do tipo number.
        if (typeof preco !== 'number') {
            preco = parseFloat(preco);
            if (Number.isNaN(preco)) { // is not number
                return res.status(400).json({ status: 400, message: 'O campo preço deve ser do tipo número.' });
            }
        }
        // Verificando se os campos "nome", "categoria" e "descrição" são do tipo string.
        if ((typeof nome !== 'string') || (typeof categoria !== 'string') || (typeof descricao !== 'string')) {
            return res.status(400).json({ status: 400, message: 'As colunas nome, categoria e descrição devem ser do tipo strings.' });
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
            return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' })
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
            return res.status(400).json({ status: 400, message: 'Todos os campos devem ser enviados.' })
        }
        // Verificando se o "id" foi inserido.
        if (!id) {
            return res.status(400).json({ status: 400, message: 'É necessário informar o id do produto que deseja alterar.' });
        }
        // Verificando se quantidade de caracteres inseridos no nome está entre o mínimo e o máximo pedido.
        if (nome.length > 50 || categoria.length > 30) {
            return res.status(400).json({ status: 400, message: 'Número de caracteres do nome ou da categoria muito grande.' });
        }
        // Verificando se o campo preco é do tipo number.
        if (typeof preco !== 'number') {
            preco = parseFloat(preco);
            if (Number.isNaN(preco)) {
                return res.status(400).json({ status: 400, message: 'O campo preço deve ser do tipo número.' });
            }
        }
        // Verificando se os campos "nome", "categoria" e "descrição" são do tipo string.
        if ((typeof nome !== 'string') || (typeof categoria !== 'string') || (typeof descricao !== 'string')) {
            return res.status(400).json({ status: 400, message: 'As colunas nome, categoria e descrição devem ser do tipo strings.' });
        }
        //Excluindo os espaços do começo e fim da string com método ".trim"
        nome = nome.trim();
        categoria = categoria.trim();
        descricao = descricao.trim();
        // Transformando todos os carácteres em minúsculo pelo método ".toLowerCase"
        nome = nome.toLowerCase();
        categoria = categoria.toLowerCase();
        descricao = descricao.toLowerCase();

        // Atualizando o produto na tabela "produtos"
        const queryAtualizaProduto = 'UPDATE produtos SET nome = ?, preco= ?, categoria= ?, descricao= ? WHERE id= ?';
        try {
            // Realizando a operação.
            await pool.query(queryAtualizaProduto, [nome, preco, categoria, descricao, id]);
            return res.status(200).json({ message: 'Produto atualizado com sucesso!' });
        } catch (error) {
            // Tratamento de erros durante o "Try"
            console.log('Erro ao atualizar os dados: ' + error);
            return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' });
        }
    },
    // Criando a função "deletaProduto"
    deletaProduto: async (req, res) => {
        // Recebendo o "id" dos parâmetros
        // Verificando se o "id" foi inserido.
        if (!id) {
            return res.status(400).json({ status: 400, message: 'É necessário informar o id do produto que deseja excluir.' });
        }

        // Verificando se o produto existe antes de excluí-lo.
        const queryVerificaProduto = 'SELECT * FROM produtos WHERE id = ?';
        try {
            const [rows, fields] = await pool.query(queryVerificaProduto, [id]);

            // Se o produto não existe, retorna mensagem de erro ao usuário.
            if (rows.length === 0) {
                return res.status(404).json({ status: 404, message: 'Produto não encontrado.' });
            }

            // Deletando o produto onde o "id" seja igual ao inserido.
            const queryDeletaProduto = 'DELETE FROM produtos WHERE id= ?';
            try {
                // Realizando a operação
                await pool.query(queryDeletaProduto, [id]);
                return res.status(200).json({ message: 'Produto excluído com sucesso!' });
            } catch (error) {
                // Tratamento de erros durante o "Try"
                console.log('Erro ao tentar deletar esse produto: ' + error);
                return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' });
            }

        } catch (error) {
            console.log('Erro ao tentar verificar se o produto existe: ' + error);
            return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' });
        }
    }

}

module.exports = produtosController;