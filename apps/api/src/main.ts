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
setUpLiveUpdates(frontend_io);

frontend_receiver_server.listen(process.env.CLIENT_WS_PORT, () => {
  console.log(
    `Frontend update Server is running on port ${process.env.CLIENT_WS_PORT}`
  );
});

const server = http.createServer(app);
const io = new Server(server);
setupSocketEvents(io, frontend_io);

server.listen(process.env.WS_PORT, () => {
  console.log(
    `Server is running on port ${process.env.WS_PORT}`
  );
});

const router = express.Router();
router.get('/', (req, res) => {
  res.send({ message: 'Working' });
});
router.get('/fuck', (req, res) => {
  res.send({
    fuck: database.shops.createShop({
      name: 'Fuck',
      description: 'Get your fucks here! Fresh fucks',
      position: {
        latitude: 1.0,
        longitude: 1.0,
      },
      image:
        'https://www.google.com/imgres?q=fuck%20off%20image&imgurl=https%3A%2F%2Fvoodooneon.com%2Fcdn%2Fshop%2Ffiles%2Ffuck-off-cool-white.jpg%3Fv%3D1699928832%26width%3D1445&imgrefurl=https%3A%2F%2Fvoodooneon.com%2Fproducts%2Ffuck-off&docid=96YF45Vy5GKCVM&tbnid=K9QzJaq1OZ6K2M&vet=12ahUKEwjhquvbic2MAxWBzTgGHZfCF3oQM3oECBcQAA..i&w=1445&h=1445&hcb=2&ved=2ahUKEwjhquvbic2MAxWBzTgGHZfCF3oQM3oECBcQAA',
      current_occupancy: 12,
      total_occupancy: 20,
    }),
  });
});
router.get('/get_shop/:id', async (req, res) => {
  const data = await database.shops.getShop(req.params.id);
  if (!data.success) {
    return res.send(data);
  }
  const response = await fetch('https://picsum.photos/200/300');
  data.result.rows[0].image = response.url;
  return res.send(data);
});
router.get('/get_queue/:id', async (req, res) => {
  res.send(await database.shop_queue.getQueue(Number(req.params.id)));
});

app.use('/api', router);
const port = Number(process.env.PORT);
const app_server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
app_server.on('error', console.error.bind(null, 'Server Error: '));
