const PORT = process.env.PORT || 8080;

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_NAME = process.env.DB_NAME || 'cantina';
const DB_PORT = process.env.DB_PORT || 3306;

module.exports = {
    PORT,
    DB_HOST,
    DB_USER,
    DB_PASS,
    DB_NAME,
    DB_PORT
}