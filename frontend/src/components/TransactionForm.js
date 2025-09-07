import React, { useState } from 'react';
import { createTransaction } from '../services/api';

const TransactionForm = ({ onTransactionAdded }) => {
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createTransaction(type, parseFloat(amount), category, description);
      onTransactionAdded();
      // Limpar o formulário
      setAmount('');
      setCategory('');
      setDescription('');
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao adicionar transação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-form">
      <h2>Adicionar Transação</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Tipo:</label>
            <select value={type} onChange={(e) => setType(e.target.value)} required>
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
            </select>
          </div>
          <div className="form-group">
            <label>Valor (R$):</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Categoria:</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Descrição:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Adicionando...' : 'Adicionar Transação'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;