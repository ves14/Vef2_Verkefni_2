import express from 'express';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { router } from './registration.js';

dotenv.config();

const {
  PORT: port = 3001,
} = process.env;

const app = express();

// TODO setja upp rest af virkni!
//Ná í index.ejs
app.set('view engine','ejs')
app.get('/', (req, res) => {
    res.render('index');
    
})

app.use(router);

// Verðum að setja bara *port* svo virki á heroku
app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
