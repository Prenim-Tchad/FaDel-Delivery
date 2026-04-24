import { PrismaClient } from './prisma/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/fadel_db';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

async function serveHome(res: any) {
  try {
    const page = await readFile(join(__dirname, 'public', 'index.html'), 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(page);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Failed to load homepage.');
  }
}

async function serveStatus(res: any) {
  try {
    await prisma.$connect();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', database: 'connected' }));
  } catch (error) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', database: 'unavailable' }));
  } finally {
    await prisma.$disconnect();
  }
}

function createAppServer() {
  return createServer(async (req, res) => {
    if (!req.url) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }

    if (req.url === '/') {
      await serveHome(res);
      return;
    }

    if (req.url === '/api/status') {
      await serveStatus(res);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  });
}

function startServer(desiredPort: number) {
  const server = createAppServer();

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = desiredPort + 1;
      console.warn(`Port ${desiredPort} is already in use. Trying port ${nextPort} instead...`);
      startServer(nextPort);
      return;
    }
    console.error('Server error:', err);
    process.exit(1);
  });

  server.listen(desiredPort, () => {
    console.log(`FaDel-Delivery homepage available at http://localhost:${desiredPort}`);
  });
}

startServer(port);
