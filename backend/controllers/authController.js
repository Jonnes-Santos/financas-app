const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Verificar se o usuário já existe
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erro no servidor' });
      }
      
      if (results.length > 0) {
        return res.status(400).json({ error: 'Usuário já existe' });
      }
      
      // Criptografar a senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Gerar ID do Telegram único
      const telegramId = 'TG' + Math.random().toString(36).substr(2, 9).toUpperCase();
      
      // Criar usuário
      db.query(
        'INSERT INTO users (name, email, password, telegram_id) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, telegramId],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: 'Erro ao criar usuário' });
          }
          
          // Gerar token JWT
          const token = jwt.sign(
            { id: results.insertId },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
          );
          
          res.status(201).json({
            message: 'Usuário criado com sucesso',
            token,
            user: {
              id: results.insertId,
              name,
              email,
              telegram_id: telegramId
            }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Verificar se o usuário existe
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erro no servidor' });
      }
      
      if (results.length === 0) {
        return res.status(400).json({ error: 'Credenciais inválidas' });
      }
      
      const user = results[0];
      
      // Verificar senha
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Credenciais inválidas' });
      }
      
      // Gerar token JWT
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          telegram_id: user.telegram_id
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
};