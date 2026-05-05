

# 🛵 FaDel-Delivery - Super App (Tchad)

![NestJS](https://img.shields.io/badge/backend-NestJS-red)
![Flutter](https://img.shields.io/badge/mobile-Flutter-blue)
![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL-blue)
![Supabase](https://img.shields.io/badge/auth-Supabase-green)
![Docker](https://img.shields.io/badge/infra-Docker-blue)

## 📖 À propos
FaDel-Delivery est une Super-App modulaire conçue pour digitaliser le marché des services au Tchad (16M+ d'utilisateurs). Le système intègre la livraison de nourriture, la recharge de gaz et les services de proximité avec une approche **High-Contrast Minimalist**.

> **Note de Migration :** Le projet est passé d'Express vers un **Monolithe Modulaire NestJS** pour garantir une scalabilité maximale et un typage strict[cite: 1].

---

## 🎨 Identity & UI Rules
Le projet suit une charte graphique stricte pour garantir la lisibilité sous le soleil de N'Djamena :
*   **Style :** Squircle (Bords arrondis de `32px` à `40px`).
*   **Couleurs :** Noir Pur (`#000000`), Blanc Optique (`#FFFFFF`), Vert Signal (`#22C55E`).
*   **Police :** Plus Jakarta Sans (Titres en `Black 900`).

---

## 🚀 Prise en main rapide (Quick Start)

### 1. Pré-requis
*   Node.js (v18+) & NPM.
*   Flutter SDK (Dernière version stable).
*   Docker & Docker Compose.

### 2. Installation du Backend
```bash
# Aller dans le dossier racine
npm install

# Configurer les variables d'environnement
cp .env.example .env # Puis remplir les accès Supabase, Redis et Postgres

# Lancer l'infrastructure (Postgres, Redis)
docker-compose up -d

# Lancer l'application en mode développement
npm run start:dev
