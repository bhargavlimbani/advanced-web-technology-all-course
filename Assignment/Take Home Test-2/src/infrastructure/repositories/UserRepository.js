const JsonStorage = require('./JsonStorage');
const User = require('../../domain/entities/User');

class UserRepository {
  constructor() {
    this.storage = new JsonStorage('users.json');
  }

  async findByEmail(email) {
    const users = this.storage.read();
    const user = users.find(u => u.email === email);
    return user ? new User(user) : null;
  }

  async findById(id) {
    const users = this.storage.read();
    const user = users.find(u => u.id === id);
    return user ? new User(user) : null;
  }

  async findAll() {
    const users = this.storage.read();
    return users.map(u => new User(u));
  }

  async save(user) {
    const users = this.storage.read();
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    this.storage.write(users);
    return user;
  }

  async delete(id) {
    const users = this.storage.read();
    const newUsers = users.filter(u => u.id !== id);
    if (users.length !== newUsers.length) {
      this.storage.write(newUsers);
      return true;
    }
    return false;
  }
}

module.exports = new UserRepository();
