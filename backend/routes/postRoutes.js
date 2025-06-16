const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

// === Rotas para Posts ===
// GET /api/posts - Rota pública para buscar todos os posts.
router.get('/', postController.getAllPosts);
// POST /api/posts - Rota privada para criar um novo post.
router.post('/', authMiddleware, postController.createPost);
// DELETE /api/posts/:id - Rota privada para deletar um post.
router.delete('/:id', authMiddleware, postController.deletePost);

// === Rotas para Comentários ===
// GET /api/posts/:postId/comments - Rota pública para buscar comentários de um post.
router.get('/:postId/comments', postController.getCommentsForPost);
// POST /api/posts/:postId/comments - Rota privada para adicionar um comentário a um post.
router.post('/:postId/comments', authMiddleware, postController.createComment);

// === Rota para Avaliações (Likes/Dislikes) ===
// POST /api/posts/rate - Rota privada para avaliar um post ou comentário.
// O corpo da requisição especificará se é um post_id ou comentario_id.
router.post('/rate', authMiddleware, postController.rateContent);


module.exports = router;