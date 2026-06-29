const express = require('express');
const app = express();
app.use(express.json());
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'user-service' }));
app.get('/users', (req, res) => res.json({ users: [] }));
app.post('/users', (req, res) => res.json({ message: 'User created' }));
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
