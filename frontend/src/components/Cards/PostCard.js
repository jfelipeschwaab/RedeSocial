import React, { useState } from 'react';
import { ratePost, getCommentsForPost, addComment } from '../../api/postApi';
import Comment from '../Comment/Comment';
import './PostCard.css';

const PostCard = ({ post, onPostUpdate }) => {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");

  const postDate = new Date(post.data_criacao).toLocaleString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const handleLike = async () => {
    await ratePost(post.id, 'positiva');
    // Simula a atualização do estado local para feedback instantâneo
    onPostUpdate({ ...post, likes: post.likes + 1 });
  };

  const handleDislike = async () => {
    await ratePost(post.id, 'negativa');
    onPostUpdate({ ...post, dislikes: post.dislikes + 1 });
  };

  const toggleComments = async () => {
    // Se for mostrar os comentários e eles ainda não foram carregados
    if (!showComments && comments.length === 0) {
      setCommentsLoading(true);
      const fetchedComments = await getCommentsForPost(post.id);
      setComments(fetchedComments);
      setCommentsLoading(false);
    }
    setShowComments(!showComments);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    await addComment(post.id, newComment);
    setNewComment("");
    // Recarrega os comentários para incluir o novo
    setCommentsLoading(true);
    const fetchedComments = await getCommentsForPost(post.id);
    setComments(fetchedComments);
    setCommentsLoading(false);
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img src={post.foto_de_perfil} alt={post.nome_de_usuario} className="profile-pic" />
        <div className="post-author">
          <strong>{post.nome_de_usuario}</strong>
          <span className="post-date">{postDate}</span>
        </div>
      </div>
      <div className="post-content">
        <p>{post.conteudo}</p>
        {post.tipo_conteudo === 'imagem' && <img src={post.conteudo} alt="Conteúdo" className="content-image" />}
        {post.tipo_conteudo === 'video' && <div className="video-placeholder"><p>Um vídeo estaria aqui: <a href={post.conteudo} target="_blank" rel="noopener noreferrer">{post.conteudo}</a></p></div>}
      </div>
      <div className="post-footer">
        <button onClick={handleLike} className="footer-button like-button">👍 {post.likes}</button>
        <button onClick={handleDislike} className="footer-button dislike-button">👎 {post.dislikes}</button>
        <button onClick={toggleComments} className="footer-button">💬 Comentar</button>
      </div>
      {showComments && (
        <div className="comment-section">
          {commentsLoading ? (
            <p className="loading-text">Carregando comentários...</p>
          ) : (
            comments.map(comment => <Comment key={comment.id} comment={comment} />)
          )}
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Adicione um comentário..."
              className="comment-input"
            />
            <button type="submit" className="comment-submit-btn">Publicar</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;
