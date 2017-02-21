/* eslint-disable no-console */
import app from './server/config/app';

const port = process.env.PORT || 5000;
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    // open(`http://localhost:${port}`);
    console.log(`App running at http://localhost:${port}`);
  }
});
