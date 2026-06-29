const express = require('express');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

app.post('/auth/login', (req, res) => {
  res.json({ message: 'Login endpoint' });
});

app.post('/auth/register', (req, res) => {
  res.json({ message: 'Register endpoint' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
