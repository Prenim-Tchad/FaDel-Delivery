📄 Note d'Évolution : Module Delivery (GeoService)

Projet : FaDel-Delivery

Auteur : Ephraïm (Branche : ephraim)

Tâche : #22 - Configuration du GeoService

Statut : Phase 1 (Moteur de calcul interne) Complétée ✅
1. Objectif du Module

Le module Delivery a pour but de gérer toute la logique spatiale de la Super-App. La première brique (GeoService) doit permettre de calculer la distance entre un client, un partenaire (restaurant/agence de gaz) et un livreur pour estimer les frais et les temps de livraison à N'Djamena.
2. État Actuel de l'Évolution
✅ Étape 1 : Architecture NestJS & Isolation

    Création du dossier src/modules/delivery/ indépendant du module auth.

    Déclaration du DeliveryModule et injection du HttpModule (Axios) pour les futures requêtes API.

    Enregistrement du module dans l'orchestrateur central app.module.ts.

✅ Étape 2 : Moteur de Calcul "Offline" (Haversine)

Puisque l'API Google Maps n'est pas encore activée (pour limiter les coûts et assurer la résilience), nous avons implémenté la formule de Haversine.

    Pourquoi ? Elle permet de calculer la distance "à vol d'oiseau" en utilisant uniquement la trigonométrie.

    Fiabilité : Testée sur des points réels (Chagoua ↔ Aéroport de N'Djamena).

    Avantage : Le système fonctionne même sans connexion Internet vers les serveurs de Google.

✅ Étape 3 : Robustesse et Tests Unitaires

    Mise en place de validations GPS : le service rejette les coordonnées impossibles (ex: latitude > 90°).

    Création d'une suite de tests avec Jest (delivery.service.spec.ts).

    Résultat : 100% des tests passent (PASS).

3. Prochaines Étapes (Phase 2)
Fonctionnalité	Description	Priorité
Intégration Google API	Activer la Distance Matrix API pour obtenir le temps de trajet réel selon le trafic de N'Djamena.	Moyenne
Contrôleur API	Créer delivery.controller.ts pour exposer le calcul via une route HTTP (ex: POST /delivery/estimate).	Haute
Calcul de Prix	Lier la distance obtenue à une grille tarifaire (ex: 500 FCFA les 3 premiers km).	Haute
4. Guide Technique pour l'Équipe

    Service : DeliveryService

    Méthode principale : calculateDistance(lat1, lon1, lat2, lon2)

    Commande de test : npm test src/modules/delivery/delivery.service.spec.ts

    Note de l'Ingénieur : Le module est conçu pour être "hybride". Dès que la clé API Google sera ajoutée au fichier .env, le service passera automatiquement du calcul Haversine (distance simple) à l'estimation Google Maps (temps réel + distance routière).