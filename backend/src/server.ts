// backend/src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './db';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/meals', async (req, res) => {
  try {
    const meals = await prisma.meal.findMany({
      include: {
        items: true
      }
    });
    res.json(meals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Datenbankfelhler beim Laden der Mensa-Daten'});
  }
});

app.post('/api/meals', async (req, res) => {
  const {category, title, description, price, items } = req.body;

  try {
    const newMeal = await prisma.meal.create({
      data: {
        category,
        title,
        description,
        price,
        items: items ? {
          create: items.map((itemName: string) => ({ name: itemName }))
        } : undefined
      },
      include: { items: true }
    });
    res.status(201).json(newMeal);
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Speichern in der SQL-Datenbank' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log( ` Echtes SQL-Backend läuft auf http://localhost:${PORT} `);
});