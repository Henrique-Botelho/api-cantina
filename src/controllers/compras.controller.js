const pool = require("../database/index");

// Criando objeto "comprasController"
const comprasController = {
  // Criando a função "listarCompras"
  listarCompras: async (req, res) => {
    // Utilizando a query para selecionar todas as compras
    const queryListarCompras = 'SELECT * FROM compras';
    try {
      // Fazendo a operação.
      const [resultado] = await pool.query(queryListarCompras);
      // Exibindo as compras
      res.status(200).json({ status: 200, resultado });
    } catch (error) {
      // Resposta ao usuario que sua operação não foi realizada.
      console.log("Erro ao listar compras." + error);
      // Tratamento de erros durante o "Try"
      return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' });
    }
  },
  // Criando a função "listarComprasPorUsuario"
  listarComprasPorUsuario: async (req, res) => {
    // Recebendo "numero" dos parâmetros
    const { numero } = req.params;
    // Selecionando clientes com o id vinculado ao numero inserido.
    const queryVerificaCliente = 'SELECT id FROM clientes WHERE numero = ?';
    // Selecionando todas as compras vinculadas com aquele id.
    const queryListarComprasPorUsuario = 'SELECT * FROM compras WHERE compras.id_cliente = ?';
    try {
      // Verificando se existe um cliente registrado com aquele "numero" (telefone).
      const [responseUsuario] = await pool.query(queryVerificaCliente, [numero])
      if (responseUsuario.length === 0) {
      // Resposta ao usuario que nenhum usuario foi encontrado com aquele telefone.
        return res.status(404).json({ status: 404, message: 'Usuário não encontrado.' })
      }
      const [response] = await pool.query(queryListarComprasPorUsuario, [responseUsuario[0].id])
      // Reposta ao cliente com as compras listadas
      return res.status(200).json({ status: 200, response });
    } catch (error) {
      // Resposta ao usuario que sua operação não foi realizada.
      console.log("Erro ao listar compras do usuário." + error);
      // Tratamento de erros durante o "Try"
      return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' })
    }
  },
  // Criando a função "criarCompra"
  criarCompra: async (req, res) => {
    // Recebendo as variáveis "id_cliente", "compra", "total" e "dataHora" do body.
    const { id_cliente, compra, total, dataHora } = req.body;
  
    // Verificando se os campos estão preenchidos.
    if (!id_cliente || !compra || !total || !dataHora) {
      // Resposta ao cliente que faltam campos para preencher.
      return res.status(400).json({ status: 400, message: 'Preencha todos os campos.' });
    }
    // Verificando se todos os dados são do tipo string.
    if(typeof compra !== "string" || typeof total !== "string"){
      // Resposta ao cliente que os dados são do tipo incorreto.
        return res.status(404).json({ status: 400, message: 'Tipo dos dados incorreto.'})
    }
    // Inserindo uma nova compra na tabela "compras".
    const queryInsereCompra = 'INSERT INTO compras (id_cliente, compra, total, dataHora) VALUES (?, ?, ?, ?)';
    try {
      // Realizando a operação de inserir os dados de uma nova compra.
      await pool.query(queryInsereCompra, [id_cliente, compra, total, dataHora]);
      // Resposta ao cliente que sua compra foi registrada com sucesso.
      res.status(200).json({ status: 200, message: 'Compra criada com sucesso!' });
    } catch (error) {
      // Resposta de erro que não foi possível inserir os dados.
      console.log("Não foi possível inserir os dados" + error);
      // Tratamento de erros durante o "Try"
      return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' });
    }
  },
  // Criando a função "alterarCompra"
  alterarCompra: async (req, res) => {
    // Recebendo "numero" dos parâmetros
    const { id } = req.params;
    // Recebendo as variáveis "compra", "total" e "dataHora" do body.
    const { compra, total, dataHora } = req.body;
    
    // Verificando se os campos estão preenchidos.
    if (!compra || !total || !dataHora) {
      // Resposta ao cliente que faltam campos para preencher.
      return res.status(400).json({ status: 400, message: 'Preencha todos os campos.' });
    }
    // Verificando se todos os dados são do tipo string.
    if(typeof compra !== "string" || typeof total !== "string"){
      // Resposta ao cliente que os dados são do tipo incorreto.
      return res.status(404).json({ status: 400, message: 'Tipo dos dados incorreto'})
  }
    // Alterando os dados de uma compra na tabela "compras".
    const queryAlterarCompra = 'UPDATE compras SET compra=?, total=?, dataHora=? WHERE id=?';
    try {
      // Realizando a operação de atualizar a compra.
      const resultado = await pool.query(queryAlterarCompra, [compra, total, dataHora, id]);
      if (resultado.affectedRows === 0) {
        //Resposta de erro que nenhuma compra foi encontrada.
        return res.status(404).json({ status: 404, message: 'Compra não encontrada' });
      }
      // Reposta ao cliente que sua comprada foi atualizada com sucesso.
      return res.status(200).json({ status: 200, message: 'Compra atualizada com sucesso!' });
    } catch (error) {
      // Tratamento de erros durante o "Try"
      console.log("Erro ao atualizar compra" + error);
      return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' });
    }
  },
  // Criando a função "excluirCompra"
  excluirCompra: async (req, res) => {
    // Recebendo "id" dos parâmetros
    const { id } = req.params;

    console.log(typeof id);

    // Deletando compras onde o "id" seja igual ao inserido.
    const queryExcluirCompra = 'DELETE FROM compras WHERE id=?';
    try {
      // Realizando a operação de excluir a compra.
      const resultado = await pool.query(queryExcluirCompra, [id]);
      if (resultado.affectedRows === 0) {
        // Resposta ao usuário que nehuma compra foi encontrada.
        return res.status(404).json({ status: 404, message: 'Compra não encontrada' });
      }
      // Resposta ao usuário que a compra foi excluída com sucesso.
      return res.status(200).json({ status: 200, message: 'Compra excluída com sucesso!' });
    } catch (error) {
      // Resposta de erro ao deletar a compra.
      console.log("Erro ao deletar compra" + error);
      // Tratamento de erros durante o "Try"
      return res.status(500).json({ status: 500, message: 'Erro no contato com o servidor.' });
    }
  },
  
  // Criando a função "excluirComprasPorCliente"
  excluirComprasPorCliente: async (req, res) => {
    const { numero } = req.params;
  
    const queryVerificaCliente = 'SELECT id FROM clientes WHERE numero=?';
    const queryExcluirCompras = 'DELETE FROM compras WHERE id_cliente=?';
    try {
      const [response] = await pool.query(queryVerificaCliente, numero);
      console.log(response);
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
