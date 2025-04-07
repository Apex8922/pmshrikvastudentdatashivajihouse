// ES module script for creating database tables
import pg from 'pg';
const { Client } = pg;

async function main() {
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
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
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
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();