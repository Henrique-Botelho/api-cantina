const PORT = process.env.PORT || 8080;

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_NAME = process.env.DB_NAME || 'cantina';
const DB_PORT = process.env.DB_PORT || 3306;
const SECRET = process.env.SECRET || '94c23fd0fcf9056749e48821797666a2';
const CARDAPIO_KEY = process.env.CARDAPIO_KEY || '07ad11b5bb6e2de98a535070ba93cdaf';

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