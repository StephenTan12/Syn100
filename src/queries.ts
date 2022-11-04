import pg from 'pg';
import dotenv from 'dotenv';
import errors from './errors';

dotenv.config();

// Database
const pool: pg.Pool = new pg.Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

// Queries
const getItem = (req, res, next) => {
  const id: number = parseInt(req.query.id as string);
  if (isNaN(id)) {
    next(errors.ERRORS.ItemIdNotInt);
  }

  pool
    .query('SELECT * FROM test WHERE id = $1;', [id])
    .then((results) => {
      if (results.rows.length == 0) {
        next(errors.ERRORS.ItemNotFound);
      }
      res.status(200).json(results.rows[0]);
    })
    .catch((err) => {
      next(err);
    });
};

export default {
  getItem,
};
