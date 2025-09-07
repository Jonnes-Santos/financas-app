import React, { useState } from 'react';
import { updateTelegramId } from '../services/api';

const TelegramIntegration = ({ user, onTelegramIdUpdated }) => {
  const [telegramId, setTelegramId] = useState(user.telegram_id || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateTelegramId(telegramId);
      setSuccess('ID do Telegram atualizado com sucesso!');
      onTelegramIdUpdated(telegramId);
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao atualizar ID do Telegram');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(telegramId);
    setSuccess('ID copiado para a área de transferência!');
  };

  return (
    <div className="telegram-integration">
      <h3>Integração com Telegram</h3>
      <p>Vincule sua conta ao bot do Telegram para adicionar transações por mensagem!</p>
      
      <div className="form-group">
        <label>Seu ID do Telegram:</label>
        <div className="input-with-button">
          <input
            type="text"
            value={telegramId}
            onChange={(e) => setTelegramId(e.target.value)}
            placeholder="Seu ID do Telegram"
          />
          <button onClick={copyToClipboard} className="secondary" title="Copiar ID">
            📋
          </button>
        </div>
      </div>
      
      <button onClick={handleUpdate} disabled={loading}>
        {loading ? 'Salvando...' : 'Vincular Telegram'}
      </button>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="telegram-instructions">
        <h4>Como usar:</h4>
        <ol>
          <li>Adicione nosso bot no Telegram: @FinancasBot</li>
          <li>Envie seu ID para o bot: <code>/vincular {telegramId}</code></li>
          <li>Envie transações no formato: <code>+100 Alugamento</code> ou <code>-50 Mercado</code></li>
        </ol>
      </div>
    </div>
  );
};

export default TelegramIntegration;