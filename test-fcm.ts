import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

// Chargement sécurisé de la clé JSON
const serviceAccountPath = path.resolve(process.env.FIREBASE_CREDENTIALS_PATH || './firebase-adminsdk.json');
const serviceAccount = require(serviceAccountPath);

// Initialisation unique
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

async function runTest() {
  console.log('--- 🚀 Démarrage du test FCM pour FaDel ---');

  const message = {
    notification: {
      title: 'Test Serveur FaDel',
      body: 'La connexion avec le backend est opérationnelle !',
    },
    topic: 'test_topic', 
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('✅ SUCCÈS : Message envoyé avec succès !');
    console.log('🆔 Message ID :', response);
  } catch (error) {
    console.error('❌ ERREUR détectée :');
    console.error(error);
  }
}

runTest();