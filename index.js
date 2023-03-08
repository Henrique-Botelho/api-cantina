const express = require('express');
const cors = require('cors');
const app = express();
const { PORT } = require('./src/config/config');

const produtosRouter = require('./src/routes/produtos.router');
const usuariosRouter = require('./src/routes/usuarios.router');
const clientesRouter = require('./src/routes/clientes.router');

app.use(cors());
app.use(express.json());

app.use('/produtos', produtosRouter);
app.use('/usuarios', usuariosRouter);
app.use('/clientes', clientesRouter);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}...`);
});