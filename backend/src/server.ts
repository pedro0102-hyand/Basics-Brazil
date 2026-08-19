import express from 'express';

const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
  res.send('API do e-commerce está no ar 🚀');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});