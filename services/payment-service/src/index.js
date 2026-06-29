const express = require('express');
const app = express();
app.use(express.json());
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'payment-service' }));
app.post('/payments/process', (req, res) => res.json({ message: 'Payment processed' }));
app.get('/payments/:id', (req, res) => res.json({ payment: {} }));
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Payment Service running on port ${PORT}`));
