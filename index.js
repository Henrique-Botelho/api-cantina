const express = require('express');
const cors = require('cors');
const app = express();
const { PORT } = require('./src/config/config');

const produtosRouter = require('./src/routes/produtos.router');
const usuariosRouter = require('./src/routes/usuarios.router');

app.use(cors());
app.use(express.json());

app.use('/produtos', produtosRouter);
app.use('/usuarios', usuariosRouter);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}...`);
});