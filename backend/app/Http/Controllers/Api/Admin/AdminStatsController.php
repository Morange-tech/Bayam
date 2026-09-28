<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class AdminStatsController extends Controller
{
    public function revenue(Request $request)
    {
        $days = (int) $request->input('days', 30);
        $start = now()->subDays(max(1, $days) - 1)->startOfDay();

        return Order::where('payment_status', PaymentStatus::Paid)
            ->where('created_at', '>=', $start)
            ->selectRaw('DATE(created_at) as date, SUM(total) as revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }

    public function paymentBreakdown()
    {
        return Order::selectRaw('payment_method, COUNT(*) as count, SUM(total) as total')
            ->groupBy('payment_method')
            ->get();
    }
}
