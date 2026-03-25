const { openDb } = require("../config/db");

const getAllBooks = async (req, res) => {
  try {
    const db = await openDb();
    const books = await db.all("SELECT * FROM books");
    res.status(200).json(books);
  } catch (error) {
    console.error("Erro ao buscar livros:", error);
    res
      .status(500)
      .json({ error: "Erro interno do servidor ao buscar os livros." });
  }
};

const getBookById = async (req, res) => {
  try {
    const db = await openDb();
    const book = await db.get("SELECT * FROM books WHERE id = ?", [
      req.params.id,
    ]);

    if (!book) return res.status(404).json({ error: "Livro não encontrado." });

    res.status(200).json(book);
  } catch (error) {
    console.error("Erro ao buscar livro por ID:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

const createBook = async (req, res) => {
  try {
    const { title, author, year } = req.body;

    if (!title || typeof title !== "string") {
      return res
        .status(400)
        .json({ error: 'O campo "title" é obrigatório e deve ser um texto.' });
    }
    if (!author || typeof author !== "string") {
      return res
        .status(400)
        .json({ error: 'O campo "author" é obrigatório e deve ser um texto.' });
    }
    if (year && typeof year !== "number") {
      return res
        .status(400)
        .json({ error: 'O campo "year" deve ser um número válido.' });
    }

    const db = await openDb();
    const result = await db.run(
      "INSERT INTO books (title, author, year) VALUES (?, ?, ?)",
      [title, author, year || null],
    );

    res.status(201).json({ id: result.lastID, title, author, year });
  } catch (error) {
    console.error("Erro ao criar livro:", error);
    res
      .status(500)
      .json({ error: "Erro interno do servidor ao salvar o livro." });
  }
};

const updateBook = async (req, res) => {
  try {
    const { title, author, year } = req.body;
    const db = await openDb();

    const book = await db.get("SELECT * FROM books WHERE id = ?", [
      req.params.id,
    ]);
    if (!book) return res.status(404).json({ error: "Livro não encontrado." });

    await db.run(
      "UPDATE books SET title = ?, author = ?, year = ? WHERE id = ?",
      [
        title || book.title,
        author || book.author,
        year || book.year,
        req.params.id,
      ],
    );

    res.status(200).json({ message: "Livro atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar livro:", error);
    res
      .status(500)
      .json({ error: "Erro interno do servidor ao atualizar o livro." });
  }
};

const deleteBook = async (req, res) => {
  try {
    const db = await openDb();
    const result = await db.run("DELETE FROM books WHERE id = ?", [
      req.params.id,
    ]);

    if (result.changes === 0)
      return res.status(404).json({ error: "Livro não encontrado." });

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar livro:", error);
    res
      .status(500)
      .json({ error: "Erro interno do servidor ao deletar o livro." });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
