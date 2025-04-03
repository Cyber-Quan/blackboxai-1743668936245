const { verifyToken } = require('../models/user');

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).redirect('/users/login');
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie('accessToken');
    return res.status(401).redirect('/users/login');
  }
};