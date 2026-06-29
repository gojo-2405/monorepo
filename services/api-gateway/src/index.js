const express = require('express');
const app = express();
app.use(express.json());
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'api-gateway' }));
app.get('/', (req, res) => res.json({ message: 'API Gateway', version: '1.0.0' }));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
