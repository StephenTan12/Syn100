import pg from 'pg';
import dotenv from 'dotenv';
import errors from './errors';

dotenv.config();

// Constants
const PRODUCTION_CONSTANTS = {
  "steelIron": 1.39,
  "cement": 0.59,
  "plastic": 2.6,
  "glass": 0.54,
  "latex": 0.54,
  "rubber": 0.74,
  "copper": 0.2,
  "silver": 196,
  "aluminum": 10.14,
  "textile": 25,
  "paper": 0.0028
}

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
      const productionStats = {
        "steelIron": unformattedResults.steeliron,
        "cement": unformattedResults.cement,
        "plastic": unformattedResults.plastic,
        "glass": unformattedResults.glass,
        "latex": unformattedResults.latex,
        "rubber": unformattedResults.rubber,
        "copper": unformattedResults.copper,
        "silver": unformattedResults.silver,
        "aluminum": unformattedResults.aluminum,
        "textile": unformattedResults.textile,
        "paper": unformattedResults.paper
      }

      let productionCost = 0
      for (const [key, value] of Object.entries(productionStats)) {
        productionCost += value * PRODUCTION_CONSTANTS[key]
      }
      
      const electricalCost = unformattedResults.electricitykwh * 0.001183 * 8760

      const formattedResults = {
        "id": unformattedResults.id,
        "name": unformattedResults.name,
        "imgid": unformattedResults.imgid,
        "description": unformattedResults.description,
        "productionStats": productionStats,
        "productionCost": productionCost,
        "electricityKWH": unformattedResults.electricitykwh,
        "electricityCost": electricalCost
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
