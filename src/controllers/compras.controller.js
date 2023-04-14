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

  listarComprasPorUsuario(req, res) {
    const { numero } = req.params;
    const queryVerificaCliente = 'SELECT id FROM clientes WHERE numero = ?';
    const queryListarComprasPorUsuario = 'SELECT * FROM compras WHERE id_cliente = ?';
  
    try {
      const [responseUsuario] = await = pool.query(queryVerificaCliente, [numero]);
  
      if (!responseUsuario.length) {
        return res.status(404).json({ status: 404, message: 'Usuário não encontrado.' });
      }
  
      const idCliente = responseUsuario[0].id;
  
      const [response] = await = pool.query(queryListarComprasPorUsuario, [idCliente]);
  
      if (!response.length) {
        return res.status(404).json({ status: 404, message: 'O usuário não tem compras.' });
      }
  
      return res.status(200).json({ status: 200, response });
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

    if (!id_cliente || !compra || !total || !dataHora) {
      return res.status(400).json({ status: 400, message: 'Preencha todos os campos.' });
    }

    if (typeof compra !== "string" || typeof total !== "string") {
      return res.status(404).json({ status: 400, message: 'Tipo dos dados incorreto.' })
    }

    const queryAtualizaCompra = 'UPDATE compras SET id_cliente = (SELECT id FROM clientes WHERE numero = ?), compra = ?, total = ?, dataHora= ? WHERE id = ?';
    try {
      const [response] = await pool.query('SELECT id FROM clientes WHERE numero = ?', [numero])
      if (response.length === 0) {
        return res.status(404).json({ status: 404, message: 'Usuário não encontrado.' })
      }
      await pool.query(queryAtualizaCompra, [numero, compra, total, dataHora, id]);
      res.status(200).json({ status: 200, message: 'Compra atualizada com sucesso!' });
    } catch (error) {
      console.log("Não foi possível atualizar..." + error);
      return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' })
    }
  },
  // Criando a função "excluirCompra"
  excluirCompra: async (req, res) => {
    // Recebendo "id" dos parâmetros
    const { id } = req.params;

    // Deletando compras onde o "id" seja igual ao inserido.
    const queryExcluirCompra = 'DELETE FROM compras WHERE id=?';
    try {
      // Realizando a operação de excluir a compra.
      const resultado = await pool.query(queryExcluirCompra, [id]);
      if (resultado.affectedRows === 0) {
        // Resposta ao usuário que nehuma compra foi encontrada.
        return res.status(404).json({ status: 404, message: 'Compra não encontrada ou já foi excluída.' });
      }
      // Resposta ao usuário que a compra foi excluída com sucesso.
      return res.status(204).send();
    } catch (error) {
      // Resposta de erro ao deletar a compra.
      console.log("Erro ao deletar compra" + error);
      // Tratamento de erros durante o "Try"
      return res.status(500).json({ status: 500, message: 'Erro ao excluir a compra.' });
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
