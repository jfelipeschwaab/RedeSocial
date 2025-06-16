import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getGroupDetails, deleteMessage, joinGroup } from '../../api/groupApi';
import { useAuth } from '../../contexts/AuthContext';
import './GroupDetailPage.css';

const GroupDetailPage = () => {
    const { id: groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const ws = useRef(null); // Ref para manter a instância do WebSocket

    const { user, token } = useAuth();
    const currentUserId = user?.id;

    const [isMember, setIsMember] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // Efeito para gerenciar a conexão WebSocket
    useEffect(() => {
        // Conecta apenas se tivermos um token de autenticação
        if (!token) return;

        // URL do WebSocket com o token de autenticação como um parâmetro de busca
        const wsUrl = `ws://localhost:5000?token=${token}`;
        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            console.log('WebSocket Conectado');
            // Informa ao servidor em qual sala de grupo este cliente está
            ws.current.send(JSON.stringify({ type: 'join_group', groupId: parseInt(groupId) }));
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'new_group_message') {
                // Adiciona a nova mensagem recebida ao estado do chat em tempo real
                setGroup(prevGroup => {
                    // Prevenção para não adicionar a mesma mensagem duas vezes
                    if (prevGroup.mensagens.some(msg => msg.id === data.message.id)) {
                        return prevGroup;
                    }
                    return {
                        ...prevGroup,
                        mensagens: [...prevGroup.mensagens, data.message]
                    };
                });
            }
        };

        ws.current.onclose = () => {
            console.log('WebSocket Desconectado');
        };

        // Função de limpeza para fechar a conexão quando o componente for desmontado
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [groupId, token]); // Dependências: reconecta se o ID do grupo ou o token mudarem

    // Função para buscar os detalhes iniciais do grupo
    const fetchGroupDetails = useCallback(async () => {
        if (!currentUserId) return;
        try {
            const data = await getGroupDetails(parseInt(groupId, 10));
            setGroup(data);
            if (data) {
                const memberCheck = data.membros.some(m => m.id === currentUserId);
                setIsMember(memberCheck);
                if (memberCheck) {
                    const adminCheck = data.membros.some(m => m.id === currentUserId && m.funcao === 'admin');
                    setIsAdmin(adminCheck);
                }
            }
        } catch (error) {
            console.error("Falha ao buscar detalhes do grupo", error);
        } finally {
            setLoading(false);
        }
    }, [groupId, currentUserId]);

    useEffect(() => {
        fetchGroupDetails();
    }, [fetchGroupDetails]);

    // Efeito para rolar o chat para a última mensagem
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [group?.mensagens]);

    // Função para entrar no grupo
    const handleJoinGroup = async () => {
        try {
            await joinGroup(group.id);
            // UI Otimista para uma experiência instantânea
            const newMember = { ...user, funcao: 'membro' };
            setGroup(prevGroup => ({ ...prevGroup, membros: [...prevGroup.membros, newMember] }));
            setIsMember(true);
        } catch (error) {
            if (error.response?.status === 409) {
                alert('Você já é membro deste grupo! Atualizando a tela...');
                fetchGroupDetails();
            } else {
                alert('Não foi possível entrar no grupo.');
            }
        }
    };

    // Função para deletar uma mensagem
    const handleDeleteMessage = async (messageId) => {
        if (window.confirm('Tem certeza que deseja deletar esta mensagem?')) {
            try {
                await deleteMessage(messageId);
                setGroup(prevGroup => ({
                    ...prevGroup,
                    mensagens: prevGroup.mensagens.filter(m => m.id !== messageId)
                }));
            } catch (error) {
                alert('Falha ao deletar a mensagem.');
            }
        }
    };
    
    // Função para enviar mensagens via WebSocket
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;

        const messagePayload = {
            type: 'group_message',
            conteudo: newMessage,
            groupId: parseInt(groupId),
        };
        ws.current.send(JSON.stringify(messagePayload));
        setNewMessage('');
    };

    if (loading) return <div className="loading-message">Carregando grupo...</div>;
    if (!group) return <div className="loading-message">Grupo não encontrado.</div>;

    // Renderização completa do componente
    return (
        <div className="group-detail-container">
            <header className="group-detail-header">
                <h2>{group.nome}</h2>
                <p>{group.descricao}</p>
                <div className="members-list">
                    <strong>Membros: </strong>
                    {group.membros.map((m, index) => (
                        <span key={m.id} className={m.funcao === 'admin' ? 'admin-member' : ''}>
                          {m.nome_de_usuario}{index < group.membros.length - 1 ? ', ' : ''}
                        </span>
                    ))}
                </div>
            </header>
            
            <main className="chat-box">
                {group.mensagens.map(msg => (
                    <div key={msg.id} className={`chat-message ${msg.usuario_id === currentUserId ? 'sent' : 'received'}`}>
                        <img src={msg.foto_de_perfil} alt={msg.nome_de_usuario} className="chat-profile-pic"/>
                        <div className="message-content">
                            <strong>{msg.nome_de_usuario}</strong>
                            <p>{msg.conteudo}</p>
                            <span>{new Date(msg.data_criacao).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        {isAdmin && (
                            <button onClick={() => handleDeleteMessage(msg.id)} className="delete-message-btn" title="Deletar mensagem">&times;</button>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </main>
            
            {isMember ? (
                <footer className="chat-form-container">
                    <form onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            placeholder="Digite uma mensagem..."
                        />
                        <button type="submit">Enviar</button>
                    </form>
                </footer>
            ) : (
                <footer className="join-group-footer">
                    <button onClick={handleJoinGroup} className="join-group-btn">
                        Entrar no Grupo para Conversar
                    </button>
                </footer>
            )}
        </div>
    );
};

export default GroupDetailPage;
