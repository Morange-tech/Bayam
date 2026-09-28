<?php

namespace Database\Seeders;

use App\Enums\ProductStatus;
use App\Enums\PromoType;
use App\Enums\StaffRole;
use App\Enums\UserRole;
use App\Models\Banner;
use App\Models\Category;
use App\Models\Product;
use App\Models\PromoCode;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with enough realistic data to exercise
     * every public/admin endpoint (mirrors the frontend's mock catalog).
     */
    public function run(): void
    {
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'BAYAM',
            'email' => 'admin@bayam.com',
            'password' => 'password',
            'role' => UserRole::Admin,
        ]);

        User::create([
            'first_name' => 'Jeanne',
            'last_name' => 'Kamga',
            'email' => 'client@bayam.com',
            'phone' => '+237670000000',
            'password' => 'password',
            'role' => UserRole::Customer,
        ]);

        // Sample staff account (poste Comptable) to exercise the restricted
        // admin/* access enforced by the `staff.section` middleware.
        User::create([
            'first_name' => 'Solange',
            'last_name' => 'Mballa',
            'email' => 'comptable@bayam.com',
            'password' => 'password',
            'role' => UserRole::Staff,
            'staff_role' => StaffRole::Comptable,
        ]);

        $categories = collect([
            ['name' => 'Électronique', 'icon' => 'smartphone'],
            ['name' => 'Mode', 'icon' => 'shirt'],
            ['name' => 'Maison & Cuisine', 'icon' => 'home'],
            ['name' => 'Beauté & Santé', 'icon' => 'sparkles'],
            ['name' => 'Sport & Loisirs', 'icon' => 'dumbbell'],
            ['name' => 'Alimentation', 'icon' => 'apple'],
        ])->mapWithKeys(function ($category) {
            $model = Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'icon' => $category['icon'],
            ]);

            return [Str::slug($category['name']) => $model];
        });

        $products = [
            ['name' => 'Smartphone Android 128GB, 6.5" HD+', 'category' => 'electronique', 'price' => 149000, 'original_price' => 179000, 'stock' => 8],
            ['name' => 'Écouteurs Bluetooth Sport, autonomie 20h', 'category' => 'electronique', 'price' => 15000, 'stock' => 0],
            ['name' => 'Robe Wax élégante, coupe cintrée', 'category' => 'mode', 'price' => 25000, 'stock' => 14],
            ['name' => 'Sneakers Urban, semelle confort', 'category' => 'mode', 'price' => 35000, 'original_price' => 42000, 'stock' => 4],
            ['name' => 'Blender mixeur professionnel 1.5L', 'category' => 'maison-cuisine', 'price' => 28000, 'stock' => 22],
            ['name' => 'Crème hydratante bio visage & corps', 'category' => 'beaute-sante', 'price' => 8000, 'stock' => 35],
            ['name' => 'Ballon de football taille 5', 'category' => 'sport-loisirs', 'price' => 12000, 'stock' => 40],
            ['name' => 'Riz parfumé premium, sac de 25kg', 'category' => 'alimentation', 'price' => 32000, 'original_price' => 36000, 'stock' => 50],
        ];

        foreach ($products as $product) {
            $slug = Str::slug($product['name']);

            Product::create([
                'name' => $product['name'],
                'slug' => $slug,
                'description' => "<p>{$product['name']}, sélectionné pour sa qualité et son excellent rapport qualité-prix.</p>",
                'price' => $product['price'],
                'original_price' => $product['original_price'] ?? null,
                'stock' => $product['stock'],
                'category_id' => $categories[$product['category']]->id,
                'status' => ProductStatus::Active,
                'images' => [
                    ['url' => "https://placehold.co/700x700/EDE9FE/3A1868?text=".urlencode($product['name']), 'alt' => $product['name']],
                ],
                'metadata' => null,
            ]);
        }

        PromoCode::create([
            'code' => 'BAYAM10',
            'type' => PromoType::Percent,
            'value' => 10,
            'expires_at' => now()->addMonths(2),
            'max_uses' => 500,
            'used_count' => 0,
            'is_active' => true,
        ]);

        PromoCode::create([
            'code' => 'BAYAM5000',
            'type' => PromoType::Fixed,
            'value' => 5000,
            'expires_at' => now()->addMonth(),
            'max_uses' => 200,
            'used_count' => 0,
            'is_active' => true,
        ]);

        Banner::create([
            'title' => 'Les meilleures offres du moment',
            'subtitle' => "Jusqu'à -30% sur une sélection de produits high-tech",
            'cta_text' => 'Découvrir',
            'cta_url' => '/catalogue',
            'image_url' => 'https://placehold.co/700x600/6D28D9/FFFFFF?text=Promo',
            'is_active' => true,
            'order' => 1,
        ]);

        Banner::create([
            'title' => 'La mode qui vous ressemble',
            'subtitle' => 'Nouvelle collection Mode disponible dès maintenant',
            'cta_text' => 'Voir la collection',
            'cta_url' => '/catalogue/mode',
            'image_url' => 'https://placehold.co/700x600/6D28D9/FFFFFF?text=Mode',
            'is_active' => true,
            'order' => 2,
        ]);
    }
}
