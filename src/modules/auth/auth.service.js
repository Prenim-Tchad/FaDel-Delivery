import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma.js';
import { sendVerificationEmail } from './emailService.js';

const VERIFICATION_CODE_TTL_MINUTES = 10;

const userSelect = `
  SELECT
    "id",
    "firstname",
    "lastname",
    "phone",
    "name",
    "email",
    "password",
    "role"::text AS "role",
    "isEmailVerified",
    "verificationCodeHash",
    "verificationCodeExpiresAt",
    "createdAt"
  FROM "User"
`;

const hashVerificationCode = (code) =>
  crypto.createHash('sha256').update(code).digest('hex');

const generateVerificationCode = () =>
  crypto.randomInt(100000, 1000000).toString();

const buildUserPayload = (user) => ({
  id: user.id,
  firstname: user.firstname,
  lastname: user.lastname,
  phone: user.phone,
  name: user.name,
  email: user.email,
  isEmailVerified: user.isEmailVerified,
  role: user.role,
  createdAt: user.createdAt,
});

const findUserByEmail = async (email) => {
  const rows = await prisma.$queryRawUnsafe(
    `${userSelect} WHERE "email" = $1 LIMIT 1`,
    email,
  );
  return rows[0] ?? null;
};

const findUserById = async (id) => {
  const rows = await prisma.$queryRawUnsafe(
    `${userSelect} WHERE "id" = $1 LIMIT 1`,
    id,
  );
  return rows[0] ?? null;
};

const findUserByEmailOrPhone = async (email, phone) => {
  const rows = await prisma.$queryRawUnsafe(
    `${userSelect} WHERE "email" = $1 OR "phone" = $2 ORDER BY "createdAt" DESC LIMIT 1`,
    email,
    phone,
  );
  return rows[0] ?? null;
};

const issueVerificationCode = async (user) => {
  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + VERIFICATION_CODE_TTL_MINUTES * 60 * 1000);

  await prisma.$executeRawUnsafe(
    `
      UPDATE "User"
      SET
        "verificationCodeHash" = $2,
        "verificationCodeExpiresAt" = $3
      WHERE "id" = $1
    `,
    user.id,
    hashVerificationCode(code),
    expiresAt,
  );

  const delivery = await sendVerificationEmail({
    email: user.email,
    firstname: user.firstname,
    code,
    expiresInMinutes: VERIFICATION_CODE_TTL_MINUTES,
  });

  return { code, delivery, expiresAt };
};

const registerUser = async ({ firstname, lastname, phone, email, password }) => {
  if (!firstname || !lastname || !phone || !email || !password) {
    const error = new Error('firstname, lastname, phone, email et password sont obligatoires.');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await findUserByEmailOrPhone(email, phone);

  if (existingUser?.isEmailVerified) {
    const error = new Error('Un compte verifie existe deja avec cet email ou ce telephone.');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const name = `${firstname} ${lastname}`.trim();

  let user;

  if (existingUser) {
    const rows = await prisma.$queryRawUnsafe(
      `
        UPDATE "User"
        SET
          "firstname" = $2,
          "lastname" = $3,
          "phone" = $4,
          "name" = $5,
          "email" = $6,
          "password" = $7,
          "isEmailVerified" = false,
          "role" = $8::"Role"
        WHERE "id" = $1
        RETURNING
          "id",
          "firstname",
          "lastname",
          "phone",
          "name",
          "email",
          "password",
          "role"::text AS "role",
          "isEmailVerified",
          "verificationCodeHash",
          "verificationCodeExpiresAt",
          "createdAt"
      `,
      existingUser.id,
      firstname,
      lastname,
      phone,
      name,
      email,
      hashedPassword,
      existingUser.role ?? 'CLIENT',
    );
    user = rows[0];
  } else {
    const rows = await prisma.$queryRawUnsafe(
      `
        INSERT INTO "User" (
          "id",
          "firstname",
          "lastname",
          "phone",
          "name",
          "email",
          "password",
          "role",
          "isEmailVerified",
          "createdAt"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8::"Role", false, NOW())
        RETURNING
          "id",
          "firstname",
          "lastname",
          "phone",
          "name",
          "email",
          "password",
          "role"::text AS "role",
          "isEmailVerified",
          "verificationCodeHash",
          "verificationCodeExpiresAt",
          "createdAt"
      `,
      crypto.randomUUID(),
      firstname,
      lastname,
      phone,
      name,
      email,
      hashedPassword,
      'CLIENT',
    );
    user = rows[0];
  }

  const issued = await issueVerificationCode(user);

  return {
    message: 'Compte cree. Un code de verification a ete envoye.',
    email: user.email,
    requiresVerification: true,
    delivery: issued.delivery.mode,
    ...(issued.delivery.previewCode ? { devVerificationCode: issued.delivery.previewCode } : {}),
  };
};

const verifyEmailCode = async ({ email, code }) => {
  if (!email || !code) {
    const error = new Error('email et code sont obligatoires.');
    error.statusCode = 400;
    throw error;
  }

  const user = await findUserByEmail(email);

  if (!user) {
    const error = new Error("Aucun compte n'est associe a cet email.");
    error.statusCode = 404;
    throw error;
  }

  if (user.isEmailVerified) {
    return { message: 'Le compte est deja verifie.' };
  }

  if (!user.verificationCodeHash || !user.verificationCodeExpiresAt) {
    const error = new Error("Aucun code de verification actif n'a ete trouve.");
    error.statusCode = 400;
    throw error;
  }

  if (new Date(user.verificationCodeExpiresAt) < new Date()) {
    const error = new Error('Le code de verification a expire.');
    error.statusCode = 400;
    throw error;
  }

  if (user.verificationCodeHash !== hashVerificationCode(code)) {
    const error = new Error('Le code de verification est invalide.');
    error.statusCode = 400;
    throw error;
  }

  await prisma.$executeRawUnsafe(
    `
      UPDATE "User"
      SET
        "isEmailVerified" = true,
        "verificationCodeHash" = NULL,
        "verificationCodeExpiresAt" = NULL
      WHERE "id" = $1
    `,
    user.id,
  );

  const verifiedUser = await findUserById(user.id);

  return {
    message: 'Compte verifie avec succes. Vous pouvez maintenant vous connecter.',
    user: buildUserPayload(verifiedUser),
  };
};

const resendVerificationCode = async ({ email }) => {
  if (!email) {
    const error = new Error('email est obligatoire.');
    error.statusCode = 400;
    throw error;
  }

  const user = await findUserByEmail(email);

  if (!user) {
    const error = new Error("Aucun compte n'est associe a cet email.");
    error.statusCode = 404;
    throw error;
  }

  if (user.isEmailVerified) {
    return { message: 'Le compte est deja verifie.' };
  }

  const issued = await issueVerificationCode(user);

  return {
    message: 'Un nouveau code de verification a ete envoye.',
    delivery: issued.delivery.mode,
    ...(issued.delivery.previewCode ? { devVerificationCode: issued.delivery.previewCode } : {}),
  };
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error('email et password sont obligatoires.');
    error.statusCode = 400;
    throw error;
  }

  const user = await findUserByEmail(email);

  if (!user) {
    const error = new Error("Aucun compte n'existe avec cet email. Creez d'abord un compte.");
    error.statusCode = 404;
    error.extra = { shouldRegister: true };
    throw error;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    const error = new Error('Identifiants incorrects.');
    error.statusCode = 401;
    throw error;
  }

  if (!user.isEmailVerified) {
    const error = new Error("Votre compte n'est pas encore verifie. Confirmez le code envoye par email.");
    error.statusCode = 403;
    error.extra = {
      requiresVerification: true,
      email: user.email,
    };
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );

  return {
    message: "Connexion reussie. Affichez maintenant la page d'accueil.",
    nextRoute: '/home',
    token,
    user: buildUserPayload(user),
  };
};

const getCurrentUser = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    const error = new Error('Utilisateur introuvable.');
    error.statusCode = 404;
    throw error;
  }

  return buildUserPayload(user);
};

export {
  getCurrentUser,
  loginUser,
  registerUser,
  resendVerificationCode,
  verifyEmailCode,
};
