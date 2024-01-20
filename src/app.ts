import express, { Request, Response } from 'express';
import session from 'express-session';
import { isAuthenticated, planitou } from './api-v1';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

export const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(session({
  secret: 'lovely-toddlers',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60000,
    secure: false
  }
}));
app.use(isAuthenticated);
app.use('/v1', planitou);
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send({ message: 'ok' });
});
