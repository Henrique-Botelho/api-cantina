const pool = require('../database/index');

const produtosController = {
    pegaTodosProdutos: async (req, res) => {
        const queryPegaTodosProdutos = 'SELECT * FROM produtos';
        try {
            const [response] = await pool.query(queryPegaTodosProdutos);
            return res.status(200).json(response);
        } catch (error) {
            res.status(500).json({message: 'Erro do servidor'});
            console.log('Erro ao pegar todos os produtos: ' + error);
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
            res.status(500).json({message: 'Erro do servidor'});
            console.log('Erro ao pegar produtos dessa categoria: ' + error);
        }
    },
    insereProduto: async (req, res) => {
        let {nome, preco, categoria, descricao} = req.body;

        // Verificando o tamanho dos valores
        if (nome.length > 50 || categoria.length > 30) {
            return res.status(400).json({message: 'Número de caracteres do nome ou da categoria muito grande.'});
        }
        // Verificando o tipo de dado do preço
        if (typeof preco !== 'number') {
            preco = parseFloat(preco);
            if (Number.isNaN(preco)) {
                return res.status(400).json({message: 'O campo preço deve ser do tipo número.'});
            }
        }
        // Verificando o tipo de dado dos outros campos
        if ((typeof nome !== 'string') || (typeof categoria !== 'string') || (typeof descricao !== 'string')) {
            return res.status(400).json({message: 'As colunas nome, categoria e descrição devem ser do tipo strings.'});
        }
        // Removendo espaços em branco
        nome = nome.trim();
        categoria = categoria.trim();
        descricao = descricao.trim();
        // Deixando as strings todas minúsculas
        nome = nome.toLowerCase();
        categoria = categoria.toLowerCase();
        descricao = descricao.toLowerCase();

        const queryInsereProduto = 'INSERT INTO produtos (nome, preco, categoria, descricao) VALUES (?, ?, ?, ?)';
        try {
            const response = await pool.query(queryInsereProduto, [nome, preco, categoria, descricao]);
            res.status(201).json({response, criado: {nome,preco,categoria,descricao}});
        } catch (error) {
            console.log('Erro ao registrar um novo produto: ' + error);
        }
   },
   atualizaProduto: async (req, res) => {
        const { id } = req.params;
        let { nome, preco, categoria, descricao } = req.body;
        
        // Verificando o tamanho dos valores
        if (nome.length > 50 || categoria.length > 30) {
            return res.status(400).json({message: 'Número de caracteres do nome ou da categoria muito grande.'});
        }
        // Verificando o tipo de dado do preço
        if (typeof preco !== 'number') {
            preco = parseFloat(preco);
            if (Number.isNaN(preco)) {
                return res.status(400).json({message: 'O campo preço deve ser do tipo número.'});
            }
        }
        // Verificando o tipo de dado dos outros campos
        if ((typeof nome !== 'string') || (typeof categoria !== 'string') || (typeof descricao !== 'string')) {
            return res.status(400).json({message: 'As colunas nome, categoria e descrição devem ser do tipo strings.'});
        }
        // Removendo espaços em branco
        nome = nome.trim();
        categoria = categoria.trim();
        descricao = descricao.trim();
        // Deixando as strings todas minúsculas
        nome = nome.toLowerCase();
        categoria = categoria.toLowerCase();
        descricao = descricao.toLowerCase();
        
        const queryAtualizaProduto = 'UPDATE produtos SET nome = ?, preco= ?, categoria= ?, descricao= ? WHERE id= ?';
        try {
            const [response] = await pool.query(queryAtualizaProduto, [nome,preco,categoria,descricao,id]);
            res.status(200).json({response, atualizado: {nome,preco,categoria,descricao}});
        } catch (error) {
            res.status(500).json({message: 'Erro do servidor.'});
            console.log('Erro ao atualizar os dados: ' + error);
        }
   },
   deletaProduto: async (req, res) => {
    
   }
}

module.exports = produtosController;