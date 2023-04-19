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
  async findClienteById(id) {
    const query = 'SELECT * FROM clientes WHERE id = ?';
    const [response] = await pool.query(query, [id]);
    if (response.length === 0) {
      return null; // ou undefined
    }
    return response[0];
  },

  // função que lista as compras feitas por um cliente com o ID fornecido
  async listarCompraPorCliente(idCliente) {
    const query = 'SELECT * FROM compras WHERE id_cliente = ?';
    const [response] = await pool.query(query, [idCliente]);
    return response;
  },

  // função que manipula a requisição HTTP para listar as compras de um cliente específico
  async listarComprasPorUsuario(req, res) {
    try {
      const { id } = req.params;
      const cliente = await comprasController.findClienteById(id);

      if (!cliente) {
        return res.status(404).json({ status: 404, message: 'Cliente não encontrado.' });
      }

      const compras = await comprasController.listarCompraPorCliente(cliente.id);

      return res.status(200).json({ status: 200, compras });
    } catch (error) {
      console.log("Erro ao listar compras do usuário: " + error);
      return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' });
    }
  },
  //==================================//

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

  //aqui editarCompra
  editarCompra: async (req, res) => {
    const { id } = req.params; // extrai o id da compra a ser atualizada a partir dos parâmetros da requisição
    const { id_cliente, compra, total, dataHora } = req.body; // extrai os novos valores da compra do corpo da requisição

    // verifica se todos os campos foram preenchidos
    if (!id_cliente || !compra || !total || !dataHora) {
      return res.status(400).json({ status: 400, message: 'Por favor, preencha todos os campos.' });
    }

    // verifica se os tipos de dados são válidos
    if (typeof compra !== "string" || typeof total !== "string") {
      return res.status(400).json({ status: 400, message: 'Tipo de dados incorreto.' })
    }

    // verifica se a compra pertence ao cliente informado
    const queryBuscaCompra = 'SELECT * FROM compras WHERE id_cliente = ? AND id = ?';
    try {
      const [result] = await pool.query(queryBuscaCompra, [id_cliente, id]);
      if (result.length === 0) {
        return res.status(404).json({ status: 404, message: 'Compra não encontrada.' });
      }
    } catch (error) {
      console.log("Erro ao buscar compra: " + error);
      return res.status(500).json({ status: 500, message: 'Não foi possível buscar a compra no banco de dados.' });
    }

    // atualiza a compra no banco de dados
    const queryAtualizaCompra = 'UPDATE compras SET id_cliente= ?, compra= ?, total= ?, dataHora= ? WHERE id= ?';
    try {
      const [result] = await pool.query(queryAtualizaCompra, [id_cliente, compra, total, dataHora, id]);
      if (result.affectedRows === 0) {
        return res.status(500).json({ status: 500, message: 'Não foi possível atualizar a compra no banco de dados.' });
      }
      return res.status(200).json({ status: 200, message: 'Compra atualizada com sucesso!' });
    } catch (error) {
      console.log("Erro ao atualizar compra: " + error);
      return res.status(500).json({ status: 500, message: 'Não foi possível atualizar a compra no banco de dados.' });
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
      const [clientes] = await pool.query(queryVerificaCliente, [numero]);
      if (clientes.length === 0) {
        return res.status(401).json({ status: 401, message: 'Este cliente não existe.' });
      }

      const [compras] = await pool.query('SELECT * FROM compras WHERE id_cliente IN (SELECT id FROM clientes WHERE numero=?)', [numero]);
      if (compras.length === 0) {
        return res.status(404).json({ status: 404, message: 'Nenhuma compra encontrada para este cliente.' });
      }

      let algumaCompraExcluida = false;
      for (const cliente of clientes) {
        const resultado = await pool.query(queryExcluirCompras, [cliente.id]);
        if (resultado.affectedRows !== 0) {
          algumaCompraExcluida = true;
        }
      }

      if (algumaCompraExcluida) {
        return res.status(200).json({ status: 200, message: 'Compras excluídas com sucesso!' });
      } else {
        return res.status(200).json({ status: 200, message: 'Nenhuma compra encontrada para este cliente.' });
      }

    } catch (error) {
      console.log("Erro ao Deletar todas as compras" + error);
      return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' });
    }
  },
};

module.exports = comprasController;
