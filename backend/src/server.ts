import 'dotenv/config';
import app from './app';
import { ensureDatabaseSchema } from './config/database';

const PORT = process.env.PORT || 3001;

ensureDatabaseSchema()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Falha ao inicializar o banco de dados:', error);
    process.exit(1);
  });