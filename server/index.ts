import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieSession from 'cookie-session';

const PORT = process.env.PORT || 8080;
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; //  30 * 24 hours = 30 days

dotenv.config();

import { globalErrorMiddleware, globalNotFoundMiddleware } from '@/middlewares';
import { mountRouter } from '@/routers';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);

app.use(
  cookieSession({
    name: process.env.COOKIE_NAME!,
    keys: [process.env.COOKIE_SECRET!],
    maxAge: COOKIE_MAX_AGE,
  }),
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1', mountRouter);

app.all('*', globalNotFoundMiddleware);
app.use(globalErrorMiddleware);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
