const db = require('../config/database');

/**
 * Busca todos os grupos com a contagem de membros.
 */
const findAllGroups = async () => {
    const sql = `
        SELECT g.*, (SELECT COUNT(*) FROM membro_grupo WHERE grupo_id = g.id) AS total_membros
        FROM grupo g
        ORDER BY g.nome ASC
    `;
    const [groups] = await db.query(sql);
    return groups;
};

/**
 * Busca os detalhes de um grupo específico, incluindo membros e mensagens.
 * @param {number} groupId - O ID do grupo.
 */
const findGroupById = async (groupId) => {
    // Busca detalhes do grupo
    const [groupResult] = await db.query('SELECT * FROM grupo WHERE id = ?', [groupId]);
    const grupo = groupResult[0];
    if (!grupo) {
        throw new Error('Grupo não encontrado.');
    }

    // Busca membros do grupo
    const sqlMembros = `
        SELECT u.id, u.nome_de_usuario, u.foto_de_perfil, mg.funcao
        FROM membro_grupo mg
        JOIN usuario u ON mg.usuario_id = u.id
        WHERE mg.grupo_id = ?
    `;
    const [membros] = await db.query(sqlMembros, [groupId]);

    // Busca mensagens do grupo
    const sqlMensagens = `
        SELECT msg.*, u.nome_de_usuario, u.foto_de_perfil
        FROM mensagem_grupo msg
        JOIN usuario u ON msg.usuario_id = u.id
        WHERE msg.grupo_id = ?
        ORDER BY msg.data_criacao ASC
    `;
    const [mensagens] = await db.query(sqlMensagens, [groupId]);

    return { ...grupo, membros, mensagens };
};

/**
 * Adiciona uma nova mensagem a um grupo.
 * @param {number} groupId - O ID do grupo.
 * @param {number} usuario_id - O ID do usuário que envia a mensagem.
 * @param {string} conteudo - O conteúdo da mensagem.
 */
const addMessageToGroup = async (groupId, usuario_id, conteudo) => {
    const sqlInsert = 'INSERT INTO mensagem_grupo (grupo_id, usuario_id, conteudo, data_criacao) VALUES (?, ?, ?, NOW())';
    const [result] = await db.query(sqlInsert, [groupId, usuario_id, conteudo]);
    const messageId = result.insertId;

    // Retorna a mensagem completa com dados do usuário
    const sqlSelect = `
        SELECT msg.*, u.nome_de_usuario, u.foto_de_perfil
        FROM mensagem_grupo msg
        JOIN usuario u ON msg.usuario_id = u.id
        WHERE msg.id = ?
    `;
    const [newMessage] = await db.query(sqlSelect, [messageId]);
    return newMessage[0];
};

/**
 * Deleta uma mensagem de um grupo, verificando a permissão do usuário.
 * @param {number} messageId - O ID da mensagem a ser deletada.
 * @param {number} requestingUserId - O ID do usuário que está tentando deletar.
 */
const deleteMessageFromGroup = async (messageId, requestingUserId) => {
    const [messageResult] = await db.query('SELECT grupo_id FROM mensagem_grupo WHERE id = ?', [messageId]);
    if (messageResult.length === 0) {
        throw new Error('Mensagem não encontrada.');
    }
    const groupId = messageResult[0].grupo_id;
    
    const [membershipResult] = await db.query('SELECT funcao FROM membro_grupo WHERE grupo_id = ? AND usuario_id = ?', [groupId, requestingUserId]);
    if (membershipResult.length === 0 || membershipResult[0].funcao !== 'admin') {
        throw new Error('Usuário não autorizado a deletar esta mensagem.');
    }

    await db.query('DELETE FROM mensagem_grupo WHERE id = ?', [messageId]);
};

/**
 * Cria um novo grupo.
 * @param {object} groupData - Dados do grupo (nome, descricao).
 * @param {number[]} memberIds - Array de IDs dos usuários a serem adicionados como membros.
 * @param {number} creatorId - O ID do usuário que está criando o grupo.
 */
const createGroup = async (groupData, memberIds, creatorId) => {
    const { nome, descricao } = groupData;
    
    const [existing] = await db.query('SELECT id FROM grupo WHERE nome = ?', [nome]);
    if (existing.length > 0) {
        throw new Error('Já existe um grupo com este nome.');
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Cria o grupo
        const sqlCreateGroup = 'INSERT INTO grupo (nome, descricao, criador_id, data_criacao) VALUES (?, ?, ?, NOW())';
        const [groupResult] = await connection.query(sqlCreateGroup, [nome, descricao, creatorId]);
        const groupId = groupResult.insertId;

        // Adiciona o criador como admin
        const sqlAddCreator = 'INSERT INTO membro_grupo (grupo_id, usuario_id, funcao) VALUES (?, ?, ?)';
        await connection.query(sqlAddCreator, [groupId, creatorId, 'admin']);

        // Adiciona outros membros
        if (memberIds && memberIds.length > 0) {
            const values = memberIds
                .filter(id => id !== creatorId)
                .map(userId => [groupId, userId, 'membro']);
            
            if(values.length > 0) {
                const sqlAddMembers = 'INSERT INTO membro_grupo (grupo_id, usuario_id, funcao) VALUES ?';
                await connection.query(sqlAddMembers, [values]);
            }
        }
        
        await connection.commit();
        
        const [newGroup] = await connection.query('SELECT * FROM grupo WHERE id = ?', [groupId]);
        return newGroup[0];

    } catch (error) {
        await connection.rollback();
        throw new Error(`Erro ao criar grupo: ${error.message}`);
    } finally {
        connection.release();
    }
};

/**
 * Adiciona um usuário a um grupo como membro.
 * @param {number} groupId - O ID do grupo.
 * @param {number} userId - O ID do usuário que vai entrar no grupo.
 */
const joinGroup = async (groupId, userId) => {
    const [groupExists] = await db.query('SELECT id FROM grupo WHERE id = ?', [groupId]);
    if (groupExists.length === 0) {
        throw new Error('Grupo não encontrado.');
    }

    try {
        const sql = 'INSERT INTO membro_grupo (grupo_id, usuario_id, funcao) VALUES (?, ?, ?)';
        await db.query(sql, [groupId, userId, 'membro']);
        return { message: 'Você entrou no grupo com sucesso!' };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('Usuário já é membro deste grupo.');
        }
        throw error;
    }
};

module.exports = {
    findAllGroups,
    findGroupById,
    addMessageToGroup,
    deleteMessageFromGroup,
    createGroup,
    joinGroup,
};