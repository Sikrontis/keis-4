const { db } = require('../config/database');

exports.getBooks = (req, res) => {
  const { category, author, sortBy, order } = req.query;
  let query = 'SELECT * FROM books WHERE 1=1';
  const params = [];

  if (category) { query += ' AND category = ?'; params.push(category); }
  if (author) { query += ' AND author = ?'; params.push(author); }

  const sortField = ['title', 'author', 'year', 'price_rent'].includes(sortBy) ? sortBy : 'title';
  const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

  query += ` ORDER BY ${sortField} ${sortOrder}`;

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.createBook = (req, res) => {
  // упрощенно: без валидации для краткости
  const { title, author, category, year, price_rent, price_buy, status, quantity } = req.body;
  const stmt = db.prepare('INSERT INTO books (title,author,category,year,price_rent,price_buy,status,quantity) VALUES (?,?,?,?,?,?,?,?)');
  stmt.run([title, author, category, year, price_rent, price_buy, status || 'available', quantity || 1], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, title, author });
  });
  stmt.finalize();
};

exports.updateBook = (req, res) => {
  const { id } = req.params;
  const { title, author, category, year, price_rent, price_buy, status, quantity } = req.body;
  const stmt = db.prepare('UPDATE books SET title=?,author=?,category=?,year=?,price_rent=?,price_buy=?,status=?,quantity=? WHERE id=?');
  stmt.run([title, author, category, year, price_rent, price_buy, status, quantity, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, updated: true });
  });
  stmt.finalize();
};

exports.deleteBook = (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('DELETE FROM books WHERE id=?');
  stmt.run([id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, deleted: true });
  });
  stmt.finalize();
};
