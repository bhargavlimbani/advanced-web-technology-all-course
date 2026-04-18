class User {
  constructor({ id, name, email, password, role = 'student', createdAt = new Date() }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password; // Hashed distance
    this.role = role; // 'librarian' or 'student'
    this.createdAt = createdAt;
  }
}

module.exports = User;
