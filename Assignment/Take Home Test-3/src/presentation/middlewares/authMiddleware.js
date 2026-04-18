const jwt = require('jsonwebtoken');
const logger = require('../../infrastructure/logging/logger');
const userRepository = require('../../infrastructure/repositories/UserRepository');

exports.isAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    logger.warn('Unauthorized access attempt: No token provided');
    return res.status(401).json({ error: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'The user belonging to this token no longer exists.' });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.warn(`Unauthorized access attempt: Invalid token - ${error.message}`);
    return res.status(401).json({ error: 'Not authorized to access this route' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      logger.warn(`Forbidden access attempt by user ${req.user.email} (Role: ${req.user.role})`);
      return res.status(403).json({ error: `User role ${req.user.role} is not authorized to access this route` });
    }
    next();
  };
};
