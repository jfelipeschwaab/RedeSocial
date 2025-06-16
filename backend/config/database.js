// Importa o driver mysql2 para interagir com o MySQL.
const mysql = require('mysql2');
// Importa e configura o dotenv para carregar variáveis de ambiente do arquivo .env.
require('dotenv').config();

// Cria um pool de conexões com o banco de dados.
// Usar um pool é mais eficiente do que criar uma nova conexão para cada query.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // Espera por uma conexão disponível se todas estiverem em uso.
  connectionLimit: 10,     // Número máximo de conexões no pool.
  queueLimit: 0            // Fila ilimitada para queries aguardando conexão.
});

// Exporta a versão "promise-based" do pool, que permite usar async/await.
module.exports = pool.promise();
