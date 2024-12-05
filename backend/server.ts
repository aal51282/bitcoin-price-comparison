import express from 'express';
import cors from 'cors';
import { getOffers } from './providers';

const app = express();
const port = 3000;

app.use(cors());

app.get('/offers', async (req, res) => {
  try {
    const amount = Number(req.query.amount) || 100;
    const offers = await getOffers(amount);
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching offers' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
