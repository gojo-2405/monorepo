const express = require('express');
const app = express();
app.use(express.json());
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'product-service' }));
app.get('/products', (req, res) => res.json({ products: [] }));
app.post('/products', (req, res) => res.json({ message: 'Product created' }));
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Product Service running on port ${PORT}`));
