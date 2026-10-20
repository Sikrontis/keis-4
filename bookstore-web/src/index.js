require('dotenv').config();
const express = require('express');
const { initializeDB } = require('./config/database');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

initializeDB()
  .then(() => {
    app.use('/api', apiRoutes);

    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Не удалось инициализировать БД, сервер не запущен:', err);
    process.exit(1);
  });
