const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const groupService = require('./services/groupService');

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    // Mapeia conexões de WebSocket para os IDs de usuário
    const clients = new Map();

    wss.on('connection', (ws, req) => {
        // Extrai e verifica o token da URL de conexão (ex: ws://localhost:5000?token=...)
        const token = new URLSearchParams(req.url.slice(1)).get('token');
        if (!token) {
            ws.close(1008, 'Token não fornecido');
            return;
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Associa o ID do usuário e o ID do grupo à conexão WebSocket
            ws.userId = decoded.id;
            clients.set(ws.userId, ws);
            
        } catch (ex) {
            ws.close(1008, 'Token inválido');
            return;
        }

        ws.on('message', async (message) => {
            const data = JSON.parse(message);

            switch (data.type) {
                // Quando um usuário entra em uma página de grupo, ele "entra" na sala
                case 'join_group':
                    ws.groupId = data.groupId;
                    break;
                
                // Quando uma nova mensagem é enviada
                case 'group_message':
                    try {
                        const { groupId, conteudo } = data;
                        // Salva a mensagem no nosso "banco" e obtém o objeto completo da mensagem
                        const newMessage = await groupService.addMessageToGroup(groupId, ws.userId, conteudo);

                        // Transmite a nova mensagem para todos os clientes que estão na mesma sala de grupo
                        wss.clients.forEach(client => {
                            if (client.readyState === WebSocket.OPEN && client.groupId === groupId) {
                                client.send(JSON.stringify({ type: 'new_group_message', message: newMessage }));
                            }
                        });
                    } catch (error) {
                        console.error('Erro ao processar mensagem de grupo:', error);
                    }
                    break;
            }
        });

        ws.on('close', () => {
            clients.delete(ws.userId);
        });
    });
}

module.exports = setupWebSocket;
