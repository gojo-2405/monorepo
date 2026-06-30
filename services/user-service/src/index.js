const express = require('express');
const app = express();
app.use(express.json());

app.get('/user-service', (req, res) => {
  res.json({ status: 'ok', service: 'user-service' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log('user-service running on port ' + PORT));
