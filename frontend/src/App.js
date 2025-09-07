import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import TelegramIntegration from './components/TelegramIntegration';
import { getTransactions, getSummary, getUserProfile } from './services/api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  // Verificar se há token salvo ao carregar o app
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [transactionsRes, summaryRes, profileRes] = await Promise.all([
        getTransactions(),
        getSummary(),
        getUserProfile()
      ]);
      
      setTransactions(transactionsRes.data);
      setSummary(summaryRes.data);
      setUser(profileRes.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (data) => {
    localStorage.setItem('token', data.token);
    setUser(data.user);
    fetchUserData();
  };

  const handleRegister = (data) => {
    localStorage.setItem('token', data.token);
    setUser(data.user);
    fetchUserData();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setTransactions([]);
    setSummary({ income: 0, expense: 0, balance: 0 });
  };

  const handleTransactionAdded = () => {
    fetchUserData(); // Recarregar dados após adicionar transação
  };

  const handleTelegramIdUpdated = (newTelegramId) => {
    setUser({ ...user, telegram_id: newTelegramId });
  };

  if (loading) {
    return <div className="App">Carregando...</div>;
  }

  if (!user) {
    return (
      <div className="App">
        <header className="app-header">
          <h1>Controle de Finanças Pessoais</h1>
          <p>Gerencie suas finanças e integre com o Telegram</p>
        </header>
        
        <div className="auth-container">
          {showRegister ? (
            <Register onRegister={handleRegister} />
          ) : (
            <Login onLogin={handleLogin} />
          )}
          
          <div className="auth-switch">
            <p>
              {showRegister ? 'Já tem uma conta? ' : 'Não tem uma conta? '}
              <button 
                type="button" 
                onClick={() => setShowRegister(!showRegister)}
                className="link-button"
              >
                {showRegister ? 'Faça login' : 'Registre-se'}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Controle de Finanças Pessoais</h1>
        <div className="user-info">
          <span>Olá, {user.name}</span>
          <button onClick={handleLogout}>Sair</button>
        </div>
      </header>
      
      <div className="dashboard">
        <Dashboard {...summary} />
        
        <div className="main-content">
          <div className="transactions-section">
            <TransactionForm onTransactionAdded={handleTransactionAdded} />
            
            <h2>Últimas Transações</h2>
            <TransactionList transactions={transactions} />
          </div>
          
          <div className="sidebar">
            <TelegramIntegration 
              user={user} 
              onTelegramIdUpdated={handleTelegramIdUpdated}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;