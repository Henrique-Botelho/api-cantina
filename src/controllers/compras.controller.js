const pool = require("../database/index");

const comprasController = {
  listarCompras: async (req, res) => {
    const queryListarCompras = 'SELECT * FROM compras';
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
    
    console.log(typeof total);

    if (!cliente) {
      return res.status(400).json({message: "O nome do cliente deve ser informado!"});
    }
    if (!total || !compra) {
      return res.status(400).json({message: "Faltam dados"});
    }
    if ((typeof compra) !== "string") {
      return res.status(400).json({message: "Dados na forma incorreta!"});
    }
    if ((typeof total) !== "number") {
      total = parseFloat(total);
      if (Number.isNaN(total)) {
        return res.status(400).json({message: "Dados na forma incorreta!"});
      }
    }

    const queryInsereCompra = "INSERT INTO compras (compra, total, id_cliente) SELECT ?, ?, id FROM clientes WHERE nome=?";
    try {
      await pool.query(queryInsereCompra, [compra, total, cliente]);
      return res.status(201).json({message: "Compra criada com sucesso!"});
    } catch (e) {
      console.log(e);
      return res.status(500).json({message: "Ocorreu um erro inesperado ao inserir a compra!"});
    }
  }
};

module.exports = comprasController;
