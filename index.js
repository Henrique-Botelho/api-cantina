const express = require('express');
const cors = require('cors');
const app = express();
const { PORT } = require('./src/config/config');

const produtosRouter = require('./src/routes/produtos.router');
const usuariosRouter = require('./src/routes/usuarios.router');
const clientesRouter = require('./src/routes/clientes.router');
const comprasRouter = require('./src/routes/compras.router');

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
    res.status(200).json({message: 'Bem vindo a API da cantina - Senai Suíço Brasileiro!'});
});

app.use('/api/produtos', produtosRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/clientes', clientesRouter);
app.use('/api/compras', comprasRouter);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}...`);
});