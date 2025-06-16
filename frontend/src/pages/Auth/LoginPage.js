import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as apiLogin } from '../../api/authApi';
import { useAuth } from '../../contexts/AuthContext';
import './AuthPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { token, user } = await apiLogin({ email, senha });
            login(user, token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao fazer login.');
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Entrar</h2>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Senha" required />
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Entrar</button>
                <p className="switch-auth">Não tem uma conta? <Link to="/register">Cadastre-se</Link></p>
            </form>
        </div>
    );
};

export default LoginPage;
