const userUseCases = require('../../application/use-cases/UserUseCases');
const logger = require('../../infrastructure/logging/logger');
const { validationResult } = require('express-validator');

exports.getUsers = async (req, res) => {
  try {
    const users = await userUseCases.getAllUsers();
    // Exclude passwords
    const safeUsers = users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt }));
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userUseCases.getUserById(req.params.id);
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const user = await userUseCases.updateUser(req.params.id, req.body);
    logger.info(`User updated by Librarian ${req.user.email}: ${user.id}`);
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await userUseCases.deleteUser(req.params.id);
    logger.info(`User deleted by Librarian ${req.user.email}: ${req.params.id}`);
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
