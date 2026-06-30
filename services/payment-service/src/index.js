const express = require('express');
const app = express();
app.use(express.json());

app.get('/payment-service', (req, res) => {
  res.json({ status: 'ok', service: 'payment-service' });
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log('payment-service running on port ' + PORT));
