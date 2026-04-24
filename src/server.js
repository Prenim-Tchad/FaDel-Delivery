// Test de santé de l'API
import app from './app.js';
import prisma from './config/prisma.js';

const PORT = process.env.PORT || 3000;

// Route de Health Check
app.get('/health', async (req, res) => {
  try {
    // On teste la connexion à PostgreSQL avec un timeout court
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'UP',
      database: 'CONNECTED',
      message: 'Le serveur FaDel et la base de données sont opérationnels',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'DOWN',
      database: 'ERROR',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Lancement du serveur
const server = app.listen(PORT, () => {
  console.log(`🚀 Serveur FaDel démarré sur http://localhost:${PORT}`);
});

// Gestion propre de l'arrêt (Graceful Shutdown)
process.on('SIGTERM', async () => {
  console.log('Fermeture du serveur...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Serveur arrêté.');
  });
}); 
