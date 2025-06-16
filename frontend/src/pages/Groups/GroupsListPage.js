import React, { useState, useEffect } from 'react';
import { getAllGroups } from '../../api/groupApi';
import { Link } from 'react-router-dom';
import './GroupsListPage.css';

const GroupsListPage = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            const data = await getAllGroups();
            setGroups(data);
            setLoading(false);
        };
        fetchGroups();
    }, []);

    if (loading) {
        return <div className="loading-message">Carregando grupos...</div>;
    }

    return (
        <div className="groups-list-container">
            <div className="header-with-button">
                <h1>Grupos e Comunidades</h1>
                <Link to="/groups/create" className="create-group-btn">Criar Novo Grupo</Link>
            </div>
            <div className="groups-grid">
                {groups.map(group => (
                    <Link to={`/groups/${group.id}`} key={group.id} className="group-card-link">
                        <div className="group-card">
                            <h2>{group.nome}</h2>
                            <p>{group.descricao}</p>
                            <span>{group.total_membros} membro(s)</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default GroupsListPage;
