const connectionService = require('../services/connectionService');

const sendRequest = async (req, res) => {
    try {
        const solicitanteId = req.user.id;
        const receptorId = parseInt(req.params.userId, 10);
        await connectionService.requestConnection(solicitanteId, receptorId);
        res.status(201).json({ message: "Solicitação de conexão enviada." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const acceptRequest = async (req, res) => {
    try {
        const receptorId = req.user.id;
        const solicitanteId = parseInt(req.params.userId, 10);
        await connectionService.acceptConnection(solicitanteId, receptorId);
        res.status(200).json({ message: "Conexão aceita." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const requests = await connectionService.getPendingRequests(userId);
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    sendRequest,
    acceptRequest,
    getNotifications,
};