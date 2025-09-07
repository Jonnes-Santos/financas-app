const TelegramBot = require('node-telegram-bot-api');
const db = require('../config/database');

// Inicializar o bot do Telegram
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Comando de início
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const message = `
    Olá! Eu sou o bot de finanças pessoais. 🤖💰

    Para começar, você precisa vincular sua conta do Telegram com sua conta no aplicativo web.

    Para vincular, siga estos passos:
    1. Acesse o aplicativo web
    2. Vá para a seção "Integração com Telegram"
    3. Copie seu ID único do Telegram
    4. Volte aqui e envie: /vincular SEU_ID

    Depois de vinculado, você pode enviar transações no formato:
    +100 Alugamento  (para adicionar uma receita de R$ 100 na categoria Alugamento)
    -50 Mercado      (para adicionar uma despesa de R$ 50 na categoria Mercado)

    Digite /ajuda para ver todos os comandos disponíveis.
  `;
  
  bot.sendMessage(chatId, message);
});

// Comando de ajuda
bot.onText(/\/ajuda/, (msg) => {
  const chatId = msg.chat.id;
  const message = `
    📋 Comandos disponíveis:

    /start - Iniciar o bot
    /ajuda - Ver esta mensagem de ajuda
    /vincular [ID] - Vincular sua conta do Telegram
    /meuid - Ver seu ID único do Telegram

    💰 Para adicionar transações, use:
    +[valor] [categoria] [descrição] - Adicionar receita
    -[valor] [categoria] [descrição] - Adicionar despesa

    Exemplos:
    +100 Alugamento Recebimento do alugamento
    -50 Mercado Compra do mês
    +1200 Salário Pagamento mensal
  `;
  
  bot.sendMessage(chatId, message);
});

// Comando para vincular conta
bot.onText(/\/vincular (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const telegramId = match[1];
  
  // Verificar se o telegramId existe no banco de dados
  db.query('SELECT id, name FROM users WHERE telegram_id = ?', [telegramId], (err, results) => {
    if (err) {
      return bot.sendMessage(chatId, '❌ Ocorreu um erro. Tente novamente mais tarde.');
    }
    
    if (results.length === 0) {
      return bot.sendMessage(chatId, '❌ ID não encontrado. Verifique se digitou corretamente.');
    }
    
    const user = results[0];
    
    // Atualizar o chat_id do usuário
    db.query('UPDATE users SET telegram_chat_id = ? WHERE telegram_id = ?', [chatId, telegramId], (err) => {
      if (err) {
        return bot.sendMessage(chatId, '❌ Ocorreu um erro ao vincular. Tente novamente mais tarde.');
      }
      
      bot.sendMessage(chatId, `✅ Conta vinculada com sucesso! Olá, ${user.name}! Agora você pode enviar transações.`);
    });
  });
});

// Comando para ver o ID do Telegram
bot.onText(/\/meuid/, (msg) => {
  const chatId = msg.chat.id;
  
  // Verificar se o usuário já tem um chat_id registrado
  db.query('SELECT telegram_id FROM users WHERE telegram_chat_id = ?', [chatId], (err, results) => {
    if (err) {
      return bot.sendMessage(chatId, '❌ Ocorreu um erro. Tente novamente mais tarde.');
    }
    
    if (results.length === 0) {
      return bot.sendMessage(chatId, '❌ Você ainda não vinculou sua conta. Use /vincular [SEU_ID] primeiro.');
    }
    
    const user = results[0];
    bot.sendMessage(chatId, `Seu ID único do Telegram é: ${user.telegram_id}`);
  });
});

// Processar transações enviadas por mensagem
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  // Ignorar comandos que começam com /
  if (text.startsWith('/')) {
    return;
  }
  
  // Verificar se é uma transação (começa com + ou -)
  const transactionRegex = /^([+-])(\d+)(?:\.(\d+))?(?:\s+(\w+))?(?:\s+(.*))?$/;
  const match = text.match(transactionRegex);
  
  if (!match) {
    return; // Não é uma transação válida
  }
  
  const type = match[1] === '+' ? 'income' : 'expense';
  const integerPart = match[2];
  const decimalPart = match[3] || '00';
  const amount = parseFloat(`${integerPart}.${decimalPart}`);
  const category = match[4] || 'Outros';
  const description = match[5] || '';
  
  // Buscar usuário pelo chat_id
  db.query('SELECT id FROM users WHERE telegram_chat_id = ?', [chatId], (err, results) => {
    if (err) {
      return bot.sendMessage(chatId, '❌ Ocorreu um erro. Tente novamente mais tarde.');
    }
    
    if (results.length === 0) {
      return bot.sendMessage(chatId, '❌ Você precisa vincular sua conta primeiro. Use /start para ver como.');
    }
    
    const user = results[0];
    
    // Inserir a transação no banco de dados
    db.query(
      'INSERT INTO transactions (user_id, type, amount, category, description) VALUES (?, ?, ?, ?, ?)',
      [user.id, type, amount, category, description],
      (err) => {
        if (err) {
          return bot.sendMessage(chatId, '❌ Ocorreu um erro ao salvar a transação.');
        }
        
        bot.sendMessage(chatId, `✅ Transação de R$ ${amount.toFixed(2)} (${category}) registrada com sucesso!`);
      }
    );
  });
});

console.log('Bot do Telegram inicializado');

module.exports = bot;