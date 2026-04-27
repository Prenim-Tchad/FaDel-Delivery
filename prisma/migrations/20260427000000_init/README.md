# Migration Initiale - FaDel Delivery

## 📋 Vue d'ensemble

Cette migration crée la structure complète de la base de données PostgreSQL pour l'application FaDel Delivery.

**Date:** 2026-04-27  
**Version:** Init  
**Base:** PostgreSQL  

## 🏗️ Tables créées

### Utilisateur & Authentification
- **`profiles`** - Profils utilisateurs (clients, partenaires, livreurs)

### Restaurants & Cuisine
- **`cuisine_categories`** - Catégories de cuisine
- **`restaurants`** - Restaurants partenaires
- **`opening_hours`** - Horaires d'ouverture
- **`delivery_zones`** - Zones de livraison

### Menu & Produits
- **`menu_categories`** - Catégories de menu
- **`menu_items`** - Articles du menu
- **`menu_modifier_groups`** - Groupes de modificateurs
- **`menu_modifier_options`** - Options de modificateurs

## 🔧 Application de la migration

### Prérequis
- PostgreSQL 12+ installé et démarré
- Base de données `fadel_db` créée
- Utilisateur `admin` avec les droits nécessaires

### Variables d'environnement
Assurez-vous que le fichier `.env` contient :
```env
DATABASE_URL="postgresql://admin:password_a_changer@localhost:5432/fadel_db?schema=public"
```

### Commandes Prisma

```bash
# Appliquer la migration
npx prisma migrate deploy

# Générer le client Prisma
npx prisma generate

# Ouvrir Prisma Studio (interface graphique)
npx prisma studio
```

### Application manuelle (si nécessaire)

Si vous préférez appliquer la migration manuellement :

```bash
# Via psql
psql -U admin -d fadel_db -f prisma/migrations/20260427000000_init/migration.sql

# Ou via un outil graphique comme pgAdmin/DBeaver
# Exécutez le contenu du fichier migration.sql
```

## ✅ Validation

### Script de validation automatique

Le fichier `validate.sql` contient :
- Insertion de données de test
- Requêtes de validation des contraintes
- Vérification des index et clés étrangères

```bash
# Appliquer le script de validation
psql -U admin -d fadel_db -f prisma/migrations/20260427000000_init/validate.sql
```

### Vérifications manuelles

Après application, vérifiez :

1. **Tables créées :**
   ```sql
   \dt
   ```

2. **Index présents :**
   ```sql
   SELECT schemaname, tablename, indexname FROM pg_indexes WHERE schemaname = 'public';
   ```

3. **Contraintes actives :**
   ```sql
   SELECT conname, conrelid::regclass, pg_get_constraintdef(oid)
   FROM pg_constraint WHERE conrelid::regclass::text LIKE 'profiles%'
   OR conrelid::regclass::text LIKE 'restaurants%' ORDER BY conname;
   ```

## 🔄 Rollback (annulation)

Si nécessaire, pour annuler cette migration :

```sql
-- Supprimer toutes les tables (attention : données perdues)
DROP TABLE IF EXISTS
    "menu_modifier_options",
    "menu_modifier_groups",
    "menu_items",
    "menu_categories",
    "delivery_zones",
    "opening_hours",
    "restaurants",
    "cuisine_categories",
    "profiles"
CASCADE;

-- Supprimer la fonction trigger
DROP FUNCTION IF EXISTS update_updated_at_column();
```

## 📊 Données de test incluses

Le script de validation insère des données d'exemple :

- **1 catégorie cuisine** (Africaine)
- **1 profil partenaire**
- **1 restaurant** avec horaires et zone de livraison
- **1 catégorie menu** avec 1 article
- **1 groupe modificateur** avec 3 options (tailles)

## 🚨 Points d'attention

### Sécurité
- Changez le mot de passe par défaut `password_a_changer`
- Utilisez des mots de passe forts en production
- Configurez les droits utilisateurs appropriés

### Performance
- Les index sont optimisés pour les requêtes fréquentes
- Considérez des index supplémentaires selon vos besoins
- Surveillez les performances avec des données réelles

### Évolution
- Utilisez `prisma migrate dev` pour les futures migrations
- Testez toujours sur un environnement de développement
- Validez les migrations sur un environnement de staging

## 🐛 Dépannage

### Erreur de connexion
```
P1001: Can't reach database server
```
- Vérifiez que PostgreSQL est démarré
- Vérifiez l'URL de connexion dans `.env`
- Testez la connexion : `psql -U admin -d fadel_db`

### Erreur de droits
```
permission denied for table
```
- Vérifiez les droits de l'utilisateur `admin`
- Accordez les droits nécessaires :
  ```sql
  GRANT ALL PRIVILEGES ON DATABASE fadel_db TO admin;
  ```

### Migration déjà appliquée
```
Migration already applied
```
- Utilisez `prisma migrate reset` pour réinitialiser (⚠️ données perdues)
- Ou créez une nouvelle migration pour les changements

## 📞 Support

En cas de problème :
1. Vérifiez les logs Prisma : `npx prisma migrate dev --help`
2. Consultez la documentation : https://www.prisma.io/docs
3. Vérifiez l'état de la base : `npx prisma db push --preview-feature`