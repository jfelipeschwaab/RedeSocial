const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json({ message: 'Usuário registrado com sucesso!', user });
    } catch (error) {
        // Envia um status 409 (Conflict) se o usuário já existir
        if (error.message.includes('já está em uso')) {
            return res.status(409).json({ message: error.message });
        }
        res.status(400).json({ message: 'Erro no registro', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        const { token, user } = await authService.loginUser(email, senha);
        res.status(200).json({ token, user });
    } catch (error) {
        // Envia um status 401 (Unauthorized) para credenciais inválidas
        if (error.message.includes('Credenciais inválidas')) {
            return res.status(401).json({ message: error.message });
        }
        res.status(400).json({ message: 'Erro no login', error: error.message });
    }
};

module.exports = {
    register,
    login,
};