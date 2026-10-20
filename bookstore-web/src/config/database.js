const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../db/library.db');

const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Ошибка подключения к БД:', err.message);
  } else {
    console.log('Подключено к SQLite БД');
  }
});

const initializeDB = async () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS books (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          author TEXT NOT NULL,
          category TEXT NOT NULL,
          year INTEGER NOT NULL,
          price_rent REAL NOT NULL,
          price_buy REAL NOT NULL,
          status TEXT NOT NULL DEFAULT 'available',
          quantity INTEGER NOT NULL DEFAULT 1
        )
      `, (err) => { if (err) return reject(err); });

      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          is_admin BOOLEAN NOT NULL DEFAULT 0
        )
      `, (err) => { if (err) return reject(err); });

      db.run(`
        CREATE TABLE IF NOT EXISTS rentals (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          book_id INTEGER NOT NULL,
          start_date TEXT NOT NULL,
          end_date TEXT NOT NULL,
          term_months INTEGER NOT NULL,
          status TEXT NOT NULL DEFAULT 'active'
        )
      `, (err) => { if (err) return reject(err); });

      db.get('SELECT count(*) as count FROM books', (err, row) => {
        if (err) return reject(err);
        if (row.count === 0) {
          const stmt = db.prepare(`
            INSERT INTO books (title, author, category, year, price_rent, price_buy, status, quantity)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `);
          const favorites = [
            ['1984', 'George Orwell', 'Антиутопия', 1949, 150.0, 450.0, 'available', 5],
            ['Мастер и Маргарита', 'Михаил Булгаков', 'Роман', 1967, 200.0, 600.0, 'available', 3],
            ['Преступление и наказание', 'Фёдор Достоевский', 'Классика', 1866, 180.0, 550.0, 'available', 4],
            ['Маленький принц', 'Антуан де Сент-Экзюпери', 'Сказка', 1943, 120.0, 350.0, 'available', 6],
            ['Гарри Поттер и философский камень', 'Дж. К. Роулинг', 'Фэнтези', 1997, 170.0, 520.0, 'available', 7]
          ];
          favorites.forEach((b) => stmt.run(b));
          stmt.finalize(() => {
            console.log('Добавлены любимые книги (seed)');
            resolve();
          });
        } else {
          console.log('Книги уже есть в БД, seed пропущен');
          resolve();
        }
      });
    });
  });
};

module.exports = { db, initializeDB };
