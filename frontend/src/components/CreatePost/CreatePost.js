import React, { useState } from 'react';
import { createPost } from '../../api/postApi';
import './CreatePost.css';

/**
 * Componente com o formulário para criar um novo post.
 * @param {object} props - As propriedades do componente.
 * @param {Function} props.onPostCreated - Callback para ser executado após a criação de um post.
 */
const CreatePost = ({ onPostCreated }) => {
  const [conteudo, setConteudo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Lida com o envio do formulário de criação de post.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    if (!conteudo.trim() || isSubmitting) {
      return; // Não faz nada se o campo estiver vazio ou já enviando
    }

    setIsSubmitting(true);
    try {
      // Por enquanto, todos os posts serão do tipo 'texto'.
      const postData = {
        conteudo: conteudo,
        tipo_conteudo: 'texto', 
      };

      // Chama a função da API para criar o post no backend
      const newPost = await createPost(postData);
      
      setConteudo(''); // Limpa o campo de texto após o sucesso
      
      // Chama a função do componente pai (HomePage) para adicionar o post na tela
      onPostCreated(newPost); 
      
    } catch (error) {
      alert('Falha ao criar o post. Tente novamente.');
    } finally {
      // Garante que o estado de 'enviando' seja resetado, mesmo se der erro
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-card">
      <form onSubmit={handleSubmit} className="create-post-form">
        <textarea
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          placeholder="No que você está pensando?"
          className="create-post-textarea"
          rows="3"
        />
        <button 
          type="submit" 
          className="create-post-button"
          disabled={!conteudo.trim() || isSubmitting}
        >
          {isSubmitting ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
