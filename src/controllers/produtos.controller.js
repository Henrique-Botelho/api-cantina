const pool = require('../database/index');

const produtosController = {
    pegaTodosProdutos: async (req, res) => {
        const queryPegaTodosProdutos = 'SELECT * FROM produtos';
        try {
            const [response] = await pool.query(queryPegaTodosProdutos);
            return res.status(200).json(response);
        } catch (error) {
            console.log('Erro ao pegar todos os produtos: ' + error);
            return res.status(500).json({errorCode: 500, message: 'Erro do servidor'});
        }
    },
    pegaProdutoCategoria: async (req, res) => {
        let { categoria } = req.params;
        categoria = categoria.toLowerCase();
        const queryPegaProdutoCategoria = 'SELECT * FROM produtos WHERE categoria= ?';
        try {
            const [response] = await pool.query(queryPegaProdutoCategoria, [categoria]);
            return res.status(200).json(response);
        } catch (error) {
            console.log('Erro ao pegar produtos dessa categoria: ' + error);
            return res.status(500).json({errorCode: 500, message: 'Erro do servidor'});
        }
    },
    insereProduto: async (req, res) => {
        let {nome, preco, categoria, descricao} = req.body;

        // Validações
        if (!nome || !preco || !categoria || !descricao) {
            return res.status(400).json({errorCode: 400, message: 'Todos os campos devem ser enviados.'})
        }

        if (nome.length > 50 || categoria.length > 30) {
            return res.status(400).json({errorCode: 400, message: 'Número de caracteres do nome ou da categoria muito grande.'});
        }
        if (typeof preco !== 'number') {
            preco = parseFloat(preco);
            if (Number.isNaN(preco)) {
                return res.status(400).json({errorCode: 400, message: 'O campo preço deve ser do tipo número.'});
            }
        }
        if ((typeof nome !== 'string') || (typeof categoria !== 'string') || (typeof descricao !== 'string')) {
            return res.status(400).json({errorCode: 400, message: 'As colunas nome, categoria e descrição devem ser do tipo strings.'});
        }
        nome = nome.trim();
        categoria = categoria.trim();
        descricao = descricao.trim();
        nome = nome.toLowerCase();
        categoria = categoria.toLowerCase();
        descricao = descricao.toLowerCase();

        const queryInsereProduto = 'INSERT INTO produtos (nome, preco, categoria, descricao) VALUES (?, ?, ?, ?)';
        try {
            const response = await pool.query(queryInsereProduto, [nome, preco, categoria, descricao]);
            return res.status(201).json({message: 'Produto criado com sucesso!', criado: {nome,preco,categoria,descricao}});
        } catch (error) {
            console.log('Erro ao registrar um novo produto: ' + error);
            return res.status(500).json({errorCode: 500, message: 'Erro do servidor.'})
        }
   },
   atualizaProduto: async (req, res) => {
        const { id } = req.params;
        let { nome, preco, categoria, descricao } = req.body;
    
        // Validação
        if (!nome || !preco || !categoria || !descricao) {
            return res.status(400).json({errorCode: 400, message: 'Todos os campos devem ser enviados.'})
        }
        if (!id) {
            return res.status(400).json({errorCode: 400, message: 'É necessário informar o id do produto que deseja alterar.'});
        }
        if (nome.length > 50 || categoria.length > 30) {
            return res.status(400).json({errorCode: 400, message: 'Número de caracteres do nome ou da categoria muito grande.'});
        }
        if (typeof preco !== 'number') {
            preco = parseFloat(preco);
            if (Number.isNaN(preco)) {
                return res.status(400).json({errorCode: 400, message: 'O campo preço deve ser do tipo número.'});
            }
        }
        if ((typeof nome !== 'string') || (typeof categoria !== 'string') || (typeof descricao !== 'string')) {
            return res.status(400).json({errorCode: 400, message: 'As colunas nome, categoria e descrição devem ser do tipo strings.'});
        }
        nome = nome.trim();
        categoria = categoria.trim();
        descricao = descricao.trim();
        nome = nome.toLowerCase();
        categoria = categoria.toLowerCase();
        descricao = descricao.toLowerCase();
        
        const queryAtualizaProduto = 'UPDATE produtos SET nome = ?, preco= ?, categoria= ?, descricao= ? WHERE id= ?';
        try {
            const [response] = await pool.query(queryAtualizaProduto, [nome,preco,categoria,descricao,id]);
            return res.status(200).json({message: 'Produto atualizado com sucesso!', atualizado: {nome,preco,categoria,descricao}});
        } catch (error) {
            console.log('Erro ao atualizar os dados: ' + error);
            return res.status(500).json({errorCode: 500, message: 'Erro do servidor.'});
        }
   },
   deletaProduto: async (req, res) => {
        const { id } = req.params;

        // Validação
        if (!id) {
            return res.status(400).json({errorCode: 400, message: 'É necessário informar o id do produto que deseja alterar.'});
        }
        const queryDeletaProduto = 'DELETE FROM produtos WHERE id= ?';
        try {
            const [response] = await pool.query(queryDeletaProduto, [id]);
            return res.status(200).json({message: 'Produto excluido com sucesso!'});
        } catch(error) {
            console.log('Erro ao tentar deletar esse produto: ' + error);
            return res.status(500).json({errorCode: 500, message: 'Erro no servidor.'});
        }
   }
}

module.exports = produtosController;