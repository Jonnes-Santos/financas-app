const db = require('../config/database');

exports.getTransactions = (req, res) => {
  db.query(
    'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC',
    [req.userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar transações' });
      }
      res.json(results);
    }
  );
};

exports.createTransaction = (req, res) => {
  const { type, amount, category, description } = req.body;
  
  db.query(
    'INSERT INTO transactions (user_id, type, amount, category, description) VALUES (?, ?, ?, ?, ?)',
    [req.userId, type, amount, category, description || ''],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao criar transação' });
      }
      
      res.status(201).json({
        message: 'Transação criada com sucesso',
        transactionId: results.insertId
      });
    }
  );
};

exports.getSummary = (req, res) => {
  const userId = req.userId;
  
  // Buscar totais de receitas e despesas
  db.query(
    `SELECT 
      type, 
      SUM(amount) as total 
    FROM transactions 
    WHERE user_id = ? 
    GROUP BY type`,
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar resumo' });
      }
      
      let income = 0;
      let expense = 0;
      
      results.forEach(row => {
        if (row.type === 'income') {
          income = parseFloat(row.total);
        } else if (row.type === 'expense') {
          expense = parseFloat(row.total);
        }
      });
      
      const balance = income - expense;
      
      res.json({
        income,
        expense,
        balance
      });
    }
  );
};