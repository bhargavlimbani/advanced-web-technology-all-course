const AuthService = require('../../infrastructure/services/AuthService');
const userRepository = require('../../infrastructure/repositories/UserRepository');

class LoginUser {
  async execute(email, password) {
    // Check if user exists
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isMatch = await AuthService.comparePassword(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = AuthService.generateToken(user);

    return { user, token };
  }
}

module.exports = new LoginUser();
