import express from 'express';
import * as path from 'path';

import database, { ensureTables } from '@hackmol/database'
import { AI } from './ai';

ensureTables()

new AI()
  .onOpen(() => {return})
  .onClose(() => {return});

const app = express();
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const router = express.Router()
router.get('/', (req, res) => {
  res.send({ message: 'Working' });
});
router.get('/fuck', (req, res) => {
  res.send({
    fuck: database.shops.createShop({
      name:'Fuck',
      description: 'Get your fucks here! Fresh fucks',
      position: {
        latitude: 1.0,
        longitude: 1.0,
      },
      image: 'https://www.google.com/imgres?q=fuck%20off%20image&imgurl=https%3A%2F%2Fvoodooneon.com%2Fcdn%2Fshop%2Ffiles%2Ffuck-off-cool-white.jpg%3Fv%3D1699928832%26width%3D1445&imgrefurl=https%3A%2F%2Fvoodooneon.com%2Fproducts%2Ffuck-off&docid=96YF45Vy5GKCVM&tbnid=K9QzJaq1OZ6K2M&vet=12ahUKEwjhquvbic2MAxWBzTgGHZfCF3oQM3oECBcQAA..i&w=1445&h=1445&hcb=2&ved=2ahUKEwjhquvbic2MAxWBzTgGHZfCF3oQM3oECBcQAA',
      current_occupancy: 12,
      total_occupancy: 20,
    })
  });
})

app.use('/api', router);
const port = Number(process.env.PORT);
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error.bind(null, "Server Error: "));