const pool = require('../config/database');

class Purchase {
  // Create new purchase
  static async create(purchaseData) {
    const { user_id, total_amount, items } = purchaseData;
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Create purchase record
      const purchaseQuery = `
        INSERT INTO purchases (user_id, total_amount, status, created_at)
        VALUES ($1, $2, 'completed', NOW())
        RETURNING id, user_id, total_amount, status, created_at
      `;
      
      const purchaseResult = await client.query(purchaseQuery, [user_id, total_amount]);
      const purchase = purchaseResult.rows[0];
      
      // Create purchase items
      for (const item of items) {
        const itemQuery = `
          INSERT INTO purchase_items (purchase_id, product_id, quantity, price)
          VALUES ($1, $2, $3, $4)
        `;
        
        await client.query(itemQuery, [purchase.id, item.product_id, item.quantity, item.price]);
        
        // Update product stock
        const stockQuery = `
          UPDATE products 
          SET stock = stock - $1 
          WHERE id = $2
        `;
        
        await client.query(stockQuery, [item.quantity, item.product_id]);
      }
      
      await client.query('COMMIT');
      return purchase;
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get purchase by ID
  static async findById(id) {
    const query = `
      SELECT p.*, u.username, u.full_name
      FROM purchases p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get purchase items
  static async getPurchaseItems(purchaseId) {
    const query = `
      SELECT pi.*, p.name as product_name, p.image_url
      FROM purchase_items pi
      JOIN products p ON pi.product_id = p.id
      WHERE pi.purchase_id = $1
    `;
    
    try {
      const result = await pool.query(query, [purchaseId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get user purchases
  static async findByUserId(userId) {
    const query = `
      SELECT p.*, u.username, u.full_name
      FROM purchases p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get all purchases (admin only)
  static async findAll() {
    const query = `
      SELECT p.*, u.username, u.full_name
      FROM purchases p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Update purchase status
  static async updateStatus(id, status) {
    const query = `
      UPDATE purchases 
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, status, updated_at
    `;
    
    try {
      const result = await pool.query(query, [status, id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete purchase (admin only)
  static async delete(id) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Delete purchase items first
      await client.query('DELETE FROM purchase_items WHERE purchase_id = $1', [id]);
      
      // Delete purchase
      const result = await client.query('DELETE FROM purchases WHERE id = $1 RETURNING id', [id]);
      
      await client.query('COMMIT');
      return result.rows[0];
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = Purchase;
