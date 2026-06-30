const express = require('express');
const app = express();
app.use(express.json());

app.get('/auth-service', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('auth-service running on port ' + PORT));
