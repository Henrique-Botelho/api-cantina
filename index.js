const express = require('express');
const cors = require('cors');
const app = express();
const { PORT } = require('./src/config/config');
const produtosRouter = require('./src/routes/produtos.router');

app.use(cors());
app.use(express.json());

app.use('/produtos', produtosRouter);


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}...`);
});