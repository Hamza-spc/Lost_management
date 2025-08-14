const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.listen(3001, () => {
  console.log('Test server is running on port 3001');
});




