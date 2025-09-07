const jwt = require('jsonwebtoken');
const db = require('../config/database');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token de acesso necessário' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    
    // Verificar se o usuário ainda existe
    db.query('SELECT id FROM users WHERE id = ?', [decoded.id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erro no servidor' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      req.userId = decoded.id;
      next();
    });
  });
};

module.exports = authenticateToken;