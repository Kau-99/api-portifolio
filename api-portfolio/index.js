const express = require('express');
const cors = require('cors');
require('./config/db'); 
const bookRoutes = require('./routes/bookRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/books', bookRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📚 Arquitetura MVC e Banco de Dados SQL ativos!`);
});