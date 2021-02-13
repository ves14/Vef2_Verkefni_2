import express from 'express';
import dotenv from 'dotenv';
import join,__dirname from 'path';
import url from ''

dotenv.config();

const {
  PORT: port = 3070,
} = process.env;

const app = express();

// TODO setja upp rest af virkni!
//Ná í index.ejs
app.set('view engine','ejs')
app.get('/', (req, res) => {
    res.render('index');
    
})

// Verðum að setja bara *port* svo virki á heroku
app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
