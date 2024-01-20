import * as dotenv from 'dotenv';
dotenv.config();

import { app } from './app';

app.listen(process.env.API_PORT || '5000', () => {
  console.log(
    `The API server has successfully started. \nListening at ${process.env.APP_BASE_URL || 'http://localhost:5000'
    }`
  );
});
