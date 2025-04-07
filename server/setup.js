// CommonJS setup script that runs before server starts
const { Client } = require('pg');

async function setupDatabase() {
  console.log('Starting database setup...');
  
  // Get database connection string from environment variable
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }
  
  const client = new Client({
    connectionString: databaseUrl
  });
  
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected to database successfully!');
    
    // Create tables
    console.log('Creating students table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        class TEXT NOT NULL,
        section TEXT NOT NULL,
        house TEXT NOT NULL,
        notes TEXT
      )
    `);
    
    console.log('Creating users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL
      )
    `);
    
    // Check if admin user exists, create if not
    const userResult = await client.query(`
      SELECT COUNT(*) FROM users WHERE username = 'admin'
    `);
    
    if (parseInt(userResult.rows[0].count) === 0) {
      console.log('Creating default admin user...');
      await client.query(`
        INSERT INTO users (username, password) 
        VALUES ('admin', 'admin123')
      `);
    }
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    // Don't exit the process, just log the error
    console.error('Detailed error:', error);
  } finally {
    await client.end();
  }
}

// Export the function in a way that works with ESM imports
module.exports = { setupDatabase };
// Also export as a named export for ESM
export { setupDatabase };