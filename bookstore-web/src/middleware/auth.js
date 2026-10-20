exports.requireAdmin = (req, res, next) => {
  // Здесь должна быть полноценная проверка токена/сессии и флага isAdmin
  // Для демо возвращаем ошибку, если не передан заголовок X-Admin: true
  const isAdminHeader = req.headers['x-admin'] === 'true';
  if (!isAdminHeader) {
    return res.status(403).json({ error: 'Доступ только для администратора' });
  }
  next();
};
