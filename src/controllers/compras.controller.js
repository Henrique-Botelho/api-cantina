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
    const { id_cliente, compra, total } = req.body;

    if (!id_cliente || !compra || !total) {
      return res.status(400).json({ status: 400, message: 'Preencha todos os campos.' });
    }

    if (typeof compra !== 'string' || typeof total !== 'number') {
      return res.status(400).json({ status: 400, message: 'Tipo dos dados incorreto.' });
    }

    const cliente = await comprasController.findClienteById(id_cliente);

    if (!cliente) {
      return res.status(404).json({ status: 404, message: 'Cliente não encontrado.' });
    }

    const queryInsereCompra = 'INSERT INTO compras (id_cliente, compra, total) VALUES (?, ?, ?)';
    try {
      await pool.query(queryInsereCompra, [id_cliente, compra, total]);
      res.status(201).json({ status: 201, message: 'Compra criada com sucesso!' });
    } catch (error) {
      console.log('Não foi possível inserir...' + error);
      return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' });
    }
  },

  //aqui editarCompra
  editarCompra: async (req, res) => {
    const { id } = req.params;
    const { id_cliente, compra, total, dataHora } = req.body;

    if (!id_cliente || !compra || !total) {
      return res.status(400).json({ status: 400, message: 'Por favor, preencha todos os campos.' });
    }

    if (typeof compra !== "string" || typeof total !== "string") {
      return res.status(400).json({ status: 400, message: 'Tipo de dados incorreto.' })
    }

    // verifica se a compra existe e pertence ao cliente informado
    const queryBuscaCompra = 'SELECT * FROM compras WHERE id = ? AND id_cliente = ?';
    try {
      const [result] = await pool.query(queryBuscaCompra, [id, id_cliente]);
      if (result.length === 0) {
        return res.status(404).json({ status: 404, message: 'Compra não encontrada.' });
      }

      // verifica se as informações da compra foram alteradas
      const { id_cliente: oldIdCliente, compra: oldCompra, total: oldTotal } = result[0];
      if (id_cliente === oldIdCliente && compra === oldCompra && total === oldTotal) {
        return res.status(200).json({ status: 200, message: 'As informações da compra não foram alteradas.' });
      }

    } catch (error) {
      console.log("Erro ao buscar compra: " + error);
      return res.status(500).json({ status: 500, message: 'Não foi possível buscar a compra no banco de dados.' });
    }

    // atualiza a compra no banco de dados
    const queryAtualizaCompra = 'UPDATE compras SET id_cliente= ?, compra= ?, total= ? WHERE id= ?';
    try {
      const [result] = await pool.query(queryAtualizaCompra, [id_cliente, compra, total, id]);
      if (result.affectedRows === 0) {
        return res.status(500).json({ status: 500, message: 'Não foi possível atualizar a compra. As informações da compra não foram alteradas.' });
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
  
    // Verifica se a compra existe e se ainda não foi paga
    const queryVerificaCompra = 'SELECT * FROM compras WHERE id = ? AND pago = 0';
    try {
      const [compras] = await pool.query(queryVerificaCompra, [id]);
      if (compras.length === 0) {
        return res.status(404).json({ status: 404, message: 'Compra não encontrada ou já foi paga.' });
      }
  
      // Exclui a compra
      const queryExcluirCompra = 'DELETE FROM compras WHERE id = ?';
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
