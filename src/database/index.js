const mysql = require('mysql2'); //'mysql2', que é uma biblioteca para conexão com bancos de dados MySQL
const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT } = require('../config/config');


//Ao criar um pool de conexão, o aplicativo pode gerenciar e reutilizar conexões de banco de dados existentes em vez de criar uma nova conexão para cada solicitação. Isso melhora o desempenho do aplicativo, reduz a sobrecarga do banco de dados e permite que o aplicativo execute várias consultas simultaneamente.
const pool = mysql.createPool({
    host: DB_HOST || localhost, //Essas informações incluem o nome do host do banco de dados (DB_HOST)
    user: DB_USER || root, //o nome de usuário
    password: DB_PASS || "", //a senha 
    database: DB_NAME || cantina, // nome do banco de dados
    port: DB_PORT || 3306 // a porta do servidor
});

module.exports = pool.promise();
