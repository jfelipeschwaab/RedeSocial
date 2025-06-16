
// Importa os serviços que contêm a lógica de negócio.
const postService = require('../services/postService');

// --- Controladores para Posts ---

const createPost = async (req, res) => {
  try {
    // O ID do usuário vem do token JWT decodificado pelo middleware de autenticação.
    // ATENÇÃO: Como não temos sistema de login, o req.user será undefined.
    // Vamos usar um ID fixo (1) apenas para teste.
    const usuario_id = req.user ? req.user.id : 1;
    const post = await postService.createPost(usuario_id, req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar post', error: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await postService.findAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar posts', error: error.message });
  }
};

const deletePost = async (req, res) => {
    try {
        const usuario_id = req.user ? req.user.id : 1; // Usando ID fixo para teste
        const post_id = req.params.id;
        await postService.deletePost(post_id, usuario_id);
        res.status(200).json({ message: 'Post deletado com sucesso.' });
    } catch (error) {
        // Diferencia entre erro de autorização, não encontrado e outros erros.
        if (error.message === 'Usuário não autorizado a deletar este post.') {
            return res.status(403).json({ message: error.message });
        }
        if (error.message === 'Post não encontrado.') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Erro ao deletar post', error: error.message });
    }
};

// --- Controladores para Comentários ---

const createComment = async (req, res) => {
  try {
    const usuario_id = req.user ? req.user.id : 2; // Usando ID fixo para teste
    const { postId } = req.params;
    const comment = await postService.createComment(usuario_id, postId, req.body);
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar comentário', error: error.message });
  }
};

const getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await postService.findCommentsByPostId(postId);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar comentários', error: error.message });
  }
};

// --- Controlador para Avaliações ---

const rateContent = async (req, res) => {
    try {
        const usuario_id = req.user ? req.user.id : 3; // Usando ID fixo para teste
        await postService.rateContent(usuario_id, req.body);
        res.status(201).json({ message: 'Avaliação registrada com sucesso' });
    } catch (error) {
        res.status(400).json({ message: 'Erro ao registrar avaliação', error: error.message });
    }
};

// Exporta todas as funções do controlador em um único objeto.
module.exports = {
    createPost,
    getAllPosts,
    deletePost,
    createComment,
    getCommentsForPost,
    rateContent,
};