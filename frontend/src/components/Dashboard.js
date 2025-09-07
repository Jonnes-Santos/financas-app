import React from 'react';

const Dashboard = ({ income, expense, balance }) => {
  return (
    <div className="financial-summary">
      <div className="summary-card">
        <h3>Saldo</h3>
        <span className={balance >= 0 ? 'positive' : 'negative'}>
          R$ {balance.toFixed(2)}
        </span>
      </div>
      <div className="summary-card">
        <h3>Receitas</h3>
        <span className="positive">R$ {income.toFixed(2)}</span>
      </div>
      <div className="summary-card">
        <h3>Despesas</h3>
        <span className="negative">R$ {expense.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Dashboard;