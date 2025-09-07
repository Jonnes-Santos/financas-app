CREATE DATABASE IF NOT EXISTS financas_pessoais;
USE financas_pessoais;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telegram_id VARCHAR(50) UNIQUE,
    telegram_chat_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Inserir dados de exemplo (opcional)
INSERT INTO users (name, email, password, telegram_id) VALUES 
('João Silva', 'joao@email.com', '$2a$10$rOzZTOb2lXC.7IZPeM2e.u5U.7k7QnRqk8qk8qk8qk8qk8qk8qk8q', 'TGABC123'),
('Maria Santos', 'maria@email.com', '$2a$10$rOzZTOb2lXC.7IZPeM2e.u5U.7k7QnRqk8qk8qk8qk8qk8qk8q', 'TGDEF456');

INSERT INTO transactions (user_id, type, amount, category, description) VALUES 
(1, 'income', 2500.00, 'Salário', 'Pagamento mensal'),
(1, 'expense', 850.00, 'Aluguel', 'Aluguel do apartamento'),
(1, 'expense', 350.00, 'Alimentação', 'Supermercado do mês'),
(2, 'income', 3200.00, 'Salário', 'Pagamento mensal'),
(2, 'expense', 650.00, 'Transporte', 'Combustível e transporte');