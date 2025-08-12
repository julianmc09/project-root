const pool = require('../config/database');

class Product {
  // Create new product
  static async create(productData) {
    const { name, description, price, stock, category, image_url } = productData;
    
    const query = `
      INSERT INTO products (name, description, price, stock, category, image_url, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING id, name, description, price, stock, category, image_url, created_at
    `;
    
    const values = [name, description, price, stock, category, image_url];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get product by ID
  static async findById(id) {
    const query = 'SELECT * FROM products WHERE id = $1';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all products
  static async findAll() {
    const query = 'SELECT * FROM products ORDER BY created_at DESC';
    
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get products by category
  static async findByCategory(category) {
    const query = 'SELECT * FROM products WHERE category = $1 ORDER BY created_at DESC';
    
    try {
      const result = await pool.query(query, [category]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Search products
  static async search(searchTerm) {
    const query = `
      SELECT * FROM products 
      WHERE name ILIKE $1 OR description ILIKE $1 OR category ILIKE $1
      ORDER BY created_at DESC
    `;
    
    try {
      const result = await pool.query(query, [`%${searchTerm}%`]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Update product
  static async update(id, productData) {
    const { name, description, price, stock, category, image_url } = productData;
    const query = `
      UPDATE products 
      SET name = $1, description = $2, price = $3, stock = $4, category = $5, image_url = $6, updated_at = NOW()
      WHERE id = $7
      RETURNING id, name, description, price, stock, category, image_url, updated_at
    `;
    
    const values = [name, description, price, stock, category, image_url, id];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update stock
  static async updateStock(id, quantity) {
    const query = `
      UPDATE products 
      SET stock = stock - $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, stock
    `;
    
    try {
      const result = await pool.query(query, [quantity, id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete product
  static async delete(id) {
    const query = 'DELETE FROM products WHERE id = $1 RETURNING id';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Product;
