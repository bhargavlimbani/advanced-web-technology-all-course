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

    // Generate tokens
    const token = AuthService.generateToken(user);
    const refreshToken = AuthService.generateRefreshToken(user);

    return { user, token, refreshToken };
  }
}

module.exports = new LoginUser();
