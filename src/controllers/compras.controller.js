const pool = require("../database/index");

const comprasController = {
  // Função de pegar todas as compras
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
  // Função de pegar todas as compras de um cliente específico
  listarComprasPorUsuario: async (req, res) => {
    const { numero } = req.params;
    const queryVerificaCliente = 'SELECT id FROM clientes WHERE numero = ?';
    const queryListarComprasPorUsuario = 'SELECT * FROM compras INNER JOIN clientes ON compras.id_cliente = ?';
    try {
      // Encontrando o cliente pelo número
      const [responseUsuario] = await pool.query(queryVerificaCliente, [numero])
      if (responseUsuario.length === 0) {
        return res.status(404).json({ status: 404, message: 'Usuário não encontrado.' })
      }
      const [response] = await pool.query(queryListarComprasPorUsuario, [responseUsuario[0].id])
      return res.status(200).json({ status: 200, response });
    } catch (error) {
      console.log("Erro ao listar compras do usuário." + error);
      return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' })
    }
  },
  // Função para criar compra
  criarCompra: async (req, res) => {
    const { id_cliente, compra, total, dataHora } = req.body;
    if (!id_cliente || !compra || !total || !dataHora) {
      return res.status(400).json({ status: 400, message: 'Faltam dados para completar o registro.' });
    }
    if(typeof id_cliente !== "string" || typeof compra !== "string" || typeof total !== "string"){
        return res.status(404).json({ status: 400, message: 'Tipo dos dados incorreto'})
    }
    const queryInsereCompra = 'INSERT INTO compras (id_cliente, compra, total, dataHora) VALUES (?, ?, ?, ?)';
    try {
      await pool.query(queryInsereCompra, [id_cliente, compra, total, dataHora]);
      res.status(200).json({ status: 200, message: 'Compra criada com sucesso!' });
    } catch (error) {
      console.log("Não foi possível inserir os dados" + error);
      return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' });
    }
  },
  // Função para alterar compra que foi criada
  alterarCompra: async (req, res) => {
    const { id } = req.params;
    const { compra, total, dataHora } = req.body;
    if (!compra || !total || !dataHora) {
      return res.status(400).json({ status: 400, message: 'Faltam dados' });
    }
    if(typeof compra !== "string" || typeof total !== "string"){
      return res.status(404).json({ status: 400, message: 'Tipo dos dados incorreto'})
  }
    const queryAlterarCompra = 'UPDATE compras SET compra=?, total=?, dataHora=? WHERE id=?';
    try {
      const resultado = await pool.query(queryAlterarCompra, [compra, total, dataHora, id]);
      if (resultado.affectedRows === 0) {
        return res.status(404).json({ status: 404, message: 'Compra não encontrada' });
      }
      return res.status(200).json({ status: 200, message: 'Compra atualizada com sucesso!' });
    } catch (error) {
      console.log("Erro ao atualizar compra" + error);
      return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' });
    }
  },
  // Excluir a compra pelo ID
  excluirCompra: async (req, res) => {
    const { id } = req.params;
    const queryExcluirCompra = 'DELETE FROM compras WHERE id=?';
    try {
      const resultado = await pool.query(queryExcluirCompra, [id]);
      if (resultado.affectedRows === 0) {
        return res.status(404).json({ status: 404, message: 'Compra não encontrada' });
      }
      return res.status(200).json({ status: 200, message: 'Compra excluída com sucesso!' });
    } catch (error) {
      console.log("Erro ao deletar compra" + error);
      return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' });
    }
  },
  // Excluir todas as compras de um cliente pelo ID
  excluirComprasPorCliente: async (req, res) => {
    const { id_cliente } = req.params;

    const queryVerificaCliente = 'SELECT * FROM clientes WHERE id=?';
    const queryExcluirCompras = 'DELETE FROM compras WHERE id_cliente=?';
    try {
      const [response] = await pool.query(queryVerificaCliente, [id_cliente]);
      if (response.length === 0) {
        return res.status(401).json({status: 401, message: 'Esse cliente não existe.'});
      }
      const resultado = await pool.query(queryExcluirCompras, [id_cliente]);
      if (resultado.affectedRows === 0) {
        return res.status(404).json({ status: 404, message: 'Nenhuma compra encontrada para este cliente' });
      }
      return res.status(200).json({ status: 200, message: 'Compras excluídas com sucesso!' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' });
    }
  },
};

module.exports = comprasController;
