import React, { useState, useEffect, useCallback } from 'react';
import { getAllPosts } from '../../api/postApi';
import { useAuth } from '../../contexts/AuthContext'; // Importar o hook de autenticação
import CreatePost from '../../components/CreatePost/CreatePost';
import PostCard from '../../components/Cards/PostCard';
import './HomePage.css';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Pega o usuário logado do contexto

  const fetchPosts = useCallback(async () => {
    const fetchedPosts = await getAllPosts();
    setPosts(fetchedPosts);
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchPosts();
  }, [fetchPosts]);

  /**
   * Adiciona o novo post no topo da lista com os dados do usuário logado.
   * @param {object} newPostFromApi - O objeto do post retornado pela API.
   */
  const handlePostCreated = (newPostFromApi) => {
    if (!user) return; // Proteção caso o usuário não esteja definido

    // Enriquece o post com os dados do usuário ATUAL, não mais 'ana_dev'
    const enrichedPost = {
      ...newPostFromApi,
      nome_de_usuario: user.nome_de_usuario,
      foto_de_perfil: user.foto_de_perfil,
      likes: 0,
      dislikes: 0,
    };

    setPosts(currentPosts => [enrichedPost, ...currentPosts]);
  };

  /**
   * Atualiza o estado de um post específico na lista (ex: contagem de likes).
   * @param {object} updatedPost - O objeto do post com os dados atualizados.
   */
  const handlePostUpdate = (updatedPost) => {
    setPosts(currentPosts =>
      currentPosts.map(p => (p.id === updatedPost.id ? updatedPost : p))
    );
  };

  if (loading) {
    return <div className="loading-message">Carregando...</div>;
  }

  return (
    <div className="homepage-container">
      <main className="feed">
        <CreatePost onPostCreated={handlePostCreated} />
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onPostUpdate={handlePostUpdate}
            />
          ))
        ) : (
          <div className="no-posts-message">Ainda não há posts para exibir. Seja o primeiro!</div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
