const express = require('express');
const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'cart-service' });
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => console.log('cart-service running on port ' + PORT));
