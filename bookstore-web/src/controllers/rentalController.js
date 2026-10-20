const { db } = require('../config/database');

function addDays(dateStr, days) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

exports.rentBook = (req, res) => {
  const { user_id, book_id, term_months } = req.body;
  const start_date = new Date().toISOString().split('T')[0];
  const days = term_months === 0.5 ? 14 : term_months === 1 ? 30 : 90;
  const end_date = addDays(start_date, days);

  const stmt = db.prepare('INSERT INTO rentals (user_id,book_id,start_date,end_date,term_months,status) VALUES (?,?,?,?,?,?)');
  stmt.run([user_id, book_id, start_date, end_date, term_months, 'active'], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, start_date, end_date, term_months });
  });
  stmt.finalize();
};

exports.buyBook = (req, res) => {
  const { user_id, book_id } = req.body;
  // В демо-версии просто фиксируем покупку без сложной логики
  res.json({ user_id, book_id, purchased: true, message: 'Покупка оформлена (демо)' });
};
