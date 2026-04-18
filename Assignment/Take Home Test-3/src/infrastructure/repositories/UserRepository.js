const UserModel = require('../database/models/UserModel');
const User = require('../../domain/entities/User');
const logger = require('../logging/logger');

class UserRepository {
  _mapToEntity(doc) {
    if (!doc) return null;
    return new User({
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      role: doc.role,
      studentId: doc.studentId,
      createdAt: doc.createdAt
    });
  }

  async findByEmail(email) {
    try {
      const user = await UserModel.findOne({ email });
      return this._mapToEntity(user);
    } catch (err) {
      logger.error(`UserRepository.findByEmail: ${err.message}`);
      throw err;
    }
  }

  async findById(id) {
    try {
      const user = await UserModel.findById(id);
      return this._mapToEntity(user);
    } catch (err) {
      // Return null for invalid object id errors
      if (err.name === 'CastError') return null;
      logger.error(`UserRepository.findById: ${err.message}`);
      throw err;
    }
  }

  async findAll() {
    try {
      const users = await UserModel.find();
      return users.map(u => this._mapToEntity(u));
    } catch (err) {
      logger.error(`UserRepository.findAll: ${err.message}`);
      throw err;
    }
  }

  async save(user) {
    try {
      if (user.id) {
        // Update
        const updated = await UserModel.findByIdAndUpdate(user.id, {
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          studentId: user.studentId
        }, { new: true, runValidators: true });
        
        return this._mapToEntity(updated);
      } else {
        // Create
        const newUser = new UserModel({
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          studentId: user.studentId
        });
        const saved = await newUser.save();
        return this._mapToEntity(saved);
      }
    } catch (err) {
      logger.error(`UserRepository.save: ${err.message}`);
      throw err;
    }
  }

  async delete(id) {
    try {
      const result = await UserModel.findByIdAndDelete(id);
      return result !== null;
    } catch (err) {
      logger.error(`UserRepository.delete: ${err.message}`);
      throw err;
    }
  }
}

module.exports = new UserRepository();
