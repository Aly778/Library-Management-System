const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async findById(userId) {
    try {
      const [users] = await db.execute(
        'SELECT Uid, Urole, Ufirst_name, Ulast_name, Uemail, Uphone_number, Udob, gender FROM Users WHERE Uid = ?',
        [userId]
      );
      return users[0] || null;
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  static async findByEmail(email) {
    try {
      const [users] = await db.execute(
        'SELECT * FROM Users WHERE Uemail = ?',
        [email]
      );
      return users[0] || null;
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  static async create(userData) {
    try {
      const { firstName, lastName, email, password, phoneNumber, dob, gender } = userData;
      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await db.execute(
        `INSERT INTO Users (Ufirst_name, Ulast_name, Uemail, Upassword, Uphone_number, Udob, gender, Urole) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 'customer')`,
        [firstName, lastName, email, hashedPassword, phoneNumber, dob, gender]
      );

      return { Uid: result.insertId, ...userData };
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  static async updateProfile(userId, userData) {
    try {
      const { firstName, lastName, phoneNumber, dob, gender } = userData;
      
      await db.execute(
        `UPDATE Users SET Ufirst_name = ?, Ulast_name = ?, Uphone_number = ?, Udob = ?, gender = ? 
         WHERE Uid = ?`,
        [firstName, lastName, phoneNumber, dob, gender, userId]
      );

      return this.findById(userId);
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  static async verifyPassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error(`Error verifying password: ${error.message}`);
    }
  }

  static async getAllUsers() {
    try {
      const [users] = await db.execute(
        'SELECT Uid, Urole, Ufirst_name, Ulast_name, Uemail, Uphone_number, Udob, gender FROM Users'
      );
      return users;
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  static async deleteUser(userId) {
    try {
      const [result] = await db.execute('DELETE FROM Users WHERE Uid = ?', [userId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
}

module.exports = User;
