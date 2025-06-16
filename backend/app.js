const express = require('express');
const cors = require('cors');
const http = require('http'); // Importar o módulo HTTP
require('dotenv').config();

const setupWebSocket = require('./websocket'); // Importar nossa lógica de WebSocket

// Rotas
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const groupRoutes = require('./routes/groupRoutes');
const userRoutes = require('./routes/userRoutes');
const connectionRoutes = require('./routes/connectionRoutes');

const app = express();
const server = http.createServer(app); // Criar um servidor HTTP a partir do app Express

// Configurar o WebSocket e passá-lo para o servidor HTTP
setupWebSocket(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uso das Rotas
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/users', userRoutes);
app.use('/api/connections', connectionRoutes);

const PORT = process.env.PORT || 5000;
// Iniciar o servidor HTTP, não o app Express diretamente
server.listen(PORT, () => console.log(`Servidor HTTP e WebSocket rodando na porta ${PORT}`));