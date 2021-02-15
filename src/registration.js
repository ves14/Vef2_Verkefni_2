import express from 'express';
import { body, validationResult } from 'express-validator';
import pg from 'pg';
import {connectionString} from './db.js';

export const router = express.Router();

const ktPattern = '^[0-9]{6}-?[0-9]{4}$';

const pool = new pg.Pool({ connectionString });
console.info(connectionString);
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

function getInfo() {
  return {
    name: '',
    kt: '',
    allErrors: [],
  };
}

async function getSignatures() {
  console.info('Does pool work? reg*.js:26');
  const client = await pool.connect();
  console.info('Yes! reg*.js:26');
  const query = 'SELECT * FROM signatures;';
  let data = [];
  try {
    const result = await client.query(query);
    data = result.rows;
  } catch (e) {
    console.error('Error selecting', e);
  } finally {
    client.release();
  }
  return data;
}
const sign = async (signature) => {
  console.info('Does pool work? reg*.js:42');
  const client = await pool.connect();
  console.info('Does pool work? reg*.js:44');
  const query = 'INSERT INTO public.signatures(name, nationalid, comment, anonymous) values($1, $2, $3, $4) returning *;';
  try {
    await client.query(query, signature);
  } catch (e) {
    if (e.code === '23505' && e.constraint === 'signatures_nationalid_key') {
      return -1;
    }
    console.error('Error selecting', e.code);
    client.release;
  return 0;
};

router.get('/', async (req, res, next) => { // eslint-disable-line
  try{
    const regInfo = getInfo();
    const signatures = await getSignatures();
    console.info("Error gone?: regi*.js:61");
    res.render('html', { regInfo, signatures });
  }
  catch(e){
    console.info('Error in router')
  }

});

router.post('/',
  body('name')
    .isLength({ min: 1 })
    .withMessage('Nafn verður að vera lengra en 1 stafur'),
  body('name')
    .isLength({ max: 128 })
    .withMessage('Nafnnið þarf að vera minna en 128 stafir.'),
  body('kt')
    .matches(ktPattern)
    .withMessage('Kennitala verður að vera á forminu 0000000000 eða 000000-0000'),
  body('comment')
    .isLength({ max: 512 })
    .withMessage('Athugasemd getur ekki verið meira en 512 stafir'),

  async (req, res, next) => { // eslint-disable-line
    const regInfo = getInfo();
    let signatures = await getSignatures();

    const {
      name,
      kt,
      comment,
      anon,
    } = req.body;


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach((err) => {
        if (err.param === 'kt') {
          regInfo.kt_invalid = true;
        }
        if (err.param === 'name') {
          regInfo.name_invalid = true;
        }
      });
      regInfo.name = regInfo.name_invalid ? '' : name;
      regInfo.kt = regInfo.kt_invalid ? '' : kt;
      regInfo.errors = errors.array();
      res.render('index', { regInfo, signatures });
      return;
    }

    const result = await sign([name, kt, comment, anon]);
    if (result !== 0) {
      res.redirect('/error');
      return;
    }
    signatures = await getSignatures();
    res.render('html', { regInfo, signatures });
  })};
