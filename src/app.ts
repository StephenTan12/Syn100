import express from 'express';
import bodyParser from 'body-parser';
import db from './queries';
import errors from './errors';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middlware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get('/item', db.getItem);

// Error handling
app.use((err, req, res, next) => {
  const message: string = errors.ERRORLOOKUP.get(err).message;

  res.status(400);
  res.json({ message: message });
});

const port: number = parseInt(process.env.SERVER_PORT);
const ip: string = process.env.SERVER_IP;

app.listen(port, ip, () => {
  return console.log(`Express is listening at ${ip}:${port}`);
});
