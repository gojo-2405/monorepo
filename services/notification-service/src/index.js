const express = require('express');
const app = express();
app.use(express.json());

app.get('/notification-service', (req, res) => {
  res.json({ status: 'ok', service: 'notification-service' });
});

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => console.log('notification-service running on port ' + PORT));
