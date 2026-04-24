import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import authRoutes from './modules/auth/auth.routes.js';
import productRoutes from './modules/product/product.routes.js';
import swaggerSpec from './config/swagger.js';

const app = express();
const isDevelopment = process.env.NODE_ENV !== 'production';

const corsOptions = {
  origin: isDevelopment ? true : 'https://votre-domaine-final.com',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));

app.use('/auth', authRoutes);
app.use('/products', productRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', security: 'CORS ACTIVE' });
});

export default app;
