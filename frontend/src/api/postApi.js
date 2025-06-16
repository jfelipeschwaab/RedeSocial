import api from './api'; // Importa a instância do Axios configurada, NÃO o 'axios' puro.

/**
 * Busca todos os posts do backend.
 * Rota pública, não precisa de token, mas usamos 'api' por padrão.
 */
export const getAllPosts = async () => {
  try {
    const response = await api.get('/posts');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar os posts:", error);
    return [];
  }
};

/**
 * Cria um novo post.
 * Rota privada, o token será enviado automaticamente pelo interceptor.
 */
export const createPost = async (postData) => {
    try {
        const response = await api.post('/posts', postData);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar o post:", error);
        throw error;
    }
};

/**
 * Envia uma avaliação (like/dislike) para um post.
 */
export const ratePost = async (postId, tipo) => {
    try {
        await api.post('/posts/rate', {
            post_id: postId,
            tipo_avaliacao: tipo,
        });
    } catch (error) {
        console.error("Erro ao avaliar o post:", error);
        throw error;
    }
};

/**
 * Busca os comentários de um post específico.
 */
export const getCommentsForPost = async (postId) => {
    try {
        const response = await api.get(`/posts/${postId}/comments`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar comentários:", error);
        return [];
    }
};

/**
 * Adiciona um novo comentário a um post.
 */
export const addComment = async (postId, conteudo) => {
    try {
        const response = await api.post(`/posts/${postId}/comments`, { conteudo });
        return response.data;
    } catch (error) {
        console.error("Erro ao adicionar comentário:", error);
        throw error;
    }
};