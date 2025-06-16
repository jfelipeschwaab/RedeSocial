import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../api/authApi';
import './AuthPage.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        nome_de_usuario: '', email: '', senha: '', data_nascimento: '', foto_de_perfil: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(formData);
            alert('Cadastro realizado com sucesso! Faça o login para continuar.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao cadastrar.');
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Criar Conta</h2>
                <input name="nome_de_usuario" onChange={handleChange} placeholder="Nome de usuário" required />
                <input type="email" name="email" onChange={handleChange} placeholder="Email" required />
                <input type="password" name="senha" onChange={handleChange} placeholder="Senha" required />
                <input type="date" name="data_nascimento" onChange={handleChange} placeholder="Data de Nascimento" required />
                <input name="foto_de_perfil" onChange={handleChange} placeholder="URL da foto de perfil (opcional)" />
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Cadastrar</button>
                <p className="switch-auth">Já tem uma conta? <Link to="/login">Entre</Link></p>
            </form>
        </div>
    );
};

export default RegisterPage;
