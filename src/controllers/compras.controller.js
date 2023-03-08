const pool = require("../database/index");

const comprasController = {
  criarCompra: async (req, res) => {
    const { id_cliente, compra, total, dataHora } = req.body;
    try {
        const queryInsereCompra = "INSERT INTO compras (id_cliente, compra, total, data_hora) VALUES (?, ?, ?, ?)"
      const resultado = await pool.query(queryInsereCompra, [id_cliente, compra, total, dataHora]);
      res.status(200).json({message:"Compra criada com sucesso!"});
    } catch (erro) {
      console.error(erro);
      res.status(500).send("Erro ao criar a compra");
    }
  },
};

module.exports = comprasController;
