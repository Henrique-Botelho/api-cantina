const PORT = process.env.PORT || 8080; //"PORT" é a porta em que a aplicação será executada. Se a variável de ambiente "PORT" estiver definida, a aplicação usará esse valor para a porta. Caso contrário, usará a porta padrão 8080.

// Cada constante é definida usando o objeto "process.env", que permite que a aplicação acesse as variáveis ​​de ambiente definidas no sistema operacional.
const DB_HOST = process.env.DB_HOST || 'localhost'; //"DB_HOST" é o endereço do host do banco de dados que a aplicação deve usar. Se a variável de ambiente "DB_HOST" estiver definida, a aplicação usará esse valor como endereço. Caso contrário, usará o valor padrão 'localhost'.
const DB_USER = process.env.DB_USER || 'root'; //"DB_USER" é o nome de usuário usado para acessar o banco de dados,
const DB_PASS = process.env.DB_PASS || ''; //"DB_PASS" é a senha associada a esse usuário
const DB_NAME = process.env.DB_NAME || 'cantina'; //"DB_NAME" é o nome do banco de dados que a aplicação vai usar
const DB_PORT = process.env.DB_PORT || 3306; //"DB_PORT" é a porta na qual o banco de dados está sendo executado
const SECRET = process.env.SECRET || '94c23fd0fcf9056749e48821797666a2'; //"SECRET" é uma chave secreta usada para proteger informações confidenciais
const CARDAPIO_KEY = process.env.CARDAPIO_KEY || '07ad11b5bb6e2de98a535070ba93cdaf'; //"CARDAPIO_KEY" é uma chave usada para acessar um cardápio
const USER_EMAIL = process.env.USER_EMAIL || 'senaisuicoturma3dmA@gmail.com';
const PASS_EMAIL = process.env.PASS_EMAIL || 'prkeajixphcgtmpm';

module.exports = {
    PORT,
    DB_HOST,
    DB_USER,
    DB_PASS,
    DB_NAME,
    DB_PORT,
    SECRET,
    CARDAPIO_KEY,
    USER_EMAIL,
    PASS_EMAIL
}
