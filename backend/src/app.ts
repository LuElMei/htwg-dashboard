import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import prisma from './db';

dotenv.config();

export const app = express();
const JWT_SECRET = process.env.JWT_SECRET ?? 'development-only-change-me';

interface AuthTokenPayload extends JwtPayload {
  userId: string;
  username: string;
}

interface AuthenticatedRequest extends Request {
  authUser?: AuthTokenPayload;
}

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

const createToken = (userId: string, username: string) =>
  jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: '2h' });

const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.header('Authorization');

  if (!authorization?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Kein gueltiger Authorization-Header vorhanden.' });
    return;
  }

  try {
    const token = authorization.slice('Bearer '.length);
    const payload = jwt.verify(token, JWT_SECRET);

    if (typeof payload === 'string' || !payload.userId || !payload.username) {
      throw new Error('Token enthaelt keine Benutzerdaten.');
    }

    req.authUser = payload as AuthTokenPayload;
    next();
  } catch {
    res.status(401).json({ error: 'Token ist ungueltig oder abgelaufen.' });
  }
};

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/register', async (req, res) => {
  const username = String(req.body.username ?? '').trim();
  const email = String(req.body.email ?? '').trim().toLowerCase();
  const password = String(req.body.password ?? '');

  if (username.length < 3 || !email.includes('@') || password.length < 8) {
    res.status(400).json({
      error: 'Username mindestens 3 Zeichen, gueltige E-Mail und Passwort mindestens 8 Zeichen.',
    });
    return;
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (existingUser) {
    res.status(409).json({ error: 'Username oder E-Mail ist bereits vergeben.' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: passwordHash,
    },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });

  res.status(201).json({ token: createToken(user.id, user.username) });
});

app.post('/api/auth/login', async (req, res) => {
  const username = String(req.body.username ?? '').trim();
  const password = String(req.body.password ?? '');
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ error: 'Username oder Passwort ist falsch.' });
    return;
  }

  res.json({ token: createToken(user.id, user.username) });
});

app.get('/api/auth/me', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.authUser!.userId },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });

  if (!user) {
    res.status(404).json({ error: 'Benutzer wurde nicht gefunden.' });
    return;
  }

  res.json({ user });
});

app.get('/api/meals', async (_req, res) => {
  try {
    const meals = await prisma.meal.findMany({
      include: { items: true },
      orderBy: { title: 'asc' },
    });

    res.json(
      meals.map(({ items, ...meal }) => ({
        ...meal,
        items: items.map((item) => item.name),
      })),
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Datenbankfehler beim Laden der Mensa-Daten.' });
  }
});

app.post('/api/meals', requireAuth, async (req, res) => {
  const { category, title, description, price, items } = req.body;

  if (!category || !title) {
    res.status(400).json({ error: 'Kategorie und Titel sind Pflichtfelder.' });
    return;
  }

  try {
    const newMeal = await prisma.meal.create({
      data: {
        category,
        title,
        description,
        price,
        items: Array.isArray(items)
          ? {
              create: items.map((itemName: string) => ({ name: itemName })),
            }
          : undefined,
      },
      include: { items: true },
    });

    res.status(201).json({
      ...newMeal,
      items: newMeal.items.map((item) => item.name),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fehler beim Speichern in der SQL-Datenbank.' });
  }
});

export const seedDatabase = async () => {
  const passwordHash = await bcrypt.hash('test1234', 12);

  await prisma.user.upsert({
    where: { username: 'testuser' },
    update: {
      email: 'testuser@htwg.local',
      password: passwordHash,
    },
    create: {
      username: 'testuser',
      email: 'testuser@htwg.local',
      password: passwordHash,
    },
  });

  if ((await prisma.meal.count()) === 0) {
    await prisma.meal.createMany({
      data: [
        {
          category: 'Seezeit-Teller',
          title: 'Seezeit-Teller',
          description: 'Schwaebisches Linsengericht mit Spaetzle und kleinem Blattsalat.',
          price: '3,80 EUR',
        },
        {
          category: 'Hin und Weg',
          title: 'Hin und Weg',
          description: 'Kichererbsen-Curry mit Bulgur und frischen Kraeutern.',
          price: '4,20 EUR',
        },
        {
          category: 'Kombinierbar',
          title: 'Kombinierbar',
          description: 'Gefluegel-Masala mit wuerziger Sauce.',
          price: '4,90 EUR',
        },
        {
          category: 'Dessert',
          title: 'Dessert',
          description: 'Joghurt mit Fruechten oder Schokopudding.',
          price: '1,50 EUR',
        },
      ],
    });

    const sideDish = await prisma.meal.create({
      data: {
        category: 'Beilagen',
        title: 'Beilagen',
        items: {
          create: ['MIE-Nudeln', 'Kartoffeln', 'Asiatisches Gemuese'].map((name) => ({
            name,
          })),
        },
      },
    });

    await prisma.meal.create({
      data: {
        category: 'Getraenke',
        title: 'Getraenke',
        items: {
          create: ['Wasser', 'Apfelschorle', 'Kaffee', 'Tee'].map((name) => ({ name })),
        },
      },
    });

    console.log(`Seed-Daten angelegt, inklusive Beilagen-ID ${sideDish.id}.`);
  }
};
