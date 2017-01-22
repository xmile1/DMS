import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import routes from '../routes/index';

const app = express();
const router = express.Router();

// Log all requests
app.use(morgan('dev'));

// Parse incoming request body as JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// using express router for routes
routes(router);

// prefix /api for all routes
app.use('/api', router);

export default app;
