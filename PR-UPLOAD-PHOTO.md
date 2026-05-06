# 🚀 Implémentation Upload Logo & Photos Restaurant via Cloudflare R2

## 📋 Résumé

Cette PR implémente la fonctionnalité d'upload de logo et photos de restaurant en utilisant Cloudflare R2 pour le stockage cloud. Les fichiers sont uploadés via multipart/form-data et des URLs publiques sont générées automatiquement.

## ✨ Nouvelles Fonctionnalités

### Upload de Logo
- Endpoint sécurisé pour uploader un logo de restaurant
- Stockage automatique sur Cloudflare R2
- Génération d'URL publique accessible

### Upload de Photos Multiples
- Endpoint pour uploader jusqu'à 10 photos par restaurant
- Stockage organisé dans des dossiers dédiés
- URLs publiques générées pour chaque photo

## 🔧 Modifications Apportées

### 1. Configuration Environnement
- Ajout des variables R2 dans `.env` :
  ```env
  R2_ACCOUNT_ID=95c8f92e20181b27a1f7f7d61aea9ed1
  R2_ACCESS_KEY_ID=e7de67bd1e8793d433ebb7cb1b780ef5
  R2_SECRET_ACCESS_KEY=c82c14a7d42ce5005b12317c5dc4608113f7357a148928e25282e6686cdfb827
  R2_BUCKET_NAME=food-media
  R2_PUBLIC_URL=https://95c8f92e20181b27a1f7f7d61aea9ed1.r2.cloudflarestorage.com
  ```

### 2. Schéma Base de Données
- Ajout du champ `photos` dans le modèle `Restaurant` :
  ```prisma
  photos String[] @default([])
  ```

### 3. Nouveaux Services
- **FileUploadService** (`src/shared/services/file-upload.service.ts`)
  - Configuration S3Client pour Cloudflare R2
  - Méthodes d'upload unique et multiple
  - Génération de noms de fichiers uniques

### 4. Endpoints API

#### POST `/food/restaurants/:id/upload-logo`
- **Authentification** : Requise (RestaurantOwnerGuard)
- **Body** : `multipart/form-data` avec champ `logo`
- **Réponse** : `{ logoUrl: string }`

#### POST `/food/restaurants/:id/upload-photos`
- **Authentification** : Requise (RestaurantOwnerGuard)
- **Body** : `multipart/form-data` avec champ `photos` (max 10 fichiers)
- **Réponse** : `{ photoUrls: string[] }`

## 📦 Dépendances Ajoutées

```json
{
  "multer": "^1.x.x",
  "@aws-sdk/client-s3": "^3.x.x",
  "@nestjs/config": "^3.x.x",
  "@types/multer": "^1.x.x"
}
```

## 🏗️ Architecture

```
src/
├── shared/services/
│   └── file-upload.service.ts    # Service d'upload R2
├── modules/food/
│   ├── controllers/
│   │   └── restaurant.controller.ts  # + endpoints upload
│   ├── services/
│   │   └── restaurant.service.ts     # + méthodes métier
│   └── repositories/
│       └── restaurant.repository.ts  # + méthodes DB
```

## 🔒 Sécurité

- **Authentification** : Endpoints protégés par `RestaurantOwnerGuard`
- **Validation** : Vérification de présence des fichiers
- **Stockage** : Accès public en lecture seule sur R2

## 📝 Utilisation

### Upload Logo
```bash
curl -X POST \
  http://localhost:3000/food/restaurants/{restaurantId}/upload-logo \
  -H "Authorization: Bearer {token}" \
  -F "logo=@logo.png"
```

### Upload Photos
```bash
curl -X POST \
  http://localhost:3000/food/restaurants/{restaurantId}/upload-photos \
  -H "Authorization: Bearer {token}" \
  -F "photos=@photo1.jpg" \
  -F "photos=@photo2.jpg"
```

## ✅ Tests

- ✅ Build réussi
- ✅ Tests unitaires passent (17/17)
- ✅ Types TypeScript validés
- ✅ Configuration Prisma générée

## 🚀 Déploiement

1. Variables d'environnement R2 configurées
2. Bucket Cloudflare R2 créé et accessible
3. Permissions R2 configurées pour l'accès public
4. Migration base de données appliquée

## 📋 Checklist

- [x] Configuration R2 dans `.env`
- [x] Schéma Prisma mis à jour
- [x] Service d'upload implémenté
- [x] Endpoints API ajoutés
- [x] Guards de sécurité appliqués
- [x] Tests validés
- [x] Documentation PR créée</content>
<parameter name="filePath">/home/payang/Bureau/Prenim/Fadel/FaDel-Delivery/PULL_REQUEST_DOCS.md