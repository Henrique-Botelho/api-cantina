const pool = require("../database/index");

const comprasController = {
  listarCompras: async (req, res) => {
    const queryListarCompras = 'SELECT cli.nome, com.id, com.id_cliente, com.compra, com.total, com.status, com.dataHora FROM clientes AS cli INNER JOIN compras AS com ON cli.id = com.id_cliente';
    try {
      const [resultado] = await pool.query(queryListarCompras);
      return res.status(200).json(resultado);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Erro no contato com o servidor.' });
    }
  },
  insereCompra: async (req, res) => {
    const { cliente, total, compra } = req.body;
    
    if (!cliente) {
      return res.status(400).json({ message: "O nome do cliente deve ser informado!" });
    }
    if (!total || !compra) {
      return res.status(400).json({ message: "Faltam dados" });
    }
    if ((typeof compra) !== "string") {
      return res.status(400).json({ message: "Dados na forma incorreta!" });
    }
    if ((typeof total) !== "number") {
      total = parseFloat(total);
      if (Number.isNaN(total)) {
        return res.status(400).json({ message: "Dados na forma incorreta!" });
      }
    }

    const queryInsereCompra = "INSERT INTO compras (compra, total, id_cliente) SELECT ?, ?, id FROM clientes WHERE nome=?";
    try {
      await pool.query(queryInsereCompra, [compra, total, cliente]);
      return res.status(201).json({ message: "Compra criada com sucesso!" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Ocorreu um erro inesperado ao inserir a compra!" });
    }
  },
  excluirCompra: async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "O id da compra deve ser enviado!" });
    }

    const queryExcluiCompra = "DELETE FROM compras WHERE id=?";
    try {
      await pool.query(queryExcluiCompra, [id]);
      return res.status(200).json({ message: "Compra excluida com sucesso!" });
    } catch(e) {
      console.log(e);
      return res.status(500).json({ message: "Erro ao excluir a compra!" });
    }
  }
};

module.exports = comprasController;
