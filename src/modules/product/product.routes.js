import express from 'express';
import cors from 'cors';
const router = express.Router();
import productController from './product.controller.js';
import { protect, checkVerified } from '../auth/auth.middleware.js';

// Lecture publique du catalogue
router.get('/', productController.list);

// Création et Modification protégées (Vérification email requise)
router.post('/', protect, checkVerified, productController.create);
router.patch('/:id/stock', protect, checkVerified, productController.updateStock);

export default router;