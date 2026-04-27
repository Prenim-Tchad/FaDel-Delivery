# FaDel Delivery API

API backend pour l'application FaDel Delivery - Plateforme de livraison au Tchad.

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- npm ou yarn
- Base de données PostgreSQL (via Supabase)

### Installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd FaDel-Delivery
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration**
   Créer un fichier `.env` à la racine :
   ```env
   # Configuration serveur
   PORT=3000
   NODE_ENV=development

   # Base de données PostgreSQL
   DATABASE_URL="postgresql://user:password@localhost:5432/fadel_db"

   # Supabase
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # JWT
   JWT_SECRET=your-super-secret-key
   JWT_EXPIRES_IN=7d
   ```

4. **Démarrer en développement**
   ```bash
   npm run start:dev
   ```

L'API sera disponible sur `http://localhost:3000`

## 📚 Documentation API

La documentation Swagger est disponible sur : `http://localhost:3000/api`

### Endpoints principaux

#### 🔐 Authentification (`/auth`)

| Endpoint | Méthode | Description | Auth requis |
|----------|---------|-------------|-------------|
| `/auth/register` | POST | Inscription utilisateur | ❌ |
| `/auth/login` | POST | Connexion utilisateur | ❌ |
| `/auth/refresh` | POST | Rafraîchir token | ❌ |
| `/auth/logout` | POST | Déconnexion | ✅ |
| `/auth/profile` | GET | Récupérer profil | ✅ |

#### 👤 Profil (`/profile`)

| Endpoint | Méthode | Description | Auth requis |
|----------|---------|-------------|-------------|
| `/profile` | GET | Récupérer profil complet | ✅ |
| `/profile` | PATCH | Mettre à jour profil | ✅ |
| `/profile` | DELETE | Supprimer profil | ✅ |

## 🔧 Scripts disponibles

```bash
# Développement
npm run start:dev          # Démarrage avec hot-reload
npm run start:debug        # Démarrage en mode debug
npm run start:prod         # Démarrage en production

# Build
npm run build              # Compilation TypeScript
npm run format             # Formatage du code
npm run lint               # Vérification ESLint

# Tests
npm run test               # Tests unitaires
npm run test:e2e           # Tests end-to-end
npm run test:cov           # Tests avec couverture
```

## 🏗️ Architecture

```
src/
├── app.controller.ts       # Contrôleur principal
├── app.module.ts          # Module principal
├── app.service.ts         # Service principal
├── main.ts                # Point d'entrée
└── modules/
    ├── auth/              # Module d'authentification
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── auth.module.ts
    │   ├── guards/
    │   │   └── supabase-auth.guard.ts
    │   └── dto/
    │       ├── login.dto.ts
    │       ├── register.dto.ts
    │       └── update-profile.dto.ts
    └── profile/           # Module de gestion des profils
        ├── profile.controller.ts
        ├── profile.service.ts
        └── profile.module.ts
```

## 🔒 Sécurité

- **JWT Authentication** : Tokens d'accès et de rafraîchissement
- **Supabase Auth** : Gestion des utilisateurs et métadonnées
- **Validation** : DTOs avec class-validator
- **CORS** : Configuration pour le développement
- **Guards** : Protection des routes sensibles

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests avec couverture
npm run test:cov

# Tests end-to-end
npm run test:e2e
```

## 📦 Déploiement

### Variables d'environnement production

```env
NODE_ENV=production
PORT=3000
SUPABASE_URL=https://your-prod-project.supabase.co
SUPABASE_ANON_KEY=your-prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-prod-service-role-key
JWT_SECRET=your-production-jwt-secret
DATABASE_URL=your-production-database-url
```

### Build pour production

```bash
npm run build
npm run start:prod
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence UNLICENSED - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

---

**FaDel Delivery** - Livraison simplifiée au Tchad 🇹🇩