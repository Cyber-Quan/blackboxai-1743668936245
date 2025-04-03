module.exports = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).render('error', { 
        message: 'Forbidden: You do not have permission to access this resource' 
      });
    }
    next();
  };
};