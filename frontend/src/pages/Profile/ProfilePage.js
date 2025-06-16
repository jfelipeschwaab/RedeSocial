import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile } from '../../api/userApi';
import { requestConnection } from '../../api/connectionApi';
import PostCard from '../../components/Cards/PostCard'; // Reutilizamos o PostCard
import { useAuth } from '../../contexts/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
    const { username } = useParams();
    const { user: currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const data = await getUserProfile(username);
                setProfile(data);
            } catch (error) {
                console.error("Erro ao buscar perfil", error);
                setProfile(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [username]);

    const handleRequestConnection = async () => {
        try {
            await requestConnection(profile.id);
            setProfile(prev => ({ ...prev, connectionStatus: 'solicitacao_enviada' }));
        } catch (error) {
            alert(error.response?.data?.message || "Não foi possível enviar a solicitação.");
        }
    };

    const renderConnectionButton = () => {
        if (currentUser.id === profile.id) return null; // Não mostra botão no próprio perfil

        switch (profile.connectionStatus) {
            case 'conectado':
                return <button disabled className="profile-btn connected">Conectado</button>;
            case 'solicitacao_enviada':
                return <button disabled className="profile-btn pending">Solicitação Pendente</button>;
            case 'solicitacao_recebida':
                return <button disabled className="profile-btn">Responda nas Notificações</button>;
            default:
                return <button onClick={handleRequestConnection} className="profile-btn">Adicionar Conexão</button>;
        }
    };

    if (loading) return <div>Carregando perfil...</div>;
    if (!profile) return <div>Usuário não encontrado.</div>;

    return (
        <div className="profile-container">
            <header className="profile-header">
                <img src={profile.foto_de_perfil} alt={profile.nome_de_usuario} className="profile-avatar" />
                <div className="profile-info">
                    <h1>{profile.nome_de_usuario}</h1>
                    {renderConnectionButton()}
                </div>
            </header>
            <main className="profile-feed">
                <h2>Posts de {profile.nome_de_usuario}</h2>
                {profile.posts.length > 0 ? (
                    profile.posts.map(post => <PostCard key={post.id} post={post} />)
                ) : (
                    <p>Este usuário ainda não fez nenhuma postagem.</p>
                )}
            </main>
        </div>
    );
};

export default ProfilePage;
