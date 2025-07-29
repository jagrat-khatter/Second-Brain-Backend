import dotenv from 'dotenv';

// Load contents of .env into process.env
dotenv.config();

export const db_string: string = process.env.DB_STRING!;
export const JWT_secrets: string = process.env.JWT_SECRET!;

// The exclamation marks (!) tell TypeScript that you're sure these variables exist; you can add 
// runtime checks if needed.

