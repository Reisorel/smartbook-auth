import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { ENV } from './config/env.config';
import routes from './routes/index.routes';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Route de test
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'SmartBookShop API is running! 🏄🏻‍♂️' });
});

// Routes API - Toutes préfixées par /api
app.use('/api', routes);

// Middleware 404 et gestion d'erreurs
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
