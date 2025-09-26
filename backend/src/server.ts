import {config} from 'dotenv'
config({ path: __dirname + '/../../.env' })
import express from 'express';
import path from 'path';
import { fetchOrdersList, fetchOrderDetails } from './services/manaPoolApi';
import { getMagusSuggestions, filterExistingCards, addPricingInfo } from './services/magusService';

const app = express();
const PORT = Number(process.env.PORT || 3000);
console.log({PORT})
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../dist')));

app.post('/api/orders', async (req, res) => {
  const { email, apiKey } = req.body;
  
  try {
    const data = await fetchOrdersList(email, apiKey);
    
    const detailedOrders = await Promise.all(
      data.orders.map((order: any) => fetchOrderDetails(order.id, email, apiKey))
    );
    
    res.json({ orders: detailedOrders });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/magus', async (req, res) => {
  const { cards, email, apiKey } = req.body;
  
  try {
    const suggestions = await getMagusSuggestions(cards);
    const filteredSuggestions = filterExistingCards(suggestions, cards);
    const finalSuggestions = await addPricingInfo(filteredSuggestions, email, apiKey);
    
    res.json({ suggestions: finalSuggestions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get suggestions from Magus' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});