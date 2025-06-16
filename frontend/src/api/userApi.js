import api from './api'; // Importa a instância do Axios configurada

/**
 * Busca todos os usuários da aplicação.
 */
export const getAllUsers = async () => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        return [];
    }
};

export const getUserProfile = async (username) => {
    const response = await api.get(`/users/profile/${username}`);
    return response.data;
};