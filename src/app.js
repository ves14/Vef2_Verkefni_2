import express from 'express';
import dotenv from 'dotenv';
import { router } from './registration.js';

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(router);

function errorHandler(err,req, res, next) { // eslint-disable-line
  console.error(err); // eslint-disable-line
  res.send('error');
  next()
}

app.use(errorHandler);

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  res.render('index');
  
})
const {
  PORT: port = 3000,
} = process.env;

app.listen(port, () => {
  console.info(`App running on http://localhost:${port}`); // eslint-disable-line
});