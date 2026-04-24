# FaDel Delivery - Architecture Monolithe Modulaire

Bienvenue sur le projet **FaDel**, l'application de livraison optimisée pour le marché tchadien. 
Ce document explique la structure technique, l'installation et les protocoles de développement pour l'équipe.

---

## Vue d'ensemble
* **Application** : FaDel Delivery (Mobile)
* **Architecture** : Monolithe Modulaire Stateless (JWT)
* **Localisation cible** : Tchad (N'Djaména et provinces)

---

## Stack Technique
* **Frontend** : Flutter (Mobile Android/iOS)
* **Backend** : Node.js (Express)
* **Base de Données** : PostgreSQL (via Docker)
* **ORM** : Prisma v5.22.0
* **Cache/Broker** : Redis
* **Conteneurisation** : Docker & Docker Compose

---

## Structure du Projet
```plaintext
fadel-delivery/
├── mobile/             # Application Flutter (Frontend)
├── src/                # Code source Backend (Node.js)
│   ├── modules/        # Logique métier découpée en modules
│   │   ├── auth/       # Authentification & RBAC
│   │   ├── livraison/  # Gestion des Livraisons
│   │   └── livreur/    # Gestion des Livreurs
│   ├── app.js          # Configuration Express
│   └── server.js       # Point d'entrée du serveur
├── prisma/             # Schémas de base de données
├── docker-compose.yml  # Orchestration PostgreSQL & Redis
└── README.md           # Documentation (Ce fichier)

## Licence
Propriété de FaDel - N'Djaména, Tchad.

Document mis à jour par PAYANG Ernest, Devloppeur Fullstack Junior
