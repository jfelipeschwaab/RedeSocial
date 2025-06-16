import React from 'react';
import './Comment.css';

const Comment = ({ comment }) => {
  const commentDate = new Date(comment.data_criacao).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="comment-container">
      <img 
        src={comment.foto_de_perfil} 
        alt={comment.nome_de_usuario} 
        className="comment-profile-pic"
        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/CCCCCC/FFFFFF?text=User'; }}
      />
      <div className="comment-body">
        <p>
          <strong>{comment.nome_de_usuario}</strong>
          {' '}
          {comment.conteudo}
        </p>
        <div className="comment-footer">
          <span>{commentDate}</span>
        </div>
      </div>
    </div>
  );
};

export default Comment;
