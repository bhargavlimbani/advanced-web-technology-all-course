const userRepository = require('../../infrastructure/repositories/UserRepository');

class UserUseCases {
  async getAllUsers() {
    return await userRepository.findAll();
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  async updateUser(id, data) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('User not found');
    
    if (data.name) user.name = data.name;
    if (data.role) user.role = data.role; // Librarian can update role

    return await userRepository.save(user);
  }

  async deleteUser(id) {
    const deleted = await userRepository.delete(id);
    if (!deleted) throw new Error('User not found');
    return true;
  }
}

module.exports = new UserUseCases();
