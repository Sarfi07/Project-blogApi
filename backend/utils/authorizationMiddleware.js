// middleware/authorizationMiddleware.js
const authorizationMiddleware = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      return next();
    }
    res.status(403).send("Access denied");
    // res.json({ role: req.user.role });
  };
};

export default authorizationMiddleware;
