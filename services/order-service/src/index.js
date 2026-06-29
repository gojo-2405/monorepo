const express = require('express');
const app = express();
app.use(express.json());
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'order-service' }));
app.get('/orders', (req, res) => res.json({ orders: [] }));
app.post('/orders', (req, res) => res.json({ message: 'Order created' }));
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`Order Service running on port ${PORT}`));
