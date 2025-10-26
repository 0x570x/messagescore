require('dotenv').config();
const bcrypt = require('bcrypt');
const { pool } = require('../db/connection');

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Usage: node createAdmin.js <email> <password>');
    process.exit(1);
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    
    await pool.query(
      'INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)',
      [email, passwordHash]
    );
    
    console.log(`✓ Admin user created: ${email}`);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
}

createAdmin();