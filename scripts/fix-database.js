// One-time fix for the students table
import pg from 'pg';
const { Client } = pg;

async function main() {
  console.log('Running emergency database fix...');
  
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
    
    // Check if the students table exists
    console.log('Checking if students table exists...');
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'students'
      );
    `);
    
    const tableExists = tableCheck.rows[0].exists;
    console.log('Students table exists:', tableExists);
    
    if (tableExists) {
      // Check if the created_at column exists
      console.log('Checking if created_at column exists...');
      const columnCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'students' AND column_name = 'created_at'
        );
      `);
      
      const columnExists = columnCheck.rows[0].exists;
      console.log('created_at column exists:', columnExists);
      
      if (!columnExists) {
        // Drop and recreate the table
        console.log('Recreating students table with correct schema...');
        await client.query(`
          -- Get current data
          CREATE TEMPORARY TABLE temp_students AS 
          SELECT id, name, class, section, house, notes 
          FROM students;
          
          -- Drop and recreate with correct schema
          DROP TABLE students;
          
          CREATE TABLE students (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            class TEXT NOT NULL,
            section TEXT NOT NULL,
            house TEXT NOT NULL,
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
          );
          
          -- Restore data
          INSERT INTO students (id, name, class, section, house, notes)
          SELECT id, name, class, section, house, notes
          FROM temp_students;
          
          -- Fix the sequence (in case we have existing rows)
          SELECT setval('students_id_seq', (SELECT MAX(id) FROM students), true);
        `);
        console.log('Students table recreated successfully!');
      } else {
        console.log('Students table already has the correct schema.');
      }
    } else {
      // Create the students table with the correct schema
      console.log('Creating students table with correct schema...');
      await client.query(`
        CREATE TABLE students (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          class TEXT NOT NULL,
          section TEXT NOT NULL,
          house TEXT NOT NULL,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        );
      `);
      console.log('Students table created successfully!');
    }
    
    console.log('Database fix completed successfully!');
  } catch (error) {
    console.error('Error fixing database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();