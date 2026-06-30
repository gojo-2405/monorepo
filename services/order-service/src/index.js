const express = require('express');
const app = express();
app.use(express.json());

app.get('/order-service', (req, res) => {
  res.json({ status: 'ok', service: 'order-service' });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log('order-service running on port ' + PORT));
