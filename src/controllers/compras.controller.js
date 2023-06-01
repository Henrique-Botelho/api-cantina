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
        <table border="1px" width="500">
          <thead>
            <tr>
              <th>Quantidade</th>
              <th>Produto</th>
              <th>Preço</th>
            </tr>
          </thead>
          <tbody>
            ${dados.map(itens => `<tr><td>${itens.quantidade}</td><td>${itens.nome[0].toUpperCase() + itens.nome.substring(1)}</td><td>R$ ${itens.preco.toFixed(2).replace('.',',')}</td></tr>`).join('')}
          </tbody>
        </table>`;

      
      const html = `<p>Aqui estão os detalhes da sua compra</p><br>${tabela}<br><p><b>TOTAL:</b> R$${total.toFixed(2).replace('.',',')}</p>`;


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
  pagarCompra: async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "A compra deve ser informada (id)!" });
    }

    try {
      const queryPagarCompra = "UPDATE compras SET status=1 WHERE id=?";
      await pool.query(queryPagarCompra, [id]);

      const queryDadosEmail = "SELECT clientes.email, compras.dataHora, compras.compra, compras.total FROM compras INNER JOIN clientes ON clientes.id=compras.id_cliente WHERE compras.id=?";
      const [info] = await pool.query(queryDadosEmail, [id]);

      let total = info[0].total;
      let dados = JSON.parse(info[0].compra);

      const tabela = `
        <table border="1px" width="500">
          <thead>
            <tr>
              <th>Quantidade</th>
              <th>Produto</th>
              <th>Preço</th>
            </tr>
          </thead>
          <tbody>
            ${dados.map(itens => `<tr><td>${itens.quantidade}</td><td>${itens.nome[0].toUpperCase() + itens.nome.substring(1)}</td><td>R$ ${itens.preco.toFixed(2).replace('.',',')}</td></tr>`).join('')}
          </tbody>
        </table>`;

        const html = `<p>A compra realizada em ${info[0].dataHora} foi paga!</p><br><p>Detalhes da compra:</p><br>${tabela}<br><p><b>TOTAL:</b> R$${total.toFixed(2).replace('.',',')}</p>`;

      await transport.sendMail({
        from: `Cantina Senai <${USER_EMAIL}>`,
        to: info[0].email,
        subject: "Compra paga",
        html: html
      });

      return res.status(200).json({ message: "Compra atualizada como paga!" });
    
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Ocorreu um erro inesperado!" });
    }

  },
  finalizarConta: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "O cliente deve ser informado (id)!" });
    }

    try {
      const queryBuscaDados = "SELECT compras.compra, compras.total, compras.dataHora, clientes.email FROM compras INNER JOIN clientes ON clientes.id=compras.id_cliente WHERE compras.status=0 AND clientes.id=?";
      const [info] = await pool.query(queryBuscaDados, [id]);
      console.log(info);

      const queryFinalizaConta = "UPDATE compras com INNER JOIN clientes cli ON cli.id = com.id_cliente SET com.status=1 WHERE cli.id=?";
      await pool.query(queryFinalizaConta, [id]);

      let total = 0;
      let dados = [];

      info.map(item => {
        total += item.total
        let comps = JSON.parse(item.compra);
        let quant = comps.length;
        comps.map((cada, index) => {
          if (index == 0) {
            dados.push(`
              <tr>
                <td rowspan="${quant}" align="center">${item.dataHora}</td>
                <td>${cada.quantidade}</td>
                <td>${cada.nome}</td>
                <td>R$ ${cada.preco.toFixed(2).replace('.',',')}</td>
                </tr>`
                )
          } else {
            dados.push(`
                <tr>
                <td>${cada.quantidade}</td>
                <td>${cada.nome}</td>
                <td>R$ ${cada.preco.toFixed(2).replace('.',',')}</td>
              </tr>
            `)
          }
        });
      });

      const tabela = `
        <table border="1px" width="500">
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Quantidade</th>
              <th>Produto</th>
              <th>Preço</th>
            </tr>
          </thead>
          <tbody>
            ${dados.map(item => item)}
          </tbody>
        </table>`;

      const html = `<p>As suas compras pendentes foram pagas!</p><br><p>Detalhes das compras:</p><br>${tabela}<br><p><b>TOTAL:</b> R$${total.toFixed(2).replace('.',',')}</p>`

      await transport.sendMail({
        from: `Cantina Senai <${USER_EMAIL}>`,
        to: info[0].email,
        subject: "Compras pagas",
        html: html
      });
      

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
