const groupService = require('../services/groupService');

const getAllGroups = async (req, res) => {
    try {
        const groups = await groupService.findAllGroups();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar grupos', error: error.message });
    }
};

const getGroupDetails = async (req, res) => {
    try {
        const groupId = parseInt(req.params.id, 10);
        const groupDetails = await groupService.findGroupById(groupId);
        res.status(200).json(groupDetails);
    } catch (error) {
        if (error.message === 'Grupo não encontrado.') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Erro ao buscar detalhes do grupo', error: error.message });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const messageId = parseInt(req.params.messageId, 10);
        const usuario_id = req.user.id;

        await groupService.deleteMessageFromGroup(messageId, usuario_id);
        res.status(200).json({ message: 'Mensagem deletada com sucesso.' });
    } catch (error) {
        if (error.message.includes('não autorizado')) {
            return res.status(403).json({ message: error.message });
        }
        if (error.message.includes('não encontrada')) {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Erro ao deletar mensagem', error: error.message });
    }
};

const createGroup = async (req, res) => {
    try {
        const creatorId = req.user.id; // Vem do middleware simulado
        const { nome, descricao, membros } = req.body;

        if (!nome || !descricao || !membros) {
            return res.status(400).json({ message: 'Nome, descrição e lista de membros são obrigatórios.' });
        }

        const newGroup = await groupService.createGroup({ nome, descricao }, membros, creatorId);
        res.status(201).json(newGroup);
    } catch (error) {
        if (error.message.includes('Já existe um grupo')) {
            return res.status(409).json({ message: error.message }); // 409 Conflict
        }
        res.status(500).json({ message: 'Erro ao criar grupo', error: error.message });
    }
};
const joinGroup = async (req, res) => {
    try {
        const groupId = parseInt(req.params.id, 10);
        const userId = req.user.id; // ID do usuário logado

        await groupService.joinGroup(groupId, userId);
        res.status(200).json({ message: 'Você entrou no grupo com sucesso!' });
    } catch (error) {
        if (error.message.includes('já é membro')) {
            return res.status(409).json({ message: error.message }); // Conflict
        }
        if (error.message.includes('não encontrado')) {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Erro ao entrar no grupo', error: error.message });
    }
};


module.exports = {
    getAllGroups,
    getGroupDetails,
    createGroup,
    joinGroup,
    deleteMessage,
};
