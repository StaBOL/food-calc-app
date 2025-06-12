const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const db = new sqlite3.Database('users.db');

app.use(cors());
app.use(express.json());

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, password], function(err) {
    if (err) return res.status(400).json({ message: 'Пользователь уже существует' });
    res.json({ message: 'Регистрация успешна' });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
    if (!row || row.password !== password) {
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }
    res.json({ message: 'Вход выполнен' });
  });
});

app.listen(3000, () => {
  console.log('Сервер работает на http://localhost:3000');
});
