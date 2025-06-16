const db = require('../config/database');

/**
 * Busca todos os usuários, retornando apenas informações públicas.
 */
const findAllUsers = async () => {
    const sql = 'SELECT id, nome_de_usuario, foto_de_perfil FROM usuario ORDER BY nome_de_usuario';
    const [users] = await db.query(sql);
    return users;
};

/**
 * Busca o perfil de um usuário específico pelo nome de usuário.
 * @param {string} username - O nome de usuário do perfil a ser visualizado.
 * @param {number} requestingUserId - O ID do usuário que está fazendo a requisição (logado).
 */
const findUserByUsername = async (username, requestingUserId) => {
    // Busca os dados do usuário do perfil
    const [userResult] = await db.query('SELECT id, nome_de_usuario, email, data_nascimento, foto_de_perfil FROM usuario WHERE nome_de_usuario = ?', [username]);
    const profileUser = userResult[0];
    if (!profileUser) {
        throw new Error("Usuário não encontrado.");
    }

    // Busca os posts do usuário
    const [userPosts] = await db.query('SELECT * FROM post WHERE usuario_id = ? ORDER BY data_criacao DESC', [profileUser.id]);

    // Determina o status da conexão
    let connectionStatus = 'nenhum';
    if (requestingUserId !== profileUser.id) {
        const sqlConnection = 'SELECT status, solicitante_id FROM conexao WHERE (solicitante_id = ? AND receptor_id = ?) OR (solicitante_id = ? AND receptor_id = ?)';
        const [connectionResult] = await db.query(sqlConnection, [requestingUserId, profileUser.id, profileUser.id, requestingUserId]);
        
        const connection = connectionResult[0];
        if (connection) {
            if (connection.status === 'aceito') {
                connectionStatus = 'conectado';
            } else if (connection.status === 'pendente') {
                connectionStatus = connection.solicitante_id === requestingUserId ? 'solicitacao_enviada' : 'solicitacao_recebida';
            }
        }
    } else {
        connectionStatus = 'self'; // O usuário está vendo o próprio perfil
    }
    
    return { ...profileUser, posts: userPosts, connectionStatus };
};

module.exports = {
    findAllUsers,
    findUserByUsername,
};