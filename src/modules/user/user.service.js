import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../../config/prisma.js';
import { sendVerificationEmail } from '../auth/emailService.js';

const createUser = async (userData) => {
  const { nom, prenom, email, telephone, motDePasse } = userData;

  const hashedPw = await bcrypt.hash(motDePasse, 10);
  const token = crypto.randomBytes(32).toString('hex');

  await prisma.user.create({
    data: {
      nom,
      prenom,
      email,
      telephone,
      motDePasse: hashedPw,
      verificationToken: token,
    },
  });

  sendVerificationEmail(email, token).catch((err) => console.error('Email Error:', err));

  return { message: 'Utilisateur cree. Verifiez vos emails.' };
};

const authenticateUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.motDePasse);
  if (!isMatch) return null;

  const token = jwt.sign(
    { id: user.id, email: user.email, roles: user.roles },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );

  return { token, isEmailVerified: user.isEmailVerified };
};

export { createUser, authenticateUser };
