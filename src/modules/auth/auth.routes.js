import express from 'express';
import auth from './auth.controller.js';
import { protect, checkVerified } from './auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Parcours complet d'inscription, verification email et connexion.
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Creer un compte utilisateur
 *     tags: [Auth]
 *     description: Cree un compte non verifie puis envoie un code a 6 chiffres par email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstname, lastname, phone, email, password]
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: Tchad
 *               lastname:
 *                 type: string
 *                 example: User
 *               phone:
 *                 type: string
 *                 example: "6666644"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test1@fadel.td
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Compte cree et code envoye
 *       409:
 *         description: Un compte verifie existe deja
 */
router.post('/register', auth.register);

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Confirmer un compte avec un code email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, code]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test1@fadel.td
 *               code:
 *                 type: string
 *                 example: "482913"
 *     responses:
 *       200:
 *         description: Compte verifie
 *       400:
 *         description: Code invalide ou expire
 */
router.post('/verify-email', auth.verifyEmail);

/**
 * @swagger
 * /auth/resend-code:
 *   post:
 *     summary: Renvoyer un code de verification
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test1@fadel.td
 *     responses:
 *       200:
 *         description: Nouveau code envoye
 */
router.post('/resend-code', auth.resendCode);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connecter un utilisateur verifie
 *     tags: [Auth]
 *     description: Si aucun compte n'existe, l'API renvoie un message pour creer un compte. Si le compte n'est pas verifie, l'API demande de confirmer le code email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test1@fadel.td
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Connexion reussie
 *       403:
 *         description: Compte non verifie
 *       404:
 *         description: Aucun compte existant
 */
router.post('/login', auth.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Recuperer l'utilisateur connecte
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil de l'utilisateur connecte
 *       401:
 *         description: Token manquant ou invalide
 */
router.get('/me', protect, auth.me);

router.post('/order-test', protect, checkVerified, (_req, res) => {
  res.json({ message: 'Commande reussie !' });
});

export default router;
