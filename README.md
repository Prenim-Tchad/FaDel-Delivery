🚀 FaDel Delivery - Architecture Monolithe Modulaire
Bienvenue sur le projet FaDel, l'application de livraison optimisée pour le marché tchadien. Ce document explique la structure technique, l'installation et les protocoles de développement pour l'équipe.

📌 Vue d'ensemble
Application : FaDel Delivery (Mobile)

Architecture : Monolithe Modulaire Stateless (JWT)

Localisation cible : Tchad (N'Djaména et provinces)

🛠 Stack Technique
Frontend : Flutter (Mobile Android/iOS)

Backend : Node.js (Express)

Base de Données : PostgreSQL (via Docker)

ORM : Prisma v5.22.0

Cache/Broker : Redis

Conteneurisation : Docker & Docker Compose

🏗 Structure du Projet
Plaintext
fadel-delivery/
├── mobile/ # Application Flutter (Frontend)
├── src/ # Code source Backend (Node.js)
│ ├── modules/ # Logique métier découpée en modules
│ │ ├── auth/ # Authentification & RBAC
│ │ ├── livraison/ # Gestion des Livraisons
│ │ └── livreur/ # Gestion des Livreurs
│ ├── app.js # Configuration Express
│ └── server.js # Point d'entrée du serveur
├── prisma/ # Schémas de base de données
├── docker-compose.yml # Orchestration PostgreSQL & Redis
└── README.md # Documentation (Ce fichier)
🚦 Guide d'installation rapide

1. Prérequis
   Docker Desktop installé.

Flutter SDK (dernière version stable).

Node.js v18+.

2. Lancement de l'infrastructure (Docker)
   Depuis la racine du projet :

Bash
docker-compose up -d
Cela lance PostgreSQL sur le port 5432 et Redis sur le port 6379.

3. Configuration du Backend
   Installer les dépendances : npm install

Configurer le fichier .env :

Extrait de code
DATABASE_URL="postgresql://user_fadel:password_fadel@localhost:5432/fadel_delivery?schema=public"
JWT_SECRET="votre_cle_secrete"
Pousser le schéma Prisma :

Bash
npx prisma migrate dev --name init

🔐 Système d'Authentification & Rôles
Nous utilisons un système RBAC (Role-Based Access Control). Chaque utilisateur possède l'un des rôles suivants :

Rôle Description
ADMIN Gestion globale, validation des nouveaux restaurants.
CLIENT Consultation des menus et passage de commandes.
LIVREUR Acceptation des courses et mise à jour des statuts de livraison.
PROPRIETAIRE Gestion du catalogue de plats et des menus.
Points de terminaison API (Auth)
POST /api/auth/register : Inscription d'un nouvel utilisateur.

POST /api/auth/login : Connexion et récupération du Token JWT.

💡 Notes pour les Développeurs
Accès à la Base de Données (Visuel)
Pour gérer ou visualiser les données sans passer par SQL, utilisez Prisma Studio :

Bash
npx prisma studio
L'interface sera accessible sur http://localhost:5555.

Gestion des conflits de ports (PostgreSQL)
Si le port 5432 est déjà utilisé sur votre machine Windows :

Identifiez le PID : netstat -ano | findstr :5432

Tuez le processus : taskkill /F /PID <votre_pid>

Ou arrêtez le service PostgreSQL local via services.msc.

MISE A JOUR pour 09/04 :

Pour lancer Docker + l'API : npm run dev

Pour lancer l'application Flutter : npm run mobile

17/04/2026

## 🛠 Configuration de Développement

Pour que le frontend et le backend communiquent sans erreurs CORS :

1. **Backend** : Lancé sur le port `3001` via `npm run dev`.
2. **Frontend** : Doit impérativement être lancé sur le port `5000`.
   - Via VS Code : Utiliser la configuration "FaDel Delivery (Web Port 5000)".
   - Via Terminal : `flutter run -d chrome --web-port=5000`








📝 Licence
Propriété de FaDel - N'Djaména, Tchad.

Document mis à jour par PAYANG Ernest, Devloppeur Fullstack Junior
