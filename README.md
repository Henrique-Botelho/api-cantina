# **Node JS Rest-API ⚛️** 

Rest-API com sistema de autenticação, feita utilizando MySQL2, Express.js, Node.js e bcrypt. 


# Instalação

Requisitos
* [Node.js](https://nodejs.org/en/)
* [Git](https://git-scm.com/downloads)
* [VS Code](https://code.visualstudio.com/download) ou qualquer editor de texto
* [Express](https://expressjs.com/pt-br/starter/installing.html)
* [Cors](https://expressjs.com/en/resources/middleware/cors.html)
* [MySQL2](https://www.npmjs.com/package/mysql2)

## Clonar esse repositório
```cmd
> git clone https://github.com/Henrique-Botelho/api-cantina
> cd api-cantina
```
Use `code .` para abrir a pasta no VS Code
```cmd
> code .
```

## Instalando as depêndencias
```cmd
> npm install
```

## Rodando a API
```cmd
> npm run dev
```

## Editando as credenciais do banco
Para fazer a conexão com o banco, acesse a pasta `config` e abra o arquivo `config.js`.

```js
const PORT = process.env.PORT || 8080;

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_NAME = process.env.DB_NAME || 'cantina';
const DB_PORT = process.env.DB_PORT || 3306;
const SECRET = process.env.SECRET || '';
const CARDAPIO_KEY = process.env.CARDAPIO_KEY || '';

module.exports = {
    PORT,
    DB_HOST,
    DB_USER,
    DB_PASS,
    DB_NAME,
    DB_PORT,
    SECRET,
    CARDAPIO_KEY
}
```
