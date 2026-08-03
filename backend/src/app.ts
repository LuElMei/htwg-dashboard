import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import prisma from './db';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import ical from 'node-ical';
import fs from'fs';

import axios from 'axios';
import * as cheerio from 'cheerio';

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

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Zu viele Anmeldeversuche. Bitte in 15 Minuten erneut versuchen.' },
  skip: () => process.env.NODE_ENV === 'test',
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/register', authLimiter ,async (req, res) => {
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

app.post('/api/auth/login', authLimiter, async (req, res) => {
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

const upload = multer({ dest: 'uploads/' });

app.post('/api/timetable/upload', requireAuth, upload.single('icsFile'), async (req: AuthenticatedRequest, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'Keine Datei hochgeladen.' });
    return;
  }

  try {
    const events = await ical.async.parseFile(req.file.path);
    const coursesToSave = [];

    for (const ev of Object.values(events)) {
      if (!ev) continue;

      if (ev.type === 'VEVENT') {
        const event = ev as any;

        const getVal = (field: any) => typeof field === 'object' && field !== null ? field.val : field;

        const summary = getVal(event.summary) || 'Unbekannt';
        const location = getVal(event.location) || 'Unbekannt';
        const start = event.start as Date;
        const end = event.end as Date;

        if (!start || !end) continue;

        let dayString = new Intl.DateTimeFormat('de-DE', { weekday: 'long' }).format(start);

        if (event.rrule) {
          const ruleStr = event.rrule.toString();
          if (ruleStr.includes('BYDAY=MO')) dayString = 'Montag';
          if (ruleStr.includes('BYDAY=TU')) dayString = 'Dienstag';
          if (ruleStr.includes('BYDAY=WE')) dayString = 'Mittwoch';
          if (ruleStr.includes('BYDAY=TH')) dayString = 'Donnerstag';
          if (ruleStr.includes('BYDAY=FR')) dayString = 'Freitag';
        }
        
        const timeString = `${start.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`;

        coursesToSave.push({
          subject: String(summary),
          room: String(location),
          day: dayString,
          time: timeString,
          userId: req.authUser!.userId,
        });
      }
    }

    await prisma.course.deleteMany({ where: { userId: req.authUser!.userId } });
    
    if (coursesToSave.length > 0) {
      await prisma.course.createMany({ data: coursesToSave });
    }

    fs.unlinkSync(req.file.path);

    res.status(200).json({ message: 'Stundenplan erfolgreich importiert!', count: coursesToSave.length });
  } catch (error) {
    console.error('Fehler beim Kalender-Upload:', error);
    res.status(500).json({ error: 'Fehler beim Verarbeiten der Kalenderdatei.' });
  }
});

app.get('/api/timetable', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userCourses = await prisma.course.findMany({
      where: { userId: req.authUser!.userId },
      orderBy: [
        { day: 'asc' }, 
        { time: 'asc' }
      ]
    });
    res.json(userCourses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fehler beim Laden des Stundenplans.' });
  }
});

app.get('/api/library', async (_req: Request, res: Response) => {
  try {
    // 1. Die echte Affluences JSONP-URL abfragen
    // (Füge hier deine genaue URL ein, die du im Network-Tab kopiert hast!)
    const response = await axios.get('https://webapi.affluences.com/api/fillRate?token=6r3Kuo6JjNhH9e&callback=callback_0', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      },
      timeout: 5000,
    });

    const rawData = response.data; // Der String mit "callback_0({...})"

    // 2. Den JSON-Teil aus dem callback_0(...) herausschneiden
    const jsonMatch = typeof rawData === 'string' ? rawData.match(/callback_\d+\((.*)\);?/s) : null;
    
    if (!jsonMatch || !jsonMatch[1]) {
      throw new Error('JSONP-Format konnte nicht geparst werden.');
    }

    // 3. Den extrahierten Text in ein echtes JavaScript-Objekt umwandeln
    const parsedData = JSON.parse(jsonMatch[1]);

    // 4. Werte herausholen
    const loadPercentage = typeof parsedData.progress === 'number' ? parsedData.progress : 0;
    const isClosed = parsedData.current_state?.state === 'closed_for_the_day';
    const statusText = parsedData.current_state?.localized_state ?? '';

    // Berechnen der Plätze (z. B. basierend auf 120 Gesamtsitzplätzen)
    const totalSeats = 120;
    const occupiedSeats = Math.round((loadPercentage / 100) * totalSeats);
    const freeSeats = isClosed ? 0 : totalSeats - occupiedSeats;

    // 5. Sauberes JSON an euer React-Frontend schicken
    res.json({
      loadPercentage,
      freeSeats,
      totalSeats,
      isClosed,
      statusText,
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Bibliotheks-Auslastung:', error);

    // Ausweichdaten (Fallback), falls die API nicht erreichbar ist
    res.json({
      loadPercentage: 65,
      freeSeats: 42,
      totalSeats: 120,
      isFallback: true,
    });
  }
});

// Noten des Users abrufen
app.get('/api/grades', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const grades = await prisma.grade.findMany({
      where: { userId: req.authUser!.userId },
    });
    res.json(grades);
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Laden der Noten.' });
  }
});

// Note für ein Fach speichern/aktualisieren
app.post('/api/grades', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { subject, grade } = req.body;

  if (!subject) {
    res.status(400).json({ error: 'Fach ist erforderlich.' });
    return;
  }

  try {
    const updatedGrade = await prisma.grade.upsert({
      where: {
        userId_subject: {
          userId: req.authUser!.userId,
          subject: String(subject),
        },
      },
      update: { grade: String(grade) },
      create: {
        subject: String(subject),
        grade: String(grade),
        userId: req.authUser!.userId,
      },
    });

    res.json(updatedGrade);
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Speichern der Note.' });
  }
});
