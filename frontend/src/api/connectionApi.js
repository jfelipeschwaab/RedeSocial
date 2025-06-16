import api from './api';

export const requestConnection = async (userId) => {
    const response = await api.post(`/connections/request/${userId}`);
    return response.data;
};

export const acceptConnection = async (userId) => {
    const response = await api.post(`/connections/accept/${userId}`);
    return response.data;
};

export const getNotifications = async () => {
    const response = await api.get('/connections/notifications');
    return response.data;
};