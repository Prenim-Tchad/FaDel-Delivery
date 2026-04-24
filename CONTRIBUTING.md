# 🚀 Guide des Bonnes Pratiques - Projet FaDel

Ce document définit les standards de développement pour l'équipe de **PrenimTchad**. L'objectif est d'assurer la clarté, la sécurité et la scalabilité du produit FaDel.

---

## 🏗️ 1. Workflow GitHub (Le flux de travail)

* **Zéro Push Direct :** Interdiction de pusher directement sur `main` ou `develop`.
* **Branches :** Toute nouvelle tâche commence par une branche :
    * `feature/nom-de-la-tache` (ex: `feature/auth-api`)
    * `fix/nom-du-bug` (ex: `fix/login-padding`)
* **Pull Requests (PR) :** Une PR est obligatoire pour fusionner vers `develop`. 
    * Assignez toujours le **Lead Dev** pour la revue.
    * Liez l'Issue correspondante (ex: "Closes #12").

---

## 📝 2. Standards de Documentation

### 🟢 Back-end (Swagger/OpenAPI)
Chaque endpoint doit être documenté avec les blocs JSDoc entre backticks (`` ` ``).
- **Obligatoire :** Description, Tags, Paramètres d'entrée (Request Body), et Exemples de réponses (200, 400, 501).
- **Format :** Utiliser les composants réutilisables pour les schémas Prisma.

### 🔵 Front-end (JSDoc & DartDoc)
Chaque composant réutilisable et chaque service API doit être commenté.
- **Triple slashs (///)** pour Flutter ou **/** ... */** pour React.
- **Le Pourquoi avant le Comment :** Expliquez la logique métier complexe (taxes de livraison, calculs spécifiques).
- **Tags de suivi :** Utilisez `// TODO:`, `// FIXME:` ou `// HACK:` pour signaler les dettes techniques.

---

## 🔒 3. Sécurité et Propreté du Code

* **Secrets :** Ne jamais commiter de fichiers `.env` ou de clés privées. Utilisez le fichier `.env.example` comme modèle.
* **Dépendances :** Le dossier `node_modules/` doit être ignoré par Git. Vérifiez votre `.gitignore` avant chaque commit.
* **Prisma :** Toujours valider les changements de schéma avec le Lead avant de générer une migration.

---

## 📋 4. Gestion des Tâches (GitHub Projects)

1.  **Consulter le Tableau :** Chaque matin, vérifiez vos tâches dans l'onglet **Projects**.
2.  **Mise à jour :** Déplacez vos cartes de `Todo` vers `In Progress`.
3.  **Validation :** Une fois la PR ouverte, déplacez la carte dans `Review`. Le passage en `Done` se fait uniquement après le Merge du Lead.

---

## 💬 5. Style de Code

* **Commits :** Utilisez les messages explicites (Conventional Commits).
    * `feat:` pour les nouvelles fonctionnalités.
    * `fix:` pour les corrections de bugs.
    * `chore:` pour les tâches de maintenance (mise à jour de lib, config).
* **Review :** La revue de code est un moment d'apprentissage. Soyez constructifs dans vos commentaires sur les PR.

---
*Signé : Tomté Hassane - Lead Developer PrenimTchad*
