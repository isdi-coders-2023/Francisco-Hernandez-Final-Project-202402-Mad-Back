import { createServer } from 'http';
import { createApp, startApp } from './app.js';
import { dbConnect } from './tools/db.connect.js';
import 'dotenv/config';
import createDebug from 'debug';

const debug = createDebug('FP*:server');
debug('starting server');

const port = process.env.PORT ?? 3300;

const app = createApp();
const server = createServer(app);

dbConnect()
  .then((db) => {
    startApp(app, db);
    server.listen(port);
  })
  .catch((error) => {
    server.emit('error', error);
  });

server.on('listening', () => {
  console.log(`Server Express is running http://localhost:${port}`);
});
