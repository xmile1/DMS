/* eslint-disable no-console */
import app from './server/config/app';

const port = process.env.PORT || 5000;
app.listen(port);
console.log(`Visit http://localhost:${port}`);
