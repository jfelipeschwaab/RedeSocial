import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../api/userApi';
import { createGroup } from '../../api/groupApi';
import { useAuth } from '../../contexts/AuthContext'; // Importar o hook
import './CreateGroupPage.css';

const CreateGroupPage = () => {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth(); // Pega o usuário logado do contexto
    const currentUserId = user?.id; // Usa o ID do usuário logado

    useEffect(() => {
        if (!currentUserId) return;

        const fetchUsers = async () => {
            const users = await getAllUsers();
            setAllUsers(users.filter(u => u.id !== currentUserId));
            setLoading(false);
        };
        fetchUsers();
    }, [currentUserId]);

    const handleMemberToggle = (userId) => {
        setSelectedMembers(prev => 
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!nome.trim() || !descricao.trim()) {
            setError('Nome e descrição são obrigatórios.');
            return;
        }

        try {
            const newGroup = await createGroup({ nome, descricao, membros: selectedMembers });
            alert('Grupo criado com sucesso!');
            navigate(`/groups/${newGroup.id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao criar o grupo.');
        }
    };

    if (loading) return <div className="loading-message">Carregando...</div>;

    return (
        <div className="create-group-container">
            <h1>Criar Novo Grupo</h1>
            <form onSubmit={handleSubmit} className="create-group-form">
                <div className="form-group">
                    <label htmlFor="nome">Nome do Grupo</label>
                    <input type="text" id="nome" value={nome} onChange={e => setNome(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="descricao">Descrição</label>
                    <textarea id="descricao" value={descricao} onChange={e => setDescricao(e.target.value)} />
                </div>
                
                <div className="form-group">
                    <label>Selecionar Membros</label>
                    <div className="members-selection-list">
                        {allUsers.map(user => (
                            <div key={user.id} className="member-item">
                                <input
                                    type="checkbox"
                                    id={`user-${user.id}`}
                                    checked={selectedMembers.includes(user.id)}
                                    onChange={() => handleMemberToggle(user.id)}
                                />
                                <label htmlFor={`user-${user.id}`}>
                                    <img src={user.foto_de_perfil} alt={user.nome_de_usuario}/>
                                    {user.nome_de_usuario}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {error && <p className="error-message">{error}</p>}
                
                <button type="submit" className="submit-btn">Criar Grupo</button>
            </form>
        </div>
    );
};

export default CreateGroupPage;
