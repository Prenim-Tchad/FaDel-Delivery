# Schéma Prisma - FaDel Delivery

Schéma de base de données complet pour l'application FaDel Delivery avec toutes les entités relationnelles.

## 📊 Vue d'ensemble des entités

### Utilisateur & Authentification
- **Profile** - Profils utilisateurs (clients, partenaires, livreurs, admins)

### Restaurants & Cuisine
- **CuisineCategory** - Catégories de cuisine (Africaine, Italienne, Fast-food, etc.)
- **Restaurant** - Restaurants partenaires
- **OpeningHours** - Horaires d'ouverture par jour
- **DeliveryZone** - Zones de livraison avec frais personnalisés

### Menu & Produits
- **MenuCategory** - Catégories dans le menu (Entrées, Plats, Desserts)
- **MenuItem** - Articles du menu avec options détaillées
- **MenuModifierGroup** - Groupes de modificateurs (Taille, Sauce, etc.)
- **MenuModifierOption** - Options individuelles dans chaque groupe

## 🔗 Relations entre entités

```
Profile (1) ──── (N) Restaurant
    │
    └── CuisineCategory (1) ──── (N) Restaurant

Restaurant (1) ──── (N) OpeningHours
    │
    ├── (1) ──── (N) DeliveryZone
    │
    └── (1) ──── (N) MenuCategory (1) ──── (N) MenuItem (1) ──── (N) MenuModifierGroup (1) ──── (N) MenuModifierOption
```

## 📋 Détail des entités

### Profile
**Table:** `profiles`

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | String (UUID) | ID Supabase Auth | Primary Key |
| email | String | Email unique | Unique |
| fullName | String? | Nom complet | Optionnel |
| phone | String? | Numéro de téléphone | Optionnel |
| avatarUrl | String? | URL avatar | Optionnel |
| isAdmin | Boolean | Rôle administrateur | Default: false |
| isRider | Boolean | Rôle livreur | Default: false |
| isPartner | Boolean | Rôle partenaire | Default: false |
| isActive | Boolean | Compte actif | Default: true |
| createdAt | DateTime | Date création | Auto |
| updatedAt | DateTime | Date modification | Auto |

**Relations:**
- `restaurants: Restaurant[]` - Restaurants possédés

### CuisineCategory
**Table:** `cuisine_categories`

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | String | ID unique | Primary Key, CUID |
| name | String | Nom de la catégorie | Unique |
| description | String? | Description | Optionnel |
| imageUrl | String? | URL image | Optionnel |
| isActive | Boolean | Catégorie active | Default: true |
| sortOrder | Int | Ordre d'affichage | Default: 0 |
| createdAt | DateTime | Date création | Auto |
| updatedAt | DateTime | Date modification | Auto |

**Relations:**
- `restaurants: Restaurant[]` - Restaurants de cette catégorie

**Index:**
- `(isActive, sortOrder)` - Optimisation affichage

### Restaurant
**Table:** `restaurants`

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | String | ID unique | Primary Key, CUID |
| name | String | Nom du restaurant | Required |
| description | String? | Description | Optionnel |
| address | String | Adresse complète | Required |
| phone | String | Téléphone | Required |
| email | String? | Email | Unique, Optionnel |
| website | String? | Site web | Optionnel |
| logoUrl | String? | URL logo | Optionnel |
| coverImageUrl | String? | URL image couverture | Optionnel |
| latitude | Float? | Latitude GPS | Optionnel |
| longitude | Float? | Longitude GPS | Optionnel |
| city | String | Ville | Required |
| country | String | Pays | Default: "Chad" |
| isActive | Boolean | Restaurant actif | Default: true |
| isVerified | Boolean | Restaurant vérifié | Default: false |
| rating | Float | Note moyenne | Default: 0 |
| totalReviews | Int | Nombre d'avis | Default: 0 |
| deliveryFee | Float | Frais livraison (CFA) | Default: 0 |
| minimumOrder | Float | Commande minimum (CFA) | Default: 0 |
| estimatedDelivery | Int | Temps livraison (min) | Default: 30 |
| timezone | String | Fuseau horaire | Default: "Africa/Ndjamena" |
| createdAt | DateTime | Date création | Auto |
| updatedAt | DateTime | Date modification | Auto |

**Relations:**
- `owner: Profile` - Propriétaire (clé étrangère)
- `cuisineCategory: CuisineCategory` - Catégorie cuisine
- `openingHours: OpeningHours[]` - Horaires d'ouverture
- `deliveryZones: DeliveryZone[]` - Zones de livraison
- `menuCategories: MenuCategory[]` - Catégories de menu

**Index:**
- `(isActive, city)` - Recherche restaurants actifs par ville
- `(latitude, longitude)` - Requêtes géographiques
- `(rating)` - Tri par note
- `(ownerId)` - Restaurants par propriétaire
- `(cuisineCategoryId)` - Restaurants par catégorie

### OpeningHours
**Table:** `opening_hours`

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | String | ID unique | Primary Key, CUID |
| restaurantId | String | ID restaurant | Foreign Key |
| dayOfWeek | Int | Jour (0=Dim, 6=Sam) | Required |
| openTime | String | Heure ouverture (HH:MM) | Required |
| closeTime | String | Heure fermeture (HH:MM) | Required |
| isOpen | Boolean | Ouvert ce jour | Default: true |
| createdAt | DateTime | Date création | Auto |
| updatedAt | DateTime | Date modification | Auto |

**Relations:**
- `restaurant: Restaurant` - Restaurant associé

**Contraintes:**
- Unique: `(restaurantId, dayOfWeek)` - Un horaire par jour

**Index:**
- `(restaurantId, dayOfWeek)` - Optimisation requêtes

### DeliveryZone
**Table:** `delivery_zones`

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | String | ID unique | Primary Key, CUID |
| restaurantId | String | ID restaurant | Foreign Key |
| name | String | Nom de la zone | Required |
| description | String? | Description | Optionnel |
| coordinates | Json? | GeoJSON polygone | Optionnel |
| deliveryFee | Float | Frais supplémentaires | Default: 0 |
| minimumOrder | Float | Commande minimum | Default: 0 |
| isActive | Boolean | Zone active | Default: true |
| createdAt | DateTime | Date création | Auto |
| updatedAt | DateTime | Date modification | Auto |

**Relations:**
- `restaurant: Restaurant` - Restaurant associé

**Index:**
- `(restaurantId, isActive)` - Zones actives par restaurant

### MenuCategory
**Table:** `menu_categories`

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | String | ID unique | Primary Key, CUID |
| restaurantId | String | ID restaurant | Foreign Key |
| name | String | Nom catégorie | Required |
| description | String? | Description | Optionnel |
| imageUrl | String? | URL image | Optionnel |
| sortOrder | Int | Ordre d'affichage | Default: 0 |
| isActive | Boolean | Catégorie active | Default: true |
| createdAt | DateTime | Date création | Auto |
| updatedAt | DateTime | Date modification | Auto |

**Relations:**
- `restaurant: Restaurant` - Restaurant associé
- `menuItems: MenuItem[]` - Articles de cette catégorie

**Index:**
- `(restaurantId, isActive, sortOrder)` - Tri optimisé

### MenuItem
**Table:** `menu_items`

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | String | ID unique | Primary Key, CUID |
| menuCategoryId | String | ID catégorie menu | Foreign Key |
| name | String | Nom de l'article | Required |
| description | String? | Description | Optionnel |
| price | Float | Prix (CFA) | Required |
| imageUrl | String? | URL image | Optionnel |
| isAvailable | Boolean | Disponible | Default: true |
| isVegetarian | Boolean | Végétarien | Default: false |
| isVegan | Boolean | Vegan | Default: false |
| isGlutenFree | Boolean | Sans gluten | Default: false |
| isHalal | Boolean | Halal | Default: false |
| isKosher | Boolean | Casher | Default: false |
| preparationTime | Int? | Temps préparation (min) | Optionnel |
| calories | Int? | Calories | Optionnel |
| allergens | String[] | Allergènes | Array |
| ingredients | String[] | Ingrédients | Array |
| sortOrder | Int | Ordre d'affichage | Default: 0 |
| createdAt | DateTime | Date création | Auto |
| updatedAt | DateTime | Date modification | Auto |

**Relations:**
- `menuCategory: MenuCategory` - Catégorie parente
- `modifierGroups: MenuModifierGroup[]` - Groupes de modificateurs

**Index:**
- `(menuCategoryId, isAvailable, sortOrder)` - Tri optimisé
- `(isVegetarian, isVegan, isHalal)` - Filtres diététiques

### MenuModifierGroup
**Table:** `menu_modifier_groups`

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | String | ID unique | Primary Key, CUID |
| menuItemId | String | ID article menu | Foreign Key |
| name | String | Nom du groupe | Required |
| description | String? | Description | Optionnel |
| isRequired | Boolean | Obligatoire | Default: false |
| minSelections | Int | Sélections minimum | Default: 0 |
| maxSelections | Int? | Sélections maximum | Optionnel |
| sortOrder | Int | Ordre d'affichage | Default: 0 |
| createdAt | DateTime | Date création | Auto |
| updatedAt | DateTime | Date modification | Auto |

**Relations:**
- `menuItem: MenuItem` - Article associé
- `options: MenuModifierOption[]` - Options disponibles

**Index:**
- `(menuItemId, sortOrder)` - Tri optimisé

### MenuModifierOption
**Table:** `menu_modifier_options`

| Champ | Type | Description | Contraintes |
|-------|------|-------------|-------------|
| id | String | ID unique | Primary Key, CUID |
| modifierGroupId | String | ID groupe modificateur | Foreign Key |
| name | String | Nom de l'option | Required |
| description | String? | Description | Optionnel |
| price | Float | Prix supplémentaire (CFA) | Default: 0 |
| isAvailable | Boolean | Disponible | Default: true |
| sortOrder | Int | Ordre d'affichage | Default: 0 |
| createdAt | DateTime | Date création | Auto |
| updatedAt | DateTime | Date modification | Auto |

**Relations:**
- `modifierGroup: MenuModifierGroup` - Groupe parent

**Index:**
- `(modifierGroupId, isAvailable, sortOrder)` - Tri optimisé

## 🚀 Utilisation avec Prisma

### Génération du client
```bash
npx prisma generate
```

### Migration de la base
```bash
npx prisma migrate dev --name init
```

### Studio Prisma (interface graphique)
```bash
npx prisma studio
```

### Exemple d'utilisation
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Créer un restaurant
const restaurant = await prisma.restaurant.create({
  data: {
    name: 'Restaurant ABC',
    address: '123 Rue de la Paix, N\'Djamena',
    phone: '+23566123456',
    ownerId: 'user-uuid',
    cuisineCategoryId: 'category-uuid',
    // ... autres champs
  },
  include: {
    owner: true,
    cuisineCategory: true,
    openingHours: true,
    deliveryZones: true,
  }
})
```

## 📊 Optimisations

### Index stratégiques
- **Géolocalisation** : `(latitude, longitude)` pour recherches proches
- **Recherche** : `(isActive, city)` pour restaurants disponibles
- **Tri** : `sortOrder` sur toutes les entités ordonnées
- **Filtres** : Index composites pour combinaisons fréquentes

### Types de données optimisés
- **UUID** pour les IDs (compatibilité Supabase)
- **Float** pour coordonnées GPS et prix
- **Json** pour données géographiques complexes
- **Arrays** pour listes (allergènes, ingrédients)

### Contraintes d'intégrité
- **Foreign Keys** avec cascade delete approprié
- **Unique constraints** sur emails et noms de catégories
- **Check constraints** implicites via types et defaults

Ce schéma fournit une base solide pour l'application FaDel Delivery avec toutes les fonctionnalités nécessaires pour la gestion des restaurants, menus et livraisons ! 🇹🇩🍽️