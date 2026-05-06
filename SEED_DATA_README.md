# 🍽️ Seed de Données: 10 Restaurants Fictifs à N'Djaména

## 📋 Résumé

Ce Pull Request ajoute un seed de données complet pour initialiser la base de données avec **10 restaurants fictifs** situés à N'Djaména, couvrant les 10 quartiers spécifiés. Chaque restaurant inclut des données réalistes : catégories, horaires, zones de livraison, photos, menus et propriétaires.

## ✨ Fonctionnalités Ajoutées

### 📍 10 Restaurants dans 10 Quartiers

1. **Le Marché du Désert** - Sabangali (Cuisine tchadienne)
2. **La Table du Sahel** - Amriguébé (Cuisine africaine)
3. **Bundu Burger** - Chagoua (Fast food)
4. **Resto Express** - Abena (Fast food)
5. **Cuisine Maison** - Walia (Cuisine africaine)
6. **Grillades de Toukra** - Toukra (Grillades)
7. **Saveurs de Boutalbagara** - Boutalbagara (Cuisine fusion)
8. **Farcha Restaurant** - Farcha (Cuisine tchadienne)
9. **Koundoul Délices** - Koundoul (Cuisine africaine)
10. **Bakara Palace** - Bakara (Grillades)

### 🎯 Données Incluses par Restaurant

#### Informations Générales
- ✅ Noms et descriptions uniques
- ✅ Adresses détaillées avec quartier
- ✅ Coordonnées GPS précises pour chaque quartier
- ✅ Numéros de téléphone (+235 XXX XXXX)
- ✅ Adresses email
- ✅ Logos et images de couverture (URLs Unsplash)

#### Catégories de Cuisine
- Cuisine tchadienne
- Cuisine africaine
- Fast food
- Grillades
- Cuisine fusion

#### Horaires d'Ouverture
- **Lundi-Jeudi**: 06:00 - 23:00
- **Vendredi**: 06:00 - 00:00 (minuit)
- **Samedi**: 07:00 - 00:00 (minuit)
- **Dimanche**: 07:00 - 22:00

#### Zones de Livraison
Chaque restaurant a 2 zones de livraison:
- **Zone centrale**: Livraison dans le quartier principal
  - Frais: 1000 XAF
  - Commande minimale: 5000 XAF
- **Zone étendue**: Livraison dans les quartiers adjacents
  - Frais: 2000 XAF
  - Commande minimale: 8000 XAF

#### Menus
- Chaque restaurant a 2-3 catégories de menu
- Entre 2-4 articles par catégorie
- Descriptions détaillées
- Prix variés (1200 - 6200 XAF)
- Allergènes spécifiés

#### Propriétaires
- 10 propriétaires uniques configurés comme partenaires
- Profils complets avec:
  - Emails uniques
  - Numéros de téléphone
  - Noms complets tchadiens
  - Statut de partenaire actif

## 📁 Fichiers Modifiés/Créés

### Fichiers Modifiés
- **[prisma/seed.ts](prisma/seed.ts)** - Script de seed principal avec données de 10 restaurants

### Fichiers Créés
- **[test/seed.e2e-spec.ts](test/seed.e2e-spec.ts)** - Tests de validation du seed

## 🧪 Tests Ajoutés

Le test e2e valide:
- ✅ 10 restaurants créés
- ✅ Tous les 10 quartiers couverts
- ✅ Coordonnées GPS valides
- ✅ Photos (logos et images de couverture)
- ✅ Horaires d'ouverture (7 jours)
- ✅ Zones de livraison (minimum 2 par restaurant)
- ✅ Menus et articles
- ✅ Propriétaires uniques
- ✅ Types de cuisine variés
- ✅ Données de contact valides (emails et téléphones)
- ✅ Adresses formatées correctement
- ✅ Distribution par quartier

### Exécuter les Tests

```bash
# Tester le seed uniquement
npm test -- --testPathPattern=seed

# Tous les tests
npm test
```

## 🚀 Comment Utiliser

### Prérequis
1. PostgreSQL doit être en cours d'exécution
2. Les variables d'environnement doivent être configurées dans `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/fadel_db?schema=public"
   ```

### Exécuter le Seed

```bash
# Générer le client Prisma (si nécessaire)
npm run db:generate

# Exécuter le seed
npm run db:seed
```

### Résultat Attendu
```
Seed start
Seed completed
```

## 📊 Données de Base de Données

### Modèles Utilisés
- **Profile** - Propriétaires des restaurants
- **CuisineCategory** - Catégories de cuisine
- **Restaurant** - Restaurants principaux
- **OpeningHours** - Horaires d'ouverture
- **DeliveryZone** - Zones de livraison
- **MenuCategory** - Catégories de menu
- **MenuItem** - Articles de menu

## 🔍 Validation des Données

Toutes les données respectent les contraintes:
- **Noms**: Uniques, descriptifs
- **Adresses**: Formatées avec quartier et ville
- **Téléphones**: Format +235 XXXX XXXX
- **Emails**: Format valide
- **Prix**: En XAF (francs CFA)
- **Coordonnées**: GPS réalistes pour N'Djaména
- **Horaires**: Au format HH:MM (24h)

## 💡 Notes Importantes

1. **Images**: Les URLs des photos proviennent de Unsplash (libres d'utilisation)
2. **Données Fictives**: Tous les restaurants, propriétaires et contacts sont fictifs
3. **Réalisme**: Les données reflètent la réalité culturelle et gastronomique du Tchad
4. **Scalabilité**: Le script peut être facilement étendu pour ajouter plus de restaurants

## 🔄 Migration

Pour utiliser ce seed:
1. Assurez-vous que les migrations Prisma sont appliquées
2. Exécutez le seed
3. Vérifiez les données via Prisma Studio: `npm run db:studio`

## 📝 Améliorations Futures

- [ ] Ajouter des images réelles au lieu d'URLs externes
- [ ] Ajouter des avis clients fictifs
- [ ] Ajouter des promotions et codes promo
- [ ] Ajouter des réservations de table d'exemple
- [ ] Ajouter des commandes d'exemple

## 🙋 Support

Pour toute question sur le seed ou les données:
1. Vérifiez les fichiers `prisma/seed.ts` et `test/seed.e2e-spec.ts`
2. Consultez la documentation Prisma: https://www.prisma.io/docs/orm/reference/prisma-cli-reference#seed
3. Vérifiez les migrations: `prisma/migrations/`

---

**Quartiers Couverts**: Sabangali • Amriguébé • Chagoua • Abena • Walia • Toukra • Boutalbagara • Farcha • Koundoul • Bakara

**Cuisines**: Tchadienne • Africaine • Fast food • Grillades • Fusion
