/* eslint-disable global-require */
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import webpack from 'webpack';
import path from 'path';
import Routes from '../Routes/index';
import config from '../../webpack.config.dev';

const app = express();
const router = express.Router();

// Log all requests
app.use(morgan('dev'));

// Parse incoming request body as JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const compiler = webpack(config);
const env = process.env.NODE_ENV || 'development';

// bundle bundle frontend using webpack
if (env !== 'test') {
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));
}
app.use(require('webpack-hot-middleware')(compiler));

// using express router for routes
Routes(router);

// prefix /api for all routes
app.use('/api', router);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/index.html'));
});

export default app;
