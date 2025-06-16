import React, { useState, useEffect } from 'react';
import { getNotifications, acceptConnection } from '../../api/connectionApi';
import './Notifications.css';

const Notifications = () => {
    const [requests, setRequests] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchNotifications = async () => {
                const data = await getNotifications();
                setRequests(data);
            };
            fetchNotifications();
        }
    }, [isOpen]);

    const handleAccept = async (userId) => {
        await acceptConnection(userId);
        setRequests(prev => prev.filter(req => req.solicitante_id !== userId));
    };

    return (
        <div className="notifications-container">
            <button onClick={() => setIsOpen(!isOpen)} className="notifications-bell">
                🔔
                {requests.length > 0 && <span className="notification-badge">{requests.length}</span>}
            </button>
            {isOpen && (
                <div className="notifications-dropdown">
                    {requests.length === 0 ? (
                        <div className="notification-item">Nenhuma nova solicitação.</div>
                    ) : (
                        requests.map(req => (
                            <div key={req.solicitante_id} className="notification-item">
                                <span><b>{req.nome_de_usuario}</b> quer se conectar.</span>
                                <button onClick={() => handleAccept(req.solicitante_id)} className="accept-btn">Aceitar</button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Notifications;
