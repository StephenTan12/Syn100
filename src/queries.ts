import pg from 'pg';
import dotenv from 'dotenv';
import errors from './errors';

dotenv.config();

// Database
const pool: pg.Pool = new pg.Pool({
  user: process.env.USER_ID,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT,
});

// Queries
const getItem = async (req, res, next) => {
  const id: number = parseInt(req.query.id as string);
  if (isNaN(id)) {
    next(errors.ERRORS.ItemIdNotInt);
  }

  await pool
    .query('SELECT * FROM items LEFT JOIN production_stats USING (id) LEFT JOIN electricity_stats USING (id) WHERE id = $1;', [id])
    .then((results) => {
      if (results.rows.length == 0) {
        next(errors.ERRORS.ItemNotFound);
      }
      const unformattedResults = results.rows[0]
      const formattedResults = {
        "id": unformattedResults.id,
        "name": unformattedResults.name,
        "imgid": unformattedResults.imgid,
        "description": unformattedResults.description,
        "productionStats": {
          "steelIron": unformattedResults.steeliron,
          "cement": unformattedResults.cement,
          "plastic": unformattedResults.plastic,
          "glass": unformattedResults.glass,
          "latex": unformattedResults.latex,
          "rubber": unformattedResults.rubber,
          "copper": unformattedResults.copper
        },
        "productionStatsTotal": unformattedResults.productionstatstotal,
        "electricityStats": {
          "test": unformattedResults.test
        },
        "electricityStatsTotal": unformattedResults.electricitystatstotal
      }
      res.status(200).json(formattedResults);
    })
    .catch((err) => {
      next(err);
    });
};

export default {
  getItem,
};
