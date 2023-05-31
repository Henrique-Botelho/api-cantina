const pool = require("../database/index");
const transport = require('../email/index');
const { USER_EMAIL } = require('../config/config');

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
  listarComprasPorCliente: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "O cliente precisa ser informado (id)!" });
    }

    const queryListarComprasCliente = "SELECT com.id, com.compra, com.total, com.dataHora FROM compras AS com WHERE com.id_cliente=? AND com.status=0";
    try {
      const [response] = await pool.query(queryListarComprasCliente, [id]);
      return res.status(200).json(response);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Ocorreu um erro inesperado!" });
    }
  },
  insereCompra: async (req, res) => {
    let { cliente, total, compra, dataHora } = req.body;
    
    if (!cliente) {
      return res.status(400).json({ message: "O nome do cliente deve ser informado!" });
    }
    if (!total || !compra || !dataHora) {
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

    try {
      const queryInsereCompra = "INSERT INTO compras (compra, total, dataHora, id_cliente) SELECT ?, ?, ?, id FROM clientes WHERE nome=?";
      await pool.query(queryInsereCompra, [compra, total, dataHora, cliente]);

      const queryPegaEmail = "SELECT email FROM clientes WHERE clientes.nome=?";
      const [listaEmail] = await pool.query(queryPegaEmail, [cliente]);

      const dados = JSON.parse(compra);

      const tabela = `
        <table>
          <thead>
            <tr>
              <td>Quantidade</td>
              <td>Produto</td>
              <td>Preço</td>
            </tr>
          </thead>
          <tbody>
            ${dados.map(itens => `<tr><td>${itens.quantidade}</td><td>${itens.nome}</td><td>${itens.preco}</td></tr>`).join('')}
          </tbody>
        </table>`;

      
      const html = `<p>Aqui estão os detalhes da sua compra</p><br>${tabela}<br><p>Total: R$${total.toFixed(2).replace('.',',')}</p>`;


      await transport.sendMail({
        from: `Cantina Senai <${USER_EMAIL}>`,
        to: listaEmail[0].email,
        subject: "Recibo de compra",
        html: html
      });
      

      return res.status(201).json({ message: "Compra criada com sucesso!" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Ocorreu um erro inesperado ao inserir a compra!" });
    }
  },
  finalizarConta: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "O cliente deve ser informado (id)!" });
    }

    try {
      const queryFinalizaConta = "UPDATE compras com INNER JOIN clientes cli ON cli.id = com.id_cliente SET com.status=1 WHERE cli.id=?";
      await pool.query(queryFinalizaConta, [id]);
      return res.status(200).json({ message: "Conta finalizada com sucesso!" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Ocorreu um erro inesperado!" });
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
  },
};

module.exports = comprasController;
