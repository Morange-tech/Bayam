<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\PromoCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    // Kept in sync with the frontend's lib/checkout.js DELIVERY_MODES until this is data-driven.
    private const DELIVERY_FEES = [
        'standard' => 2500,
        'express' => 5000,
    ];

    public function store(Request $request)
    {
        $data = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.variant' => ['nullable', 'array'],
            'delivery.first_name' => ['required', 'string', 'max:255'],
            'delivery.last_name' => ['required', 'string', 'max:255'],
            'delivery.phone' => ['required', 'string', 'max:30'],
            'delivery.city' => ['required', 'string', 'max:255'],
            'delivery.neighborhood' => ['required', 'string', 'max:255'],
            'delivery.address' => ['required', 'string', 'max:500'],
            'delivery.instructions' => ['nullable', 'string', 'max:500'],
            'delivery.delivery_mode' => ['required', 'in:standard,express'],
            'payment_method' => ['required', 'in:mtn,orange,card,cod'],
            'promo_code' => ['nullable', 'string'],
        ]);

        $order = DB::transaction(function () use ($data, $request) {
            $products = Product::whereIn('id', collect($data['items'])->pluck('product_id'))
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $subtotal = 0;
            foreach ($data['items'] as $item) {
                $product = $products->get($item['product_id']);

                if (! $product || $product->stock < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => ['Stock insuffisant pour '.($product->name ?? "le produit #{$item['product_id']}").'.'],
                    ]);
                }

                $subtotal += $product->price * $item['quantity'];
            }

            $discount = 0;
            if (! empty($data['promo_code'])) {
                $promo = PromoCode::whereRaw('upper(code) = ?', [strtoupper($data['promo_code'])])->first();
                if ($promo && $promo->isValid()) {
                    $discount = $promo->discountFor($subtotal);
                    $promo->increment('used_count');
                }
            }

            $deliveryFee = self::DELIVERY_FEES[$data['delivery']['delivery_mode']];
            $total = max(0, $subtotal - $discount) + $deliveryFee;

            $order = Order::create([
                'user_id' => $request->user()->id,
                'status' => OrderStatus::Pending,
                'total' => $total,
                'delivery_fee' => $deliveryFee,
                'delivery_address' => $data['delivery'],
                'payment_method' => $data['payment_method'],
                'payment_status' => PaymentStatus::Pending,
            ]);

            foreach ($data['items'] as $item) {
                $product = $products->get($item['product_id']);

                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                    'variant' => $item['variant'] ?? null,
                ]);

                $product->decrement('stock', $item['quantity']);
            }

            $order->tracking()->create([
                'status' => 'Commandée',
                'note' => 'Commande reçue, en attente de paiement.',
            ]);

            return $order;
        });

        return response()->json($order->load('items.product', 'tracking'), 201);
    }

    public function tracking(Request $request, int $id)
    {
        $order = $request->user()->orders()->findOrFail($id);

        return $order->tracking()->orderBy('created_at')->get();
    }
}
