import express from 'express';

// TODO skráningar virkni
//Make a router for connection
const router = express.Router;

const connectionString = 'postgres://vef2-2021:123@localhost/vef2-2021';
const pool = new pg.Pool({ connectionString });

async function main() {
    
    const client = await pool.connect();
  
    try {
      const result = await client.query('SELECT * FROM people');
      console.log('rows :>> ', result.rows);
    } catch (e) {
      console.error('Error selecting', e);
    } finally {
      client.release();
    }
  
    await pool.end();