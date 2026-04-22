import express from 'express';
import cors from 'cors';

import { env } from './config/index.js';
import apiRouter from './routes/index.js';
import { errorMiddleware } from './middleware/index.js';

const app = express();

app.set('trust proxy', 1);

app.use(cors({ origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN }));
app.use(express.json());

app.use('/api', apiRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorMiddleware);

export default app;
