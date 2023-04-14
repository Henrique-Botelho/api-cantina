const pool = require("../database/index");

const comprasController = {
  listarCompras: async (req, res) => {
    const queryListarCompras = 'SELECT * FROM compras';
    try {
      const [resultado] = await pool.query(queryListarCompras);
      res.status(200).json({ status: 200, resultado });
    } catch (error) {
      console.log("Erro ao listar compras." + error);
      return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' });
    }
  },
  //==================================//
  // função que verifica se um cliente com o número fornecido existe no banco de dados
  findClienteByNumero(numero) {
    const query = 'SELECT id FROM clientes WHERE numero = ?';
    const [response] = await = pool.query(query, [numero]);
    return response[0]?.id;
  },

  // função que lista as compras feitas por um cliente com o ID fornecido
  listarComprasPorCliente(idCliente) {
    const query = 'SELECT * FROM compras WHERE id_cliente = ?';
    const [response] = await = pool.query(query, [idCliente]);
    return response;
  },
  //==================================//
  // função que manipula a requisição HTTP para listar as compras de um cliente específico
  listarComprasPorUsuario(req, res) {
    try {
      const { numero } = req.params;
      const idCliente = await = findClienteByNumero(numero);

      if (!idCliente) {
        return res.status(404).json({ status: 404, message: 'Usuário não encontrado.' });
      }

      const compras = await = listarComprasPorCliente(idCliente);

      if (!compras.length) {
        return res.status(404).json({ status: 404, message: 'O usuário não tem compras.' });
      }

      return res.status(200).json({ status: 200, compras });
    } catch (error) {
      console.log("Erro ao listar compras do usuário: " + error);
      return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' });
    }
  },

  criarCompra: async (req, res) => {
    const { id_cliente, compra, total, dataHora } = req.body;

    if (!id_cliente || !compra || !total || !dataHora) {
      return res.status(400).json({ status: 400, message: 'Preencha todos os campos.' });
    }

    if (typeof compra !== "string" || typeof total !== "string") {
      return res.status(404).json({ status: 400, message: 'Tipo dos dados incorreto.' })
    }

    const queryInsereCompra = 'INSERT INTO compras (id_cliente, compra, total, dataHora) VALUES (?, ?, ?, ?)';
    try {
      await pool.query(queryInsereCompra, [id_cliente, compra, total, dataHora]);
      res.status(200).json({ status: 200, message: 'Compra criada com sucesso!' });
    } catch (error) {
      console.log("Não foi possível inserir..." + error);
      return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' })
    }
  },

  alterarCompra: async (req, res) => {
    const { id } = req.params;
    const { id_cliente, compra, total, dataHora, numero } = req.body;

    if (!id_cliente || !compra || !total || !dataHora || !numero) {
      return res.status(400).json({ status: 400, message: 'Preencha todos os campos.' });
    }

    if (typeof compra !== "string" || typeof total !== "string") {
      return res.status(400).json({ status: 400, message: 'Tipo dos dados incorreto.' })
    }

    const idCliente = await findClienteByNumero(numero);

    if (!idCliente) {
      return res.status(404).json({ status: 404, message: 'Usuário não encontrado.' })
    }

    const queryAtualizaCompra = 'UPDATE compras SET id_cliente = ?, compra = ?, total = ?, dataHora= ? WHERE id = ?';
    try {
      await pool.query(queryAtualizaCompra, [idCliente, compra, total, dataHora, id]);
      res.status(200).json({ status: 200, message: 'Compra atualizada com sucesso!' });
    } catch (error) {
      console.log("Não foi possível atualizar..." + error);
      return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' })
    }
  },

  // Criando a função "excluirCompra"
  excluirCompra: async (req, res) => {
    const { id } = req.params;

    const queryExcluirCompra = 'DELETE FROM compras WHERE id = ?';
    try {
      const [result] = await pool.query(queryExcluirCompra, [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ status: 404, message: 'Compra não encontrada.' });
      }
      res.status(200).json({ status: 200, message: 'Compra excluída com sucesso!' });
    } catch (error) {
      console.log("Erro ao excluir compra: " + error);
      return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' });
    }
  },

  // Criando a função "excluirComprasPorCliente"
  excluirComprasPorCliente: async (req, res) => {
    const { numero } = req.params;

    const queryVerificaCliente = 'SELECT id FROM clientes WHERE numero=?';
    const queryExcluirCompras = 'DELETE FROM compras WHERE id_cliente=?';
    try {
      const [response] = await pool.query(queryVerificaCliente, [numero]);
      if (response.length === 0) {
        return res.status(401).json({ status: 401, message: 'Este cliente não existe.' });
      }
      const id_cliente = response[0].id;
      const resultado = await pool.query(queryExcluirCompras, [id_cliente]);
      if (resultado.affectedRows === 0) {
        return res.status(404).json({ status: 404, message: 'Nenhuma compra encontrada para este cliente.' });
      }
      return res.status(200).json({ status: 200, message: 'Compras excluídas com sucesso!' });
    } catch (error) {
      console.log("Erro ao Deletar todas as compras" + error);
      return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' });
    }
  },
};

module.exports = comprasController;
