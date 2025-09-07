const db = require('../config/database');

exports.updateTelegramId = (req, res) => {
  const { telegram_id } = req.body;
  const userId = req.userId;
  
  // Verificar se o telegram_id já está em uso por outro usuário
  db.query(
    'SELECT id FROM users WHERE telegram_id = ? AND id != ?',
    [telegram_id, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erro no servidor' });
      }
      
      if (results.length > 0) {
        return res.status(400).json({ error: 'Este ID do Telegram já está em uso' });
      }
      
      // Atualizar o telegram_id do usuário
      db.query(
        'UPDATE users SET telegram_id = ? WHERE id = ?',
        [telegram_id, userId],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: 'Erro ao atualizar ID do Telegram' });
          }
          
          res.json({ message: 'ID do Telegram atualizado com sucesso' });
        }
      );
    }
  );
};

exports.getUserProfile = (req, res) => {
  const userId = req.userId;
  
  db.query(
    'SELECT id, name, email, telegram_id, created_at FROM users WHERE id = ?',
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar perfil' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      res.json(results[0]);
    }
  );
};