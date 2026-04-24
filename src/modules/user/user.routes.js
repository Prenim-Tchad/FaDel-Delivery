import express from 'express';
const router = express.Router();
import userController from './user.controller.js';

/**
 * @swagger
 * /auth/register:
 * post:
 * summary: Inscription d'un nouvel utilisateur (Strict Auth)
 * description: Crée un compte utilisateur avec isEmailVerified à false et déclenche l'envoi du token de vérification.
 * tags: [User & Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [nom, prenom, email, telephone, motDePasse]
 * properties:
 * nom: { type: string, example: "Adamich" }
 * prenom: { type: string, example: "User" }
 * email: { type: string, example: "test@fadel.td" }
 * telephone: { type: string, example: "66000000" }
 * motDePasse: { type: string, example: "123456" }
 * responses:
 * 201:
 * description: Utilisateur créé avec succès.
 * content:
 * application/json:
 * example: { "message": "Utilisateur créé. Vérifiez vos emails." }
 * 400:
 * description: Erreur de validation ou email déjà utilisé.
 * 501:
 * description: Erreur serveur lors de la création ou de l'envoi du mail.
 */
router.post('/register', userController.register);

/**
 * @swagger
 * /auth/login:
 * post:
 * summary: Connexion utilisateur
 * description: Authentifie l'utilisateur et retourne un JWT incluant le statut de vérification.
 * tags: [User & Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [email, motDePasse]
 * properties:
 * email: { type: string, example: "test@fadel.td" }
 * motDePasse: { type: string, example: "123456" }
 * responses:
 * 200:
 * description: Succès. Retourne le token JWT.
 * 401:
 * description: Identifiants invalides.
 * 501:
 * description: Erreur interne du service d'auth.
 */
router.post('/login', userController.login);

export default router;