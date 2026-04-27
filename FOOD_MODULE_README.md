# FoodModule - FaDel Delivery

Module NestJS pour la gestion des plats dans l'application FaDel Delivery.

## 📁 Structure du Module

```
src/modules/food/
├── controllers/
│   └── food.controller.ts          # Routes REST API
├── services/
│   └── food.service.ts             # Logique métier
├── repositories/
│   └── food.repository.ts          # Accès aux données
├── entities/
│   └── food.entity.ts              # Modèle de données
├── dtos/
│   ├── create-food.dto.ts          # DTO création
│   ├── update-food.dto.ts          # DTO mise à jour
│   └── food-filters.dto.ts         # DTO filtres
├── enums/
│   └── food.enums.ts               # Énumérations
├── guards/
│   └── food-partner.guard.ts       # Protection partenaires
├── food.module.ts                  # Module principal
└── index.ts                        # Exports
```

## 🚀 Endpoints API

### Créer un plat
```http
POST /food
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jollof Rice",
  "description": "Riz traditionnel ouest-africain",
  "price": 2500,
  "category": "main_course",
  "type": "regular",
  "preparationTime": 30,
  "ingredients": ["riz", "tomates", "oignons"],
  "partnerId": "partner-uuid"
}
```

### Récupérer tous les plats (avec filtres)
```http
GET /food?category=main_course&type=vegetarian&page=1&limit=10
Authorization: Bearer <token>
```

### Récupérer un plat par ID
```http
GET /food/{id}
Authorization: Bearer <token>
```

### Mettre à jour un plat
```http
PATCH /food/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 2800,
  "status": "available"
}
```

### Supprimer un plat
```http
DELETE /food/{id}
Authorization: Bearer <token>
```

### Récupérer les plats d'un partenaire
```http
GET /food/partner/{partnerId}
Authorization: Bearer <token>
```

### Récupérer les plats en vedette
```http
GET /food/featured
Authorization: Bearer <token>
```

## 🔧 Utilisation dans le code

### Import du module
```typescript
import { FoodModule } from './modules/food';

@Module({
  imports: [FoodModule],
})
export class AppModule {}
```

### Utilisation du service
```typescript
import { FoodService } from './modules/food';

@Injectable()
export class SomeService {
  constructor(private readonly foodService: FoodService) {}

  async getFeaturedFoods() {
    return this.foodService.findFeatured();
  }
}
```

### Utilisation du guard
```typescript
import { FoodPartnerGuard } from './modules/food';

@Controller('admin-food')
@UseGuards(FoodPartnerGuard)
export class AdminFoodController {
  // Seuls les partenaires peuvent accéder
}
```

## 📊 Énumérations

### FoodCategory
- `appetizer` - Entrée
- `main_course` - Plat principal
- `dessert` - Dessert
- `beverage` - Boisson
- `snack` - Snack

### FoodType
- `vegetarian` - Végétarien
- `vegan` - Vegan
- `gluten_free` - Sans gluten
- `halal` - Halal
- `kosher` - Casher
- `regular` - Standard

### FoodStatus
- `available` - Disponible
- `unavailable` - Indisponible
- `out_of_stock` - Épuisé

## 🔍 Filtres disponibles

- `category`: Filtrer par catégorie
- `type`: Filtrer par type alimentaire
- `partnerId`: Filtrer par partenaire
- `minPrice`/`maxPrice`: Filtrer par prix
- `search`: Recherche textuelle
- `isFeatured`: Plats en vedette uniquement
- `page`/`limit`: Pagination

## 🛡️ Sécurité

- **Authentification requise** sur toutes les routes
- **Guard partenaire** pour les opérations de création/modification
- **Validation DTO** avec class-validator
- **Documentation Swagger** complète

## 📈 Fonctionnalités

- ✅ CRUD complet des plats
- ✅ Filtres et recherche avancés
- ✅ Pagination
- ✅ Gestion des statuts
- ✅ Plats en vedette
- ✅ Validation des données
- ✅ Documentation API
- ✅ Gestion des partenaires

## 🔄 Évolution future

- Intégration Prisma pour la persistance
- Upload d'images
- Gestion des avis clients
- Recommandations personnalisées
- Statistiques de vente