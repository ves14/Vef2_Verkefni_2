import dotenv from 'dotenv';

dotenv.config();

export const {
  DATABASE_URL: connectionString,
  DEV: dev = false,
} = process.env;

console.log(connectionString);

const connectionOptions = { connectionString };

if (!dev) {
  connectionOptions.ssl = {
    rejectUnauthorized: false,
  };
}




