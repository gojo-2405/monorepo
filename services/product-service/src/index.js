const express = require('express');
const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'product-service' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log('product-service running on port ' + PORT));
