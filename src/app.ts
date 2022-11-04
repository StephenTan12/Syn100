import express from 'express';
import bodyParser from 'body-parser';
import db from './queries';
import errors from './errors';

const app = express();

// Middlware
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

const port = 3000;
app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
