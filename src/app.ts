import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes';  // Updated to import the aggregated routes

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use aggregated routes
app.use('/api', routes);

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

export default app;
