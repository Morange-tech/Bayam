<?php

use App\Http\Controllers\Api\Admin\AdminBannerController;
use App\Http\Controllers\Api\Admin\AdminCategoryController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminNotificationController;
use App\Http\Controllers\Api\Admin\AdminOrderController;
use App\Http\Controllers\Api\Admin\AdminProductController;
use App\Http\Controllers\Api\Admin\AdminPromoController;
use App\Http\Controllers\Api\Admin\AdminStaffController;
use App\Http\Controllers\Api\Admin\AdminStatsController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PasswordController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\WishlistController;
use Illuminate\Support\Facades\Route;

// ── PUBLIC ──────────────────────────────────────────────────────────────────
Route::prefix('v1')->group(function () {

    // Catalogue & Produits
    Route::get('/banners', [BannerController::class, 'index']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/featured', [CategoryController::class, 'featured']);
    Route::get('/categories/{slug}/products', [ProductController::class, 'byCategory']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/search', [ProductController::class, 'search']);
    Route::get('/products/bestsellers', [ProductController::class, 'bestsellers']);
    Route::get('/products/flash-sale', [ProductController::class, 'flashSale']);
    Route::get('/products/new', [ProductController::class, 'latest']);
    Route::get('/products/recommended', [ProductController::class, 'recommended']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);
    Route::get('/products/{id}/reviews', [ReviewController::class, 'index']);
    Route::get('/products/{id}/related', [ProductController::class, 'related']);

    // Auth
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/social', [AuthController::class, 'socialLogin']);
    Route::post('/auth/forgot-password', [PasswordController::class, 'sendResetLink']);
    Route::post('/auth/reset-password', [PasswordController::class, 'reset']);

    // ── AUTH REQUIS ─────────────────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {

        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // Panier & Promo
        Route::post('/cart/validate', [CartController::class, 'validate']);
        Route::post('/cart/promo', [CartController::class, 'applyPromo']);

        // Commandes
        Route::post('/orders', [OrderController::class, 'store']);
        Route::post('/orders/{id}/pay', [PaymentController::class, 'initiate']);
        Route::get('/orders/{id}/tracking', [OrderController::class, 'tracking']);

        // Favoris
        Route::post('/wishlist/{productId}', [WishlistController::class, 'toggle']);
        Route::get('/wishlist', [WishlistController::class, 'index']);

        // Avis
        Route::post('/reviews', [ReviewController::class, 'store']);

        // Compte acheteur
        Route::prefix('account')->group(function () {
            Route::get('/profile', [AccountController::class, 'show']);
            Route::put('/profile', [AccountController::class, 'update']);
            Route::put('/password', [AccountController::class, 'updatePassword']);
            Route::get('/orders', [AccountController::class, 'orders']);
            Route::get('/orders/{id}', [AccountController::class, 'orderDetail']);
            Route::apiResource('/addresses', AddressController::class);
            Route::get('/stats', [AccountController::class, 'stats']);
        });

        // ── ADMIN & STAFF ────────────────────────────────────────────────────
        // `role:admin,staff` keeps plain customers out entirely; each sub-group
        // below narrows further so a staff account only reaches the section(s)
        // its poste (StaffRole) covers — an admin bypasses every `staff.section`
        // check (see User::canAccessSection). Routes with no `staff.section`
        // gate stay admin-only via the inner `role:admin` group.
        Route::middleware('role:admin,staff')->prefix('admin')->group(function () {

            // Admin-only — never reachable by a staff token, whatever its poste.
            Route::middleware('role:admin')->group(function () {
                Route::get('/dashboard', [AdminDashboardController::class, 'index']);
                Route::apiResource('/categories', AdminCategoryController::class);
                Route::apiResource('/banners', AdminBannerController::class);
                Route::patch('/users/{id}/ban', [AdminUserController::class, 'ban']);
                Route::post('/notifications/send', [AdminNotificationController::class, 'send']);
                Route::apiResource('/staff', AdminStaffController::class)->except(['show']);
            });

            // Finances — admin + Comptable staff.
            Route::middleware('staff.section:finances')->group(function () {
                Route::get('/stats/revenue', [AdminStatsController::class, 'revenue']);
                Route::get('/stats/payments', [AdminStatsController::class, 'paymentBreakdown']);
            });

            // Commandes — admin + Commandes staff.
            Route::middleware('staff.section:commandes')->group(function () {
                Route::get('/orders', [AdminOrderController::class, 'index']);
                Route::get('/orders/{id}', [AdminOrderController::class, 'show']);
                Route::patch('/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);
            });

            // Catalogue — admin + Catalogue staff.
            Route::middleware('staff.section:catalogue')->group(function () {
                Route::apiResource('/products', AdminProductController::class);
                Route::patch('/products/{id}/toggle-status', [AdminProductController::class, 'toggleStatus']);
                Route::apiResource('/promotions', AdminPromoController::class);
            });

            // Utilisateurs — admin + Support staff (read-only; banning stays admin-only above).
            Route::middleware('staff.section:utilisateurs')->group(function () {
                Route::get('/users', [AdminUserController::class, 'index']);
            });
        });
    });

    // Webhook paiement (public mais signature vérifiée)
    Route::post('/payments/webhook/cinetpay', [PaymentController::class, 'cinetpayWebhook']);
    Route::post('/payments/webhook/stripe', [PaymentController::class, 'stripeWebhook']);
});
