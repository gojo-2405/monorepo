const express = require('express');
const app = express();
app.use(express.json());
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'notification-service' }));
app.post('/notifications/send', (req, res) => res.json({ message: 'Notification sent' }));
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => console.log(`Notification Service running on port ${PORT}`));
