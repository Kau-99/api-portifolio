const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

// Função para abrir a conexão com o banco de dados
async function openDb() {
    return open({
        filename: './database.db', // O arquivo que será criado na raiz do projeto
        driver: sqlite3.Database
    });
}

// Função para criar a tabela se ela não existir
async function initDb() {
    const db = await openDb();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            year INTEGER
        )
    `);
}

// Executa a criação da tabela logo que o arquivo for chamado
initDb();

module.exports = { openDb };