import express from 'express';
import pg from 'pg'

// TODO skráningar virkni
//Make a router for connection
export const router = express.Router;

const connectionString = 'postgres://vef2-2021:123@localhost/vef2-2021';
const pool = new pg.Pool({ connectionString });



