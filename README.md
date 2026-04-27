# 🛵 FaDel-Delivery - Super App (Tchad)

![NestJS](https://img.shields.io/badge/backend-NestJS-red)
![Flutter](https://img.shields.io/badge/mobile-Flutter-blue)
![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL-blue)
![Docker](https://img.shields.io/badge/infra-Docker-blue)

## 📖 À propos
FaDel-Delivery est une Super-App modulaire conçue pour structurer et digitaliser le marché des services au Tchad (16M+ d'utilisateurs potentiels). Le système intègre la livraison de nourriture, la recharge de gaz et les services de proximité.

> **Note de Migration :** Le projet a été migré avec succès d'Express vers un **Monolithe Modulaire NestJS** pour garantir une meilleure scalabilité et une maintenance facilitée.

---

## 🏗️ Architecture Technique
Le backend repose sur une architecture **Stateless & Modulaire** :
* **Gateway:** Nginx (Reverse Proxy & Gzip Compression).
* **Core :** NestJS (TypeScript) - Organisation par domaines métier.
* **ORM :** Prisma (Type-safe database access).
* **Cache :** Redis (Broker pour le temps réel et tracking).
* **Database :** PostgreSQL.

---

## 📂 Structure du Repository

```text
FaDel-Delivery/
├── src/                    # Cœur du Backend (NestJS)
│   ├── modules/            # Un dossier par métier
│   │   ├── auth/           # JWT, Roles, Guard
│   │   ├── users/          # Profils, Documents (KYC)
│   │   ├── partners/       # Restaurants & Agences Gaz
│   │   ├── products/       # Menus & Bouteilles de gaz
│   │   ├── orders/         # Panier, Promo, Paiement
│   │   └── delivery/       # Dispatch, GPS, OTP
│   ├── common/             # Filtres, Intercepteurs, DTOs globaux
│   ├── prisma/             # Service Prisma centralisé
│   ├── main.ts             # Point d'entrée de l'API
│   └── app.module.ts       # Orchestrateur des modules
├── prisma/                 # Schéma de base de données
│   └── schema.prisma
├── mobile/                 # Ton code Flutter (Madjalo)
├── nginx/                  # Config de la Gateway
│   └── conf.d/
├── docker-compose.yml      # Orchestration totale
├── Dockerfile              # Build de l'image NestJS
└── .env                    # Variables confidentielles à creer en local