const pool = require("../database/index");

const comprasController = {
  // Função para criar compra
  criarCompra: async (req, res) => {
    const { id_cliente, compra, total, dataHora } = req.body;
    if (!id_cliente || !compra || !total || !dataHora) {
      return res.status(400).json({ errorCode: 400, message: "Faltam dados" })
    }
    const queryInsereCompra = "INSERT INTO compras (id_cliente, compra, total, dataHora) VALUES (?, ?, ?, ?)"
    try {
      const resultado = await pool.query(queryInsereCompra, [id_cliente, compra, total, dataHora]);
      res.status(200).json({statusCode: 200, message: "Compra criada com sucesso!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ errorCode: 500, message: "Erro do servidor" });
    }
  },

  // Função para alterar compra que foi criada
  alterarCompra: async (req, res) => {
    const { id } = req.params;
    const { compra, total, dataHora } = req.body;
    if (!compra || !total || !dataHora) {
      return res.status(400).json({ errorCode: 400, message: "Faltam dados" })
    }
    const queryalterarCompra = "UPDATE compras SET compra=?, total=?, dataHora=? WHERE id=?";
    try {
      const resultado = await pool.query(queryalterarCompra, [compra, total, dataHora, id]);
      if (resultado.affectedRows === 0) {
        return res.status(404).json({ errorCode: 404, message: "Compra não encontrada" });
      }
      return res.status(200).json({statusCode: 200, message: "Compra atualizada com sucesso!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ errorCode: 500, message: "Erro do servidor" });
    }
  },

  // Excluir a compra pelo ID
  excluirCompra: async (req, res) => {
    const { id } = req.params;
    const queryExcluirCompra = "DELETE FROM compras WHERE id=?";
    try {
      const resultado = await pool.query(queryExcluirCompra, [id]);
      if (resultado.affectedRows === 0) {
        return res.status(404).json({ errorCode: 404, message: "Compra não encontrada" });
      }
      return res.status(200).json({statusCode: 200, message: "Compra excluída com sucesso!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ errorCode: 500, message: "Erro do servidor" });
    }
  },

  // Função de pegar todas as compras
  listarCompras: async (req, res) => {
    try {
      const queryListarCompras = "SELECT * FROM compras";
      const resultado = await pool.query(queryListarCompras);
      res.status(200).json(resultado);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ errorCode: 500, message: "Erro do servidor" });
    }
  },

  // Função de pegar todas as compras de um usuário específico
  listarComprasPorUsuario: async (req, res) => {
    const { id_cliente } = req.params;
    try {
      const queryListarComprasPorUsuario = "SELECT * FROM compras WHERE id_cliente = ?";
      const resultado = await pool.query(queryListarComprasPorUsuario, [id_cliente]);
      res.status(200).json(resultado);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ errorCode: 500, message: "Erro ao pegar todas as compras" });
    }
  },
};

module.exports = comprasController;
