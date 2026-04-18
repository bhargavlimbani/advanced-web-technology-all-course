const RegisterUser = require('../../application/use-cases/RegisterUser');
const LoginUser = require('../../application/use-cases/LoginUser');
const logger = require('../../infrastructure/logging/logger');
const { validationResult } = require('express-validator');

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await RegisterUser.execute(req.body);
    logger.info(`New user registered: ${user.email} (Role: ${user.role})`);
    
    // Don't send password back
    const userResponse = { id: user.id, name: user.name, email: user.email, role: user.role };
    res.status(201).json({ message: 'User registered successfully', user: userResponse });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const { user, token } = await LoginUser.execute(email, password);
    logger.info(`User logged in: ${user.email}`);
    
    res.status(200).json({ token });
  } catch (error) {
    logger.error(`Login error: ${error.message} for email ${req.body.email}`);
    res.status(401).json({ error: error.message });
  }
};
