import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
// Componentes
import Notifications from './components/Notifications/Notifications';
import PrivateRoute from './components/Routes/PrivateRoute';
// Páginas
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import GroupsListPage from './pages/Groups/GroupsListPage';
import CreateGroupPage from './pages/Groups/CreateGroupPage';
import GroupDetailPage from './pages/Groups/GroupDetailPage';
import ProfilePage from './pages/Profile/ProfilePage';
import UsersListPage from './pages/Users/UsersListPage';

import './App.css';

const MainNav = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="main-nav">
            <div className="nav-links">
                <Link to="/">Feed</Link>
                {user && <Link to="/users">Usuários</Link>}
                {user && <Link to="/groups">Grupos</Link>}
            </div>
            <div className="nav-user">
                {user ? (
                    <>
                        <Notifications />
                        <span>Olá, {user.nome_de_usuario}!</span>
                        <button onClick={handleLogout} className="logout-btn">Sair</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Entrar</Link>
                        <Link to="/register">Cadastrar</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

function App() {
  return (
    <Router>
      <div className="App">
        <MainNav />
        <div className="main-content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route path="/" element={<PrivateRoute />}>
                <Route index element={<HomePage />} />
                <Route path="users" element={<UsersListPage />} />
                <Route path="profile/:username" element={<ProfilePage />} />
                <Route path="groups" element={<GroupsListPage />} />
                <Route path="groups/create" element={<CreateGroupPage />} />
                <Route path="groups/:id" element={<GroupDetailPage />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;