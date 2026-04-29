# FaDel Delivery Mobile - Architecture Documentation

## Project Structure

```
lib/
├── main.dart                      # Entry point
├── config/                        # App configuration
│   ├── app_config.dart           # Theme & app settings
│   └── routes.dart               # Navigation routes
├── constants/                     # Design system & constants
│   ├── app_colors.dart           # Color palette
│   ├── app_typography.dart       # Text styles
│   ├── app_spacing.dart          # Layout tokens
│   ├── app_constants.dart        # App constants
│   └── index.dart                # Export all
├── models/                        # Data models
│   ├── user.dart                 # User data model
│   ├── order.dart                # Order & OrderItem models
│   ├── service.dart              # Service model
│   └── index.dart                # Export all
├── screens/                       # Screen implementations
│   ├── auth/
│   │   ├── login_screen.dart     # Login screen
│   │   └── register_screen.dart  # Registration screen
│   └── home/
│       └── home_screen.dart      # Home screen
├── widgets/                       # Reusable components
│   ├── common/                   # Common widgets
│   │   ├── fadel_button.dart     # Custom button component
│   │   ├── fadel_card.dart       # Custom card component
│   │   ├── fadel_input.dart      # Custom input component
│   │   └── index.dart            # Export all
│   └── home/                     # Home-specific widgets
│       ├── banner_card.dart      # Banner component
│       ├── service_tile.dart     # Service tile component
│       └── index.dart            # Export all
├── services/                      # Business logic & APIs
│   ├── api/
│   │   ├── api_client.dart       # HTTP client with interceptors
│   │   └── endpoints.dart        # API endpoints
│   ├── auth/
│   │   └── auth_service.dart     # Authentication service
│   └── index.dart                # Export all
└── utils/                         # Utilities
    ├── extensions.dart           # Dart extensions
    ├── validators.dart           # Input validators
    └── helpers.dart              # Helper functions
```

## Design System

### Colors (High-Contrast Minimalist)
- **Primary Black**: `#000000` - Buttons, backgrounds
- **Optical White**: `#FFFFFF` - Text, cards
- **Signal Green**: `#22C55E` - Status, prices, accents
- **Mist Gray**: `#F9FAFB` - App background

### Typography (Jakarta Sans)
- **Titles**: Weight 900 (Black), Letter-spacing: -0.05
- **Body**: Weight 500 (Medium)
- **Labels**: Weight 900 (Black), UPPERCASE, Wide spacing

### Spacing Tokens
- `xs`: 4px | `sm`: 8px | `md`: 12px | `lg`: 16px
- `xl`: 20px | `xxl`: 24px | `xxxl`: 32px

### Border Radius (Squircle)
- Small: 16px | Medium: 24px | Large: 32px | XLarge: 40px

## Component Usage

### FadelButton
```dart
FadelButton(
  label: 'CONTINUER',
  onPressed: () {},
  variant: FadelButtonVariant.primary,
  size: FadelButtonSize.large,
)
```

### FadelCard
```dart
FadelCard(
  borderRadius: AppSpacing.radiusLarge,
  child: Text('Card Content'),
)
```

### FadelInput
```dart
FadelInput(
  label: 'EMAIL',
  hint: 'example@mail.com',
  prefixIcon: Icons.email,
)
```

## Services

### AuthService
- `saveTokens()` - Save auth tokens
- `getAccessToken()` - Retrieve token
- `isAuthenticated()` - Check auth status
- `logout()` - Clear auth data

### ApiClient
- `login()` - Login user
- `register()` - Register new user
- `getUserProfile()` - Fetch user data
- `getServices()` - Fetch available services
- `getOrders()` - Fetch user orders

## Import Best Practices

```dart
// Import constants
import 'constants/index.dart';

// Import models
import 'models/index.dart';

// Import services
import 'services/index.dart';

// Import widgets
import 'widgets/common/index.dart';
import 'widgets/home/index.dart';
```

## Key Features

✅ **Clean Architecture** - Separation of concerns
✅ **Design System Tokens** - Consistent styling
✅ **Reusable Components** - DRY principle
✅ **Type-Safe Models** - Strong typing
✅ **Organized Services** - Business logic centralized
✅ **Route Management** - Centralized navigation
✅ **Theme Configuration** - Single source of truth

## Next Steps

1. ✅ Move login.dart → screens/auth/login_screen.dart
2. ✅ Move register.dart → screens/auth/register_screen.dart
3. ✅ Move home.dart → screens/home/home_screen.dart
4. ✅ Update main.dart imports
5. ✅ Create utils/validators.dart
6. ✅ Add error handling & state management
