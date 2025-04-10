import express from 'express';
import * as path from 'path';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

import { setupSocketEvents, setUpLiveUpdates } from './events';
import database, { ensureTables } from '@hackmol/database';

ensureTables();

const app = express();
app.use(
  cors({
    origin: process.env.EXPO_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.options('*', cors());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const frontend_receiver_server = http.createServer(app);
const frontend_io = new Server(frontend_receiver_server);
setUpLiveUpdates(frontend_io, 'frontend');

const admin_receiver_server = http.createServer(app);
const admin_io = new Server(admin_receiver_server);
setUpLiveUpdates(admin_io, 'admin');

const server = http.createServer(app);
const io = new Server(server);
setupSocketEvents(io, frontend_io, admin_io);

frontend_io.on('connection', (socket) => {
    socket.on('get_shop', async (shop_id) => {
      const data = await database.shops.getShop(shop_id);
      if (!data.success) {
        return socket.emit('get_shop', data);
      }
      const response = await fetch('https://picsum.photos/200/300');
      data.result.rows[0].image = response.url;

      return socket.emit('get_shop_result', data);
    });
    socket.on('get_shop_queue', async (shop_id) => {
      const data = await database.shop_queue.getQueue(shop_id);
      if (!data.success) {
        return socket.emit('get_shop_queue', data);
      }
      return socket.emit('get_shop_queue_result', data);
    });
});

frontend_receiver_server.listen(process.env.CLIENT_WS_PORT, () => {
  console.log(
    `Frontend update Server is running on port ${process.env.CLIENT_WS_PORT}`
  );
});

admin_receiver_server.listen(process.env.ADMIN_WS_PORT, () => {
  console.log(
    `Admin update Server is running on port ${process.env.CLIENT_WS_PORT}`
  );
});

server.listen(process.env.WS_PORT, () => {
  console.log(
    `Server is running on port ${process.env.WS_PORT}`
  );
});