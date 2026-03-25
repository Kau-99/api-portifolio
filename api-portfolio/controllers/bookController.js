const { openDb } = require('../config/db');

// Lógica para listar todos os livros (SELECT)
const getAllBooks = async (req, res) => {
    const db = await openDb();
    const books = await db.all('SELECT * FROM books');
    res.status(200).json(books);
};

// Lógica para buscar um livro por ID (SELECT com WHERE)
const getBookById = async (req, res) => {
    const db = await openDb();
    const book = await db.get('SELECT * FROM books WHERE id = ?', [req.params.id]);

    if (!book) return res.status(404).json({ error: 'Livro não encontrado.' });
    
    res.status(200).json(book);
};

// Lógica para criar um livro (INSERT)
const createBook = async (req, res) => {
    const { title, author, year } = req.body;

    if (!title || !author) {
        return res.status(400).json({ error: 'Os campos "title" e "author" são obrigatórios.' });
    }

    const db = await openDb();
    const result = await db.run(
        'INSERT INTO books (title, author, year) VALUES (?, ?, ?)',
        [title, author, year || null]
    );

    // Retorna o livro recém-criado com o ID que o banco gerou (result.lastID)
    res.status(201).json({ id: result.lastID, title, author, year });
};

// Lógica para atualizar um livro (UPDATE)
const updateBook = async (req, res) => {
    const { title, author, year } = req.body;
    const db = await openDb();
    
    // Primeiro, verifica se o livro existe
    const book = await db.get('SELECT * FROM books WHERE id = ?', [req.params.id]);
    if (!book) return res.status(404).json({ error: 'Livro não encontrado.' });

    // Atualiza os dados
    await db.run(
        'UPDATE books SET title = ?, author = ?, year = ? WHERE id = ?',
        [title || book.title, author || book.author, year || book.year, req.params.id]
    );

    res.status(200).json({ message: 'Livro atualizado com sucesso!' });
};

// Lógica para deletar um livro (DELETE)
const deleteBook = async (req, res) => {
    const db = await openDb();
    const result = await db.run('DELETE FROM books WHERE id = ?', [req.params.id]);

    // result.changes diz quantas linhas foram afetadas. Se for 0, o livro não existia.
    if (result.changes === 0) return res.status(404).json({ error: 'Livro não encontrado.' });

    res.status(204).send(); 
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};