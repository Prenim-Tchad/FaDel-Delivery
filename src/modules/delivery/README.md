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


    🚚 Documentation Technique : Module Geo & Pricing (v1.0)
📌 Présentation

Le module Delivery a été mis à jour pour intégrer un système de calcul de distance et de tarification dynamique. Pour éviter les coûts liés à l'API Google Maps, nous utilisons une stratégie hybride basée sur OSRM (OpenStreetMap) et la formule mathématique de Haversine.
🏗️ Architecture du Module

Le système repose sur trois composants principaux :

    GeoService : Gère la logique spatiale (calculs de distance et appels API externes).

    DeliveryPricingService : Applique les règles métier (tarifs par véhicule, frais minimums, arrondis).

    DeliveryController : Expose les endpoints pour les tests et l'intégration mobile/web.

🛠️ Composants Techniques
1. GeoService (Calcul de distance)

Ce service propose deux méthodes de calcul :

    Mode Standard (OSRM) : Calcule la distance et la durée réelle en fonction du réseau routier de N'Djaména via l'API router.project-osrm.org.

    Mode Fallback (Haversine) : Si l'API OSRM est indisponible ou s'il n'y a pas de connexion, le système bascule automatiquement sur le calcul "à vol d'oiseau".

2. DeliveryPricingService (Tarification)

Les tarifs sont calculés en fonction du type de véhicule utilisé :
Véhicule	Tarif au KM	Usage prévu
MOTO	150 FCFA	Livraison standard
CARGO	250 FCFA	Gros colis / Encombrants
EXPRESS	400 FCFA	Livraison prioritaire

Règles métier appliquées :

    Prix Minimum : 500 FCFA (appliqué si le calcul au KM est inférieur).

    Arrondi Local : Le prix final est arrondi au multiple de 25 FCFA supérieur (ex: 765 FCFA devient 775 FCFA) pour faciliter les échanges en espèces.

🚀 Comment tester l'intégration ?
Endpoint de Test

Vous pouvez tester le calcul en temps réel via l'URL suivante (exemple trajet ENASTIC ↔ Chagoua) :
HTTP

GET /delivery/test-price?lat1=12.1107&lon1=15.0441&lat2=12.0945&lon2=15.0682&vehicle=MOTO

Paramètres de requête

    lat1, lon1 : Coordonnées de départ (Latitude, Longitude).

    lat2, lon2 : Coordonnées d'arrivée.

    vehicle : MOTO, CARGO ou EXPRESS.

Exemple de Réponse JSON
JSON

{
  "distance": "3.42 km",
  "duration": "8 min",
  "vehicle": "MOTO",
  "totalPrice": 1025,
  "currency": "FCFA",
  "source": "OSRM"
}

🧪 Tests Automatisés

Pour garantir la non-régression lors de vos modifications, lancez la suite de tests unitaires :
PowerShell

npm test src/modules/delivery/delivery-pricing.service.spec.ts

⚠️ Notes importantes

    User-Agent : Les appels vers OSRM incluent un header User-Agent: FaDel-Delivery-App pour respecter les politiques d'utilisation gratuites.

    Dépendances : Assurez-vous que le HttpModule est bien importé dans vos modules si vous devez réutiliser le GeoService.