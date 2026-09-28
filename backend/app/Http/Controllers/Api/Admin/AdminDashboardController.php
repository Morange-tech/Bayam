<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $monthStart = now()->startOfMonth();

        return response()->json([
            'revenue_this_month' => Order::where('payment_status', PaymentStatus::Paid)
                ->where('created_at', '>=', $monthStart)
                ->sum('total'),
            'orders_total' => Order::count(),
            'new_customers_this_month' => User::where('role', UserRole::Customer)
                ->where('created_at', '>=', $monthStart)
                ->count(),
            'active_products' => Product::active()->count(),
            'recent_orders' => Order::with('user:id,first_name,last_name')->latest()->limit(6)->get(),
            'alerts' => [
                'low_stock' => Product::where('stock', '<=', 5)->where('stock', '>', 0)->count(),
                'out_of_stock' => Product::where('stock', 0)->count(),
                'pending_orders' => Order::where('status', OrderStatus::Pending)->count(),
            ],
        ]);
    }
}
