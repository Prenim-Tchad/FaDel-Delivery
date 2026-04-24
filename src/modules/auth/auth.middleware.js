import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma.js';

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token manquant.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const users = await prisma.$queryRawUnsafe(
      `
        SELECT
          "id",
          "firstname",
          "lastname",
          "phone",
          "name",
          "email",
          "role"::text AS "role",
          "isEmailVerified",
          "createdAt"
        FROM "User"
        WHERE "id" = $1
        LIMIT 1
      `,
      decoded.id,
    );

    const user = users[0];

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur introuvable.' });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: 'Token invalide.' });
  }
};

const checkVerified = (req, res, next) => {
  if (!req.user?.isEmailVerified) {
    return res.status(403).json({
      message: 'Veuillez verifier votre compte avant de continuer.',
      code: 'EMAIL_NOT_VERIFIED',
    });
  }

  return next();
};

export { checkVerified, protect };
