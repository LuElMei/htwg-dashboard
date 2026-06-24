import dotenv from 'dotenv';
import { app, seedDatabase } from './app';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

const startServer = async () => {
  await seedDatabase();
  app.listen(PORT, () => {
    console.log(`Backend laeuft auf http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Backend konnte nicht gestartet werden:', error);
  process.exit(1);
});
