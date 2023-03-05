const pool = require('../database/index');

const produtosController = {
   insereProduto: async (req, res) => {
    try {
        const {nome, preco, categoria, descricao} = req.body;
        const queryInsereProduto = 'INSERT INTO produtos (nome, preco, categoria, descricao) VALUES (?, ?, ?, ?)';
        const response = await pool.query(queryInsereProduto, [nome, preco, categoria, descricao]);
        res.status(201).json(response);
    } catch (error) {
        console.log('Erro ao registrar um novo produto: ' + error);
    }
   }
}

module.exports = produtosController;