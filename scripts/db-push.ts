import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { neon } from '@neondatabase/serverless';
import * as schema from '../shared/schema';

// This script pushes the schema to the database
async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('DATABASE_URL is not defined in the environment variables');
    process.exit(1);
  }
  
  console.log('Connecting to database...');
  
  try {
    const sql = neon(databaseUrl);
    const db = drizzle(sql, { schema });
    
    // Use Drizzle Kit's migrate function to push the schema
    console.log('Pushing schema to database...');
    await migrate(db, { migrationsFolder: 'drizzle/migrations' });
    console.log('Schema pushed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error pushing schema to database:', error);
    process.exit(1);
  }
}

main();