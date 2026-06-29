const express = require('express');
const app = express();
app.use(express.json());
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'reporting-service' }));
app.get('/reports', (req, res) => res.json({ reports: [] }));
app.post('/reports/generate', (req, res) => res.json({ message: 'Report generated' }));
const PORT = process.env.PORT || 3007;
app.listen(PORT, () => console.log(`Reporting Service running on port ${PORT}`));
