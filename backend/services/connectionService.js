const db = require('../config/database');

/**
 * Cria uma nova solicitação de conexão.
 */
const requestConnection = async (solicitanteId, receptorId) => {
    if (solicitanteId === receptorId) {
        throw new Error("Você não pode se conectar consigo mesmo.");
    }
    
    // Verifica se já existe uma conexão ou solicitação (em qualquer direção)
    const sqlCheck = 'SELECT * FROM conexao WHERE (solicitante_id = ? AND receptor_id = ?) OR (solicitante_id = ? AND receptor_id = ?)';
    const [existing] = await db.query(sqlCheck, [solicitanteId, receptorId, receptorId, solicitanteId]);

    if (existing.length > 0) {
        throw new Error("Uma conexão ou solicitação já existe com este usuário.");
    }

    const sqlInsert = 'INSERT INTO conexao (solicitante_id, receptor_id, status, data_solicitacao) VALUES (?, ?, ?, NOW())';
    await db.query(sqlInsert, [solicitanteId, receptorId, 'pendente']);
    
    return { message: "Solicitação enviada com sucesso." };
};

/**
 * Aceita uma solicitação de conexão.
 */
const acceptConnection = async (solicitanteId, receptorId) => {
    // A solicitação só pode ser aceita pelo receptor.
    const sqlUpdate = "UPDATE conexao SET status = 'aceito', data_resposta = NOW() WHERE solicitante_id = ? AND receptor_id = ? AND status = 'pendente'";
    const [result] = await db.query(sqlUpdate, [solicitanteId, receptorId]);
    
    if (result.affectedRows === 0) {
        throw new Error("Solicitação de conexão não encontrada ou já respondida.");
    }

    return { message: "Conexão aceita com sucesso." };
};

/**
 * Obtém todas as solicitações pendentes para um usuário.
 */
const getPendingRequests = async (userId) => {
    const sql = `
        SELECT 
            u.id AS solicitante_id,
            u.nome_de_usuario,
            u.foto_de_perfil
        FROM conexao c
        JOIN usuario u ON c.solicitante_id = u.id
        WHERE c.receptor_id = ? AND c.status = 'pendente'
    `;
    const [requests] = await db.query(sql, [userId]);
    return requests;
};

module.exports = {
    requestConnection,
    acceptConnection,
    getPendingRequests,
};