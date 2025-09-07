import React from 'react';

const TransactionList = ({ transactions }) => {
  if (transactions.length === 0) {
    return <p>Nenhuma transação registrada.</p>;
  }

  return (
    <div className="transactions-list">
      {transactions.map(transaction => (
        <div key={transaction.id} className={`transaction ${transaction.type}`}>
          <div className="transaction-info">
            <h4>{transaction.category}</h4>
            <p>{transaction.description}</p>
            <small>{new Date(transaction.created_at).toLocaleDateString()}</small>
          </div>
          <div className="transaction-amount">
            <span className={transaction.type === 'income' ? 'positive' : 'negative'}>
              {transaction.type === 'income' ? '+' : '-'} R$ {Math.abs(transaction.amount).toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;