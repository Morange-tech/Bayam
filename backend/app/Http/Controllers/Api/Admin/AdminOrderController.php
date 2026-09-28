<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        return Order::query()
            ->with('user:id,first_name,last_name,email')
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->input('status')))
            ->latest()
            ->paginate(15);
    }

    public function show(Order $order)
    {
        return $order->load('user', 'items.product', 'tracking');
    }

    public function updateStatus(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => ['required', 'in:pending,confirmed,processing,shipped,delivered,cancelled'],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        $order->update(['status' => $data['status']]);
        $order->tracking()->create([
            'status' => $data['status'],
            'note' => $data['note'] ?? null,
        ]);

        return $order->load('tracking');
    }
}
