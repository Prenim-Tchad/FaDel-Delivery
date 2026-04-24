import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// 1. Initialisation du transporter en haut du fichier pour éviter les erreurs d'accès
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true', // true pour le port 465
  auth: { 
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASSWORD // Utilisation de la clé correcte du .env
  },
  tls: {
    rejectUnauthorized: false // Sécurité pour les connexions sur le port 465
  }
});

const hasWorkingSmtpConfig = () => {
  const requiredValues = [
    process.env.SMTP_HOST,
    process.env.SMTP_PORT,
    process.env.SMTP_USER,
    process.env.SMTP_PASSWORD,
  ];

  // Vérifie si une valeur est manquante
  if (requiredValues.some((value) => !value)) {
    return false;
  }

  // Vérifie si les valeurs sont encore celles par défaut
  return !['ton_id', 'ton_pass'].includes(process.env.SMTP_USER) &&
         !['ton_id', 'ton_pass'].includes(process.env.SMTP_PASSWORD);
};

const sendVerificationEmail = async ({ email, firstname, code, expiresInMinutes }) => {
  // Mode Développement : Si le SMTP n'est pas configuré, on log dans la console
  if (!hasWorkingSmtpConfig()) {
    console.log(`[DEV-MODE] SMTP non configuré. Code pour ${email}: ${code}`);
    return {
      mode: 'console',
      previewCode: code,
    };
  }

  try {
    // Mode Production : Envoi réel
    await transporter.sendMail({
      from: process.env.MAIL_FROM || '"FaDel App" <hello@prenim.co.uk>',
      to: email,
      subject: 'Votre code de vérification FaDel',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2>Bienvenue sur FaDel, ${firstname ?? ''} !</h2>
          <p>Merci de rejoindre la plateforme de livraison leader au Tchad.</p>
          <p>Utilisez le code ci-dessous pour vérifier votre compte :</p>
          <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #E63946;">${code}</p>
          <p>Ce code expire dans <strong>${expiresInMinutes ?? 10} minutes </strong>.</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p>Cliquez sur ce lien pour vérifier votre compte : <a href="${process.env.VERIFY_URL}?email=${email}&code=${code}" style="color: #E63946; text-decoration: underline;">Vérifier mon compte</a></p>
          <p style="font-size: 12px; color: #888;">Si vous n'avez pas demandé ce code, veuillez ignorer cet email.</p>
        </div>
      `,
    });

    console.log(`📧 Email envoyé avec succès à ${email} avec le code : ${code}`);
    return { mode: 'email' };

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    // En cas d'erreur SMTP, on log quand même le code pour ne pas bloquer le dev
    console.log(`[FALLBACK] Le mail n'a pas pu partir. Code pour ${email}: ${code}`);
    throw new Error('Impossible d\'envoyer l\'email de vérification');
  }
};

export { sendVerificationEmail };