const AuthService = require('../../infrastructure/services/AuthService');
const userRepository = require('../../infrastructure/repositories/UserRepository');
const User = require('../../domain/entities/User');


class RegisterUser {
  async execute(userData) {
    // Check if user exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await AuthService.hashPassword(userData.password);

    // Create user entity
    const newUser = new User({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'student', // Librarian role must be protected or seeded manually, but we allow specifying for test
      studentId: userData.studentId,
    });

    // Save to repository
    await userRepository.save(newUser);
    return newUser;
  }
}

module.exports = new RegisterUser();
