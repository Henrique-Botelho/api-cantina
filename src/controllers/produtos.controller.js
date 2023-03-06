const pool = require('../database/index');

const produtosController = {
    pegaTodosProdutos: async (req, res) => {
        try {
            const queryPegaTodosProdutos = 'SELECT * FROM produtos';
            const [response] = await pool.query(queryPegaTodosProdutos);
            res.status(200).json(response);
        } catch (error) {
            console.log('Erro ao pegar todos os produtos: ' + error);
        }
    },
    insereProduto: async (req, res) => {
        try {
            const {nome, preco, categoria, descricao} = req.body;
            console.log(req.body);
            const queryInsereProduto = 'INSERT INTO produtos (nome, preco, categoria, descricao) VALUES (?, ?, ?, ?)';
            const response = await pool.query(queryInsereProduto, [nome, preco, categoria, descricao]);
            res.status(201).json(response);
        } catch (error) {
            console.log('Erro ao registrar um novo produto: ' + error);
        }
   }
}

module.exports = produtosController;