const db = require('../config/db');

class Category {
  static async findAll() {
    try {
      const [categories] = await db.execute(
        'SELECT * FROM Categories ORDER BY Cname ASC'
      );
      return categories;
    } catch (error) {
      throw new Error(`Error fetching categories: ${error.message}`);
    }
  }

  static async findById(categoryId) {
    try {
      const [categories] = await db.execute(
        'SELECT * FROM Categories WHERE Cid = ?',
        [categoryId]
      );
      return categories[0] || null;
    } catch (error) {
      throw new Error(`Error finding category: ${error.message}`);
    }
  }

  static async create(categoryData) {
    try {
      const { name, parentId } = categoryData;

      const [result] = await db.execute(
        'INSERT INTO Categories (Cname, Cparent_id) VALUES (?, ?)',
        [name, parentId || null]
      );

      return { Cid: result.insertId, ...categoryData };
    } catch (error) {
      throw new Error(`Error creating category: ${error.message}`);
    }
  }

  static async update(categoryId, categoryData) {
    try {
      const { name, parentId } = categoryData;

      await db.execute(
        'UPDATE Categories SET Cname = ?, Cparent_id = ? WHERE Cid = ?',
        [name, parentId || null, categoryId]
      );

      return this.findById(categoryId);
    } catch (error) {
      throw new Error(`Error updating category: ${error.message}`);
    }
  }

  static async delete(categoryId) {
    try {
      const [result] = await db.execute(
        'DELETE FROM Categories WHERE Cid = ?',
        [categoryId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting category: ${error.message}`);
    }
  }

  static async getBookCount(categoryId) {
    try {
      const [result] = await db.execute(
        'SELECT COUNT(*) as count FROM Books WHERE Cid = ?',
        [categoryId]
      );
      return result[0].count;
    } catch (error) {
      throw new Error(`Error getting book count: ${error.message}`);
    }
  }
}

module.exports = Category;
