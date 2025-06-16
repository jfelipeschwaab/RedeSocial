const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

/**
 * Registra um novo usuário no banco de dados.
 * @param {object} userData - Dados do novo usuário.
 * @returns {object} O usuário criado (sem a senha).
 */
const registerUser = async (userData) => {
    const { nome_de_usuario, email, senha, data_nascimento, foto_de_perfil } = userData;

    // Verifica se o email ou nome de usuário já existem no banco
    let sqlCheck = 'SELECT id FROM usuario WHERE email = ? OR nome_de_usuario = ?';
    const [existingUsers] = await db.query(sqlCheck, [email, nome_de_usuario]);
    if (existingUsers.length > 0) {
        throw new Error('O e-mail ou nome de usuário fornecido já está em uso.');
    }

    // Cria o hash da senha
    const senha_hash = await bcrypt.hash(senha, 10);
    const default_photo = `https://placehold.co/100x100/CCCCCC/FFFFFF?text=${nome_de_usuario.charAt(0).toUpperCase()}`;

    // Insere o novo usuário no banco de dados
    const sqlInsert = `
        INSERT INTO usuario (nome_de_usuario, email, senha_hash, data_nascimento, foto_de_perfil) 
        VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sqlInsert, [nome_de_usuario, email, senha_hash, data_nascimento, foto_de_perfil || default_photo]);

    // Retorna os dados do usuário recém-criado (sem a senha)
    const insertedId = result.insertId;
    const sqlSelect = 'SELECT id, nome_de_usuario, email, data_nascimento, foto_de_perfil FROM usuario WHERE id = ?';
    const [newUser] = await db.query(sqlSelect, [insertedId]);

    return newUser[0];
};

/**
 * Autentica um usuário e retorna um token JWT.
 * @param {string} email - O email do usuário.
 * @param {string} senha - A senha do usuário.
 * @returns {object} Contendo o token e os dados do usuário.
 */
const loginUser = async (email, senha) => {
    // Busca o usuário pelo email, incluindo o hash da senha para comparação
    const sql = 'SELECT id, nome_de_usuario, email, foto_de_perfil, senha_hash FROM usuario WHERE email = ?';
    const [users] = await db.query(sql, [email]);
    
    const user = users[0];
    if (!user) {
        throw new Error('Credenciais inválidas.'); // Erro genérico por segurança
    }

    // Compara a senha fornecida com o hash armazenado no banco
    const isMatch = await bcrypt.compare(senha, user.senha_hash);
    if (!isMatch) {
        throw new Error('Credenciais inválidas.');
    }

    // Gera o token JWT
    const payload = { id: user.id, nome_de_usuario: user.nome_de_usuario };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Remove o hash da senha do objeto de usuário antes de retorná-lo
    const { senha_hash, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
};

module.exports = {
    registerUser,
    loginUser,
};