# Module Auth FaDel Delivery

Ce module fournit une authentification complète avec support pour Supabase et JWT RS256.

## Fonctionnalités

- ✅ Authentification Supabase (email/mot de passe)
- ✅ JWT RS256 avec clés asymétriques
- ✅ Guards NestJS pour protection des routes
- ✅ Système de rôles et permissions
- ✅ Décorateurs pour contrôle d'accès
- ✅ Gestion des tokens d'accès et de rafraîchissement

## Installation

```bash
npm install @nestjs/jwt @types/jsonwebtoken
```

## Configuration

Ajoutez ces variables d'environnement :

```env
# JWT RS256
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
JWT_ACCESS_TOKEN_EXPIRATION=15m
JWT_REFRESH_TOKEN_EXPIRATION=7d

# Supabase (optionnel)
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Utilisation

### 1. Protection d'une route avec JWT

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth';

@Controller('protected')
@UseGuards(JwtAuthGuard)
export class ProtectedController {
  @Get()
  getProtectedData() {
    return { message: 'Données protégées' };
  }
}
```

### 2. Contrôle d'accès par rôle

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard, Roles, UserRole } from '../auth';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  getAdminData() {
    return { message: 'Données admin' };
  }
}
```

### 3. Accès aux données utilisateur

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, CurrentUser } from '../auth';
import { UserPayload } from '../shared/types';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  @Get('profile')
  getProfile(@CurrentUser() user: UserPayload) {
    return { user };
  }
}
```

## Enums Disponibles

### UserRole
- `CUSTOMER` - Client
- `RESTAURANT_OWNER` - Propriétaire de restaurant
- `DELIVERY_DRIVER` - Livreur
- `ADMIN` - Administrateur
- `SUPER_ADMIN` - Super administrateur

### OrderStatus
- `PENDING` - En attente
- `CONFIRMED` - Confirmé
- `PREPARING` - En préparation
- `READY` - Prêt
- `IN_DELIVERY` - En livraison
- `DELIVERED` - Livré
- `CANCELLED` - Annulé
- `REFUNDED` - Remboursé

### DeliveryMode
- `DELIVERY` - Livraison
- `PICKUP` - À emporter
- `DINE_IN` - Sur place

### PaymentMethod
- `CASH` - Espèces
- `CARD` - Carte bancaire
- `MOBILE_MONEY` - Mobile Money
- `BANK_TRANSFER` - Virement bancaire
- `PAYPAL` - PayPal

### RestaurantStatus
- `ACTIVE` - Actif
- `INACTIVE` - Inactif
- `CLOSED` - Fermé
- `MAINTENANCE` - Maintenance
- `TEMPORARILY_CLOSED` - Fermé temporairement

### ItemAvailability
- `AVAILABLE` - Disponible
- `UNAVAILABLE` - Indisponible
- `OUT_OF_STOCK` - Rupture de stock
- `SEASONAL` - Saisonnier

## Génération des clés JWT RS256

```bash
# Générer une paire de clés RSA
openssl genrsa -out private_key.pem 2048
openssl rsa -in private_key.pem -pubout -out public_key.pem

# Convertir en format base64 pour les variables d'environnement
cat private_key.pem | base64 -w 0
cat public_key.pem | base64 -w 0
```

## Endpoints Auth

### POST /auth/signin-jwt
Connexion avec génération de tokens JWT.

### POST /auth/refresh
Rafraîchissement du token d'accès.

### POST /auth/signup
Inscription utilisateur.

### GET /auth/profile
Récupération du profil (protégé).

### POST /auth/signout
Déconnexion.