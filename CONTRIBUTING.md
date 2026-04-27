# 🚀 Guide des Bonnes Pratiques - FaDel Delivery 2.0

Ce document définit les standards d'ingénierie pour l'équipe de **PrenimTchad**. L'objectif est d'assurer la clarté, la sécurité et la scalabilité du produit FaDel sous l'architecture NestJS.

---

## 🏗️ 1. Workflow GitHub (Le flux de travail)

Le projet utilise une stratégie de branches rigoureuse pour garantir la stabilité de la production.

* **Branches Permanentes :**
    * `main` : Branche de **Production**. Code stable et déployé. Verrouillée.
    * `developp` : Branche d'**Intégration**. C'est la source de vérité pour le développement.
* **Zéro Push Direct :** Interdiction de pusher directement sur `main` ou `developp`.
* **Branches de Fonctionnalités :** Toute nouvelle tâche commence par une branche créée à partir de `developp` :
    * `feat/nom_du_dev:nom-de-la-tache` (ex: `feat/order-module`)
    * `fix/nom_du_dev:nom-du-bug` (ex: `fix/login-padding`)
* **Pull Requests (PR) :** Une PR est obligatoire pour fusionner vers `developp`.
    * Assignez toujours le **Lead Developer (Tomté Hassane)** pour la revue.
    * La PR doit compiler sans erreur (`npm run build`) avant d'être validée.

---

## 📝 2. Standards de Documentation & API

### 🟢 Back-end (NestJS + Swagger)
Nous utilisons le module intégré `@nestjs/swagger` pour générer la documentation automatique.
-   **Décorateurs :** Chaque endpoint doit être décoré avec `@ApiOperation()`, `@ApiResponse()` et `@ApiTags()`.
-   **Validation :** Utilisez systématiquement des **DTOs** avec `class-validator` pour documenter et sécuriser les entrées.

### 🔵 Front-end (Flutter - DartDoc)
Chaque composant réutilisable et chaque service API doit être documenté.
-   **Triple slashs (///)** pour les commentaires de documentation Dart.
-   **Le Pourquoi avant le Comment :** Expliquez la logique métier complexe (ex: calcul des frais de livraison, gestion des stocks de gaz).
-   **Tags de suivi :** Utilisez `// TODO:`, `// FIXME:` ou `// HACK:` pour signaler les dettes techniques.

---

## 🔒 3. Architecture et Sécurité

* **Architecture Modulaire :** Chaque domaine métier (Gaz, Resto, Auth) doit résider dans son propre module (`src/modules/`). L'encapsulation est la priorité.
* **Secrets :** Ne jamais commiter de fichiers `.env`. Utilisez le fichier `.env.example` pour documenter les nouvelles variables (ex: `DATABASE_URL`, `JWT_SECRET`).
* **Prisma :** Toujours valider les changements de `schema.prisma` avec le Lead avant de générer une migration (`npx prisma migrate dev`).

---

## 📋 4. Gestion des Tâches (GitHub Projects)

1.  **Consulter le Tableau :** Chaque matin, vérifiez vos tâches dans l'onglet **Projects**.
2.  **Mise à jour :** Déplacez vos cartes de `Todo` vers `In Progress`.
3.  **Validation :** Une fois la PR ouverte, déplacez la carte dans `Review`. Le passage en `Done` se fait uniquement après le Merge du Lead dans `developp`.

---

## 💬 5. Style de Code & Commits

* **Conventional Commits :** Utilisez des messages explicites pour l'historique Git.
    * `feat:` pour les nouvelles fonctionnalités.
    * `fix:` pour les corrections de bugs.
    * `chore:` pour la maintenance (config, mise à jour de lib).
    * `refactor:` pour une amélioration du code sans changement de logique.
* **Review :** La revue de code est un moment d'apprentissage collectif. Soyez constructifs et bienveillants dans vos commentaires.
##  6.  Workflow de développement
1. **Feature** : Créez votre branche à partir de `developp` (`feat/ma-feature`).
2. **Pull Request** : Une fois terminé, ouvrez une PR vers `developp`.
3. **Validation** : Après revue par le Lead (Tomté), fusion dans `developp`.
4. **Release** : Périodiquement, `developp` est fusionnée dans `main` pour mise en production.
---
*Signé : Tomté Hassane - Lead Developer PrenimTchad*