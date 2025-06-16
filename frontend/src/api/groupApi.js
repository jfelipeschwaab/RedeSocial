import api from './api'; // Importa a instância do Axios configurada

/**
 * Busca todos os grupos da aplicação.
 */
export const getAllGroups = async () => {
    try {
        const response = await api.get('/groups');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar grupos:", error);
        return [];
    }
};

/**
 * Busca os detalhes de um grupo específico.
 */
export const getGroupDetails = async (groupId) => {
    try {
        const response = await api.get(`/groups/${groupId}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar detalhes do grupo:", error);
        return null;
    }
};

/**
 * Adiciona uma nova mensagem a um grupo.
 */
/**
 * Deleta uma mensagem de um grupo.
 */
export const deleteMessage = async (messageId) => {
    try {
        await api.delete(`/groups/messages/${messageId}`);
    } catch (error) {
        console.error("Erro ao deletar mensagem:", error);
        throw error;
    }
};

/**
 * Cria um novo grupo no backend.
 */
export const createGroup = async (groupData) => {
    try {
        const response = await api.post('/groups', groupData);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar grupo:", error);
        throw error;
    }
};

/**
 * Envia uma requisição para o usuário entrar em um grupo.
 * @param {number} groupId - O ID do grupo.
 */
export const joinGroup = async (groupId) => {
    try {
        const response = await api.post(`/groups/${groupId}/join`);
        return response.data;
    } catch (error) {
        console.error("Erro ao entrar no grupo:", error);
        throw error;
    }
};