const express = require('express');
const cors = require('cors'); //O 'cors' é utilizado para permitir que o servidor receba requisições de outros domínios, o que pode ser útil para aplicações que precisam interagir com outras aplicações web.
const app = express(); //app' que representa a aplicação Express.
const { PORT } = require('./src/config/config');

const produtosRouter = require('./src/routes/produtos.router'); //produtosRouter: importa um módulo produtos.router.js que contém rotas para manipulação de produtos.
const usuariosRouter = require('./src/routes/usuarios.router'); // usuariosRouter: importa um módulo usuarios.router.js que contém rotas para manipulação de usuários.
const clientesRouter = require('./src/routes/clientes.router'); // clientesRouter: importa um módulo clientes.router.js que contém rotas para manipulação de clientes.
const comprasRouter = require('./src/routes/compras.router'); // comprasRouter: importa um módulo compras.router.js que contém rotas para manipulação de compras.

app.use(cors());
app.use(express.json()); //json que converte os dados enviados em requisições com o tipo de conteúdo application/json

//api. Quando a rota é acessada, a função de retorno de chamada é executada, que neste caso retorna um objeto JSON com uma mensagem de boas-vindas.
app.get('/api', (req, res) => {
    res.status(200).json({message: 'Bem vindo a API da cantina - Senai Suíço Brasileiro!'});
});

app.use('/api/produtos', produtosRouter); //api/produtos. Ela usa o método use() do objeto app para associar a rota a um router específico chamado produtosRouter.
app.use('/api/usuarios', usuariosRouter); //api/produtos. Ela usa o método use() do objeto app para associar a rota a um router específico chamado usuariosRouter.
app.use('/api/clientes', clientesRouter); //api/produtos. Ela usa o método use() do objeto app para associar a rota a um router específico chamado clientesRouter.
app.use('/api/compras', comprasRouter); //api/produtos. Ela usa o método use() do objeto app para associar a rota a um router específico chamado comprasRouter.


//Ele usa o método listen() do objeto app e uma função de retorno de chamada para imprimir uma mensagem no console.log, informando que o servidor está em execução.
app.listen({
  host: '0.0.0.0',
  port: 3000
}, () => {
    console.log(`Servidor rodando na porta ${3000}...`);
});
