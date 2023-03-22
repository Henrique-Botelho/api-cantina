const pool = require('../database/index');

const produtosController = {
    pegaTodosProdutos: async (req, res) => {
        const queryPegaTodosProdutos = 'SELECT * FROM produtos';

        try {
            const [response] = await pool.query(queryPegaTodosProdutos);
            return res.status(200).json(response);
        } catch (error) {
            console.log('Erro ao listar todos os produtos: ' + error);
            return res.status(500).json({status: 500, message: 'Erro no contato com o servidor.'});
        }
    },
    pegaProdutoCategoria: async (req, res) => {
        let { categoria } = req.params;

        //Validações
        if(!categoria){
            return res.status(400).json({status: 400, message: 'Envie uma categoria para realizar a operação.'});
        }
        categoria = categoria.toLowerCase();

        const queryPegaProdutoCategoria = 'SELECT * FROM produtos WHERE categoria= ?';
        try {
            const [response] = await pool.query(queryPegaProdutoCategoria, [categoria]);
            return res.status(200).json(response);
        } catch (error) {
            console.log('Erro ao listar produtos dessa categoria: ' + error);
            return res.status(500).json({status: 500, message: 'Erro no contato com o servidor.'});
        }
    },
    insereProduto: async (req, res) => {
        let {nome, preco, categoria, descricao} = req.body;

        // Validações
        if (!nome || !preco || !categoria || !descricao) {
            return res.status(400).json({status: 400, message: 'Todos os campos devem ser enviados.'});
        }

        if (nome.length > 50 || categoria.length > 30) {
            return res.status(400).json({status: 400, message: 'Número de caracteres do nome ou da categoria muito grande.'});
        }
        if (typeof preco !== 'number') {
            preco = parseFloat(preco);
            if (Number.isNaN(preco)) { // is not number
                return res.status(400).json({status: 400, message: 'O campo preço deve ser do tipo número.'});
            }
        }
        if ((typeof nome !== 'string') || (typeof categoria !== 'string') || (typeof descricao !== 'string')) {
            return res.status(400).json({status: 400, message: 'As colunas nome, categoria e descrição devem ser do tipo strings.'});
        }
        nome = nome.trim(); //tirando os espaços do começo e fim da string
        categoria = categoria.trim();
        descricao = descricao.trim();
        nome = nome.toLowerCase(); //deixando a string em letras minúsculas
        categoria = categoria.toLowerCase();
        descricao = descricao.toLowerCase();

        const queryInsereProduto = 'INSERT INTO produtos (nome, preco, categoria, descricao) VALUES (?, ?, ?, ?)';
        try {
            await pool.query(queryInsereProduto, [nome, preco, categoria, descricao]);
            return res.status(201).json({message: 'Produto criado com sucesso!'});
        } catch (error) {
            console.log('Erro ao registrar um novo produto: ' + error);
            return res.status(500).json({status: 500, message: 'Erro no contato com o servidor.'})
        }
   },
   atualizaProduto: async (req, res) => {
        const { id } = req.params;
        let { nome, preco, categoria, descricao } = req.body;
    
        // Validação
        if (!nome || !preco || !categoria || !descricao) {
            return res.status(400).json({status: 400, message: 'Todos os campos devem ser enviados.'})
        }
        if (!id) {
            return res.status(400).json({status: 400, message: 'É necessário informar o id do produto que deseja alterar.'});
        }
        if (nome.length > 50 || categoria.length > 30) {
            return res.status(400).json({status: 400, message: 'Número de caracteres do nome ou da categoria muito grande.'});
        }
        if (typeof preco !== 'number') {
            preco = parseFloat(preco);
            if (Number.isNaN(preco)) {
                return res.status(400).json({status: 400, message: 'O campo preço deve ser do tipo número.'});
            }
        }
        if ((typeof nome !== 'string') || (typeof categoria !== 'string') || (typeof descricao !== 'string')) {
            return res.status(400).json({status: 400, message: 'As colunas nome, categoria e descrição devem ser do tipo strings.'});
        }
        nome = nome.trim();
        categoria = categoria.trim();
        descricao = descricao.trim();
        nome = nome.toLowerCase();
        categoria = categoria.toLowerCase();
        descricao = descricao.toLowerCase();
        
        const queryAtualizaProduto = 'UPDATE produtos SET nome = ?, preco= ?, categoria= ?, descricao= ? WHERE id= ?';
        try {
            await pool.query(queryAtualizaProduto, [nome,preco,categoria,descricao,id]);
            return res.status(200).json({message: 'Produto atualizado com sucesso!'});
        } catch (error) {
            console.log('Erro ao atualizar os dados: ' + error);
            return res.status(500).json({status: 500, message: 'Erro no contato com o servidor.'});
        }
   },
   deletaProduto: async (req, res) => {
        const { id } = req.params;

        // Validação
        if (!id) {
            return res.status(400).json({status: 400, message: 'É necessário informar o id do produto que deseja alterar.'});
        }
        const queryDeletaProduto = 'DELETE FROM produtos WHERE id= ?';
        try {
            await pool.query(queryDeletaProduto, [id]);
            return res.status(200).json({message: 'Produto excluido com sucesso!'});
        } catch(error) {
            console.log('Erro ao tentar deletar esse produto: ' + error);
            return res.status(500).json({status: 500, message: 'Erro no contato com o servidor.'});
        }
   }
}

module.exports = produtosController;