const userService = require('../services/userService');

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.findAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
    }
};


const getUserProfile = async (req, res) => {
    try {
        const requestingUserId = req.user.id;
        const { username } = req.params;
        const profile = await userService.findUserByUsername(username, requestingUserId);
        res.status(200).json(profile);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUserProfile,
}