exports.validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
    }
    
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    
    next();
  };
  
  exports.validateTransaction = (req, res, next) => {
    const { type, amount, category } = req.body;
    
    if (!type || !amount || !category) {
      return res.status(400).json({ error: 'Tipo, valor e categoria são obrigatórios' });
    }
    
    if (type !== 'income' && type !== 'expense') {
      return res.status(400).json({ error: 'Tipo deve ser income ou expense' });
    }
    
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Valor deve ser um número positivo' });
    }
    
    next();
  };
  
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }