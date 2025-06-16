import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../api/userApi';
import { Link } from 'react-router-dom';
import './UsersListPage.css';

const UsersListPage = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getAllUsers();
            setUsers(data);
        };
        fetchUsers();
    }, []);

    return (
        <div className="users-list-container">
            <h1>Usuários da Rede</h1>
            <div className="users-list">
                {users.map(user => (
                    <Link to={`/profile/${user.nome_de_usuario}`} key={user.id} className="user-card">
                        <img src={user.foto_de_perfil} alt={user.nome_de_usuario} />
                        <span>{user.nome_de_usuario}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default UsersListPage;
