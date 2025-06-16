const db = require('../config/database');

// --- Lógica de Negócio para Posts ---

exports.createPost = async (usuario_id, { tipo_conteudo, conteudo }) => {
    const sql = 'INSERT INTO post (usuario_id, tipo_conteudo, conteudo, data_criacao) VALUES (?, ?, ?, NOW())';
    const [result] = await db.query(sql, [usuario_id, tipo_conteudo, conteudo]);
    const [newPost] = await db.query('SELECT * FROM post WHERE id = ?', [result.insertId]);
    return newPost[0];
};

exports.findAllPosts = async () => {
    const sql = `
        SELECT 
            p.id, p.usuario_id, p.tipo_conteudo, p.conteudo, p.data_criacao,
            u.nome_de_usuario, u.foto_de_perfil,
            (SELECT COUNT(*) FROM avaliacao WHERE post_id = p.id AND tipo_avaliacao = 'positiva') AS likes,
            (SELECT COUNT(*) FROM avaliacao WHERE post_id = p.id AND tipo_avaliacao = 'negativa') AS dislikes
        FROM post p
        JOIN usuario u ON p.usuario_id = u.id
        ORDER BY p.data_criacao DESC
    `;
    const [posts] = await db.query(sql);
    return posts;
};

exports.deletePost = async (id, usuario_id) => {
    const postIdNumber = parseInt(id, 10);
    const [postResult] = await db.query('SELECT usuario_id FROM post WHERE id = ?', [postIdNumber]);

    if (postResult.length === 0) {
        throw new Error('Post não encontrado.');
    }

    if (postResult[0].usuario_id !== usuario_id) {
        throw new Error('Usuário não autorizado a deletar este post.');
    }

    await db.query('DELETE FROM post WHERE id = ?', [postIdNumber]);
};

// --- Lógica de Negócio para Comentários ---

exports.createComment = async (usuario_id, post_id, { conteudo, comentario_pai_id = null }) => {
    const postIdNumber = parseInt(post_id, 10);
    const sql = 'INSERT INTO comentario (usuario_id, post_id, conteudo, comentario_pai_id, data_criacao) VALUES (?, ?, ?, ?, NOW())';
    const [result] = await db.query(sql, [usuario_id, postIdNumber, conteudo, comentario_pai_id]);
    const [newComment] = await db.query('SELECT * FROM comentario WHERE id = ?', [result.insertId]);
    return newComment[0];
};

exports.findCommentsByPostId = async (post_id) => {
    const postIdNumber = parseInt(post_id, 10);
    const sql = `
        SELECT 
            c.id, c.usuario_id, c.post_id, c.conteudo, c.comentario_pai_id, c.data_criacao,
            u.nome_de_usuario, u.foto_de_perfil,
            (SELECT COUNT(*) FROM avaliacao WHERE comentario_id = c.id AND tipo_avaliacao = 'positiva') AS likes,
            (SELECT COUNT(*) FROM avaliacao WHERE comentario_id = c.id AND tipo_avaliacao = 'negativa') AS dislikes
        FROM comentario c
        JOIN usuario u ON c.usuario_id = u.id
        WHERE c.post_id = ?
        ORDER BY c.data_criacao ASC
    `;
    const [comments] = await db.query(sql, [postIdNumber]);

    // Estrutura os comentários em uma árvore de respostas.
    const commentMap = {};
    const rootComments = [];
    comments.forEach(comment => {
        comment.respostas = [];
        commentMap[comment.id] = comment;
        if (comment.comentario_pai_id && commentMap[comment.comentario_pai_id]) {
            commentMap[comment.comentario_pai_id].respostas.push(comment);
        } else {
            rootComments.push(comment);
        }
    });
    return rootComments;
};

// --- Lógica de Negócio para Avaliações ---

exports.rateContent = async (usuario_id, { post_id, comentario_id, tipo_avaliacao }) => {
    if ((!post_id && !comentario_id) || (post_id && comentario_id)) {
        throw new Error('Você deve avaliar um post ou um comentário, não ambos.');
    }

    const targetColumn = post_id ? 'post_id' : 'comentario_id';
    const targetId = post_id || comentario_id;

    const sql = `
        INSERT INTO avaliacao (usuario_id, ${targetColumn}, tipo_avaliacao)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE tipo_avaliacao = ?
    `;
    await db.query(sql, [usuario_id, targetId, tipo_avaliacao, tipo_avaliacao]);

    return { message: 'Avaliação registrada com sucesso.' };
};