import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, World by final-project!');
});

app.listen(process.env.PORT || 8080)