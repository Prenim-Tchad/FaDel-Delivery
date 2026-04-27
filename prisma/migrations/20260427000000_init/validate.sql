-- Validate migration script
-- This script can be used to test the migration on a test database

-- Test data insertion (optional - for validation)
-- Insert sample cuisine categories
INSERT INTO "cuisine_categories" ("id", "name", "description", "sort_order") VALUES
('cuisine_african', 'Cuisine Africaine', 'Saveurs traditionnelles d''Afrique', 1),
('cuisine_mediterranean', 'Cuisine Méditerranéenne', 'Plats sains et savoureux', 2),
('cuisine_fast_food', 'Fast Food', 'Repas rapides et pratiques', 3);

-- Insert sample profile (would normally come from Supabase Auth)
INSERT INTO "profiles" ("id", "email", "full_name", "is_partner") VALUES
('550e8400-e29b-41d4-a716-446655440000', 'partner@fadel.td', 'Restaurant ABC', true);

-- Insert sample restaurant
INSERT INTO "restaurants" (
    "id", "name", "description", "address", "phone", "city", "owner_id", "cuisine_category_id",
    "latitude", "longitude", "delivery_fee", "minimum_order"
) VALUES (
    'rest_001', 'Restaurant ABC', 'Le meilleur de la cuisine africaine', '123 Avenue Charles de Gaulle, N''Djamena',
    '+23566123456', 'N''Djamena', '550e8400-e29b-41d4-a716-446655440000', 'cuisine_african',
    12.1348, 15.0557, 1500, 5000
);

-- Insert sample menu category
INSERT INTO "menu_categories" ("id", "restaurant_id", "name", "sort_order") VALUES
('menu_cat_001', 'rest_001', 'Plats Principaux', 1);

-- Insert sample menu item
INSERT INTO "menu_items" (
    "id", "menu_category_id", "name", "description", "price", "is_available",
    "ingredients", "preparation_time"
) VALUES (
    'menu_item_001', 'menu_cat_001', 'Jollof Rice', 'Riz traditionnel avec sauce tomate',
    2500, true, ARRAY['riz', 'tomates', 'oignons', 'poivrons'], 25
);

-- Insert sample modifier group
INSERT INTO "menu_modifier_groups" (
    "id", "menu_item_id", "name", "is_required", "min_selections", "max_selections"
) VALUES (
    'mod_group_001', 'menu_item_001', 'Taille', true, 1, 1
);

-- Insert sample modifier options
INSERT INTO "menu_modifier_options" ("id", "modifier_group_id", "name", "price") VALUES
('mod_opt_001', 'mod_group_001', 'Petit', 0),
('mod_opt_002', 'mod_group_001', 'Moyen', 500),
('mod_opt_003', 'mod_group_001', 'Grand', 1000);

-- Insert sample opening hours
INSERT INTO "opening_hours" ("id", "restaurant_id", "day_of_week", "open_time", "close_time") VALUES
('hours_001', 'rest_001', 1, '08:00', '22:00'), -- Monday
('hours_002', 'rest_001', 2, '08:00', '22:00'), -- Tuesday
('hours_003', 'rest_001', 3, '08:00', '22:00'), -- Wednesday
('hours_004', 'rest_001', 4, '08:00', '22:00'), -- Thursday
('hours_005', 'rest_001', 5, '08:00', '23:00'), -- Friday
('hours_006', 'rest_001', 6, '10:00', '23:00'), -- Saturday
('hours_007', 'rest_001', 0, '10:00', '20:00'); -- Sunday

-- Insert sample delivery zone
INSERT INTO "delivery_zones" (
    "id", "restaurant_id", "name", "delivery_fee", "minimum_order"
) VALUES (
    'zone_001', 'rest_001', 'Centre-ville', 1500, 5000
);

-- Validation queries
-- Check if all tables were created
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
    'profiles', 'cuisine_categories', 'restaurants', 'opening_hours',
    'delivery_zones', 'menu_categories', 'menu_items',
    'menu_modifier_groups', 'menu_modifier_options'
)
ORDER BY table_name;

-- Check if indexes were created
SELECT indexname, tablename FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN (
    'profiles', 'cuisine_categories', 'restaurants', 'opening_hours',
    'delivery_zones', 'menu_categories', 'menu_items',
    'menu_modifier_groups', 'menu_modifier_options'
)
ORDER BY tablename, indexname;

-- Check foreign key constraints
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- Check sample data
SELECT 'Profiles count:' as info, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'Restaurants count:', COUNT(*) FROM restaurants
UNION ALL
SELECT 'Menu items count:', COUNT(*) FROM menu_items
UNION ALL
SELECT 'Modifier options count:', COUNT(*) FROM menu_modifier_options;