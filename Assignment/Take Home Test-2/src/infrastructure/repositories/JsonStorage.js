const fs = require('fs');
const path = require('path');
const logger = require('../logging/logger');

class JsonStorage {
  constructor(filename) {
    this.filepath = path.join(__dirname, '../../../data', filename);
    this.init();
  }

  init() {
    try {
      const dir = path.dirname(this.filepath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      if (!fs.existsSync(this.filepath)) {
        fs.writeFileSync(this.filepath, JSON.stringify([]));
      }
    } catch (err) {
      logger.error(`Error initializing storage for ${this.filepath}`, err);
    }
  }

  read() {
    try {
      const data = fs.readFileSync(this.filepath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      logger.error(`Error reading ${this.filepath}`, err);
      return [];
    }
  }

  write(data) {
    try {
      fs.writeFileSync(this.filepath, JSON.stringify(data, null, 2));
    } catch (err) {
      logger.error(`Error writing to ${this.filepath}`, err);
    }
  }
}

module.exports = JsonStorage;
