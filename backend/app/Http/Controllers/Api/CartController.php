<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\PromoCode;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Re-checks a cart's lines against the live catalog (price/stock may have
     * changed since the client cached them) so checkout can trust the totals.
     */
    public function validate(Request $request)
    {
        $data = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        $products = Product::whereIn('id', collect($data['items'])->pluck('product_id'))
            ->get()
            ->keyBy('id');

        $lines = collect($data['items'])->map(function ($item) use ($products) {
            $product = $products->get($item['product_id']);

            if (! $product) {
                return [
                    'product_id' => $item['product_id'],
                    'available' => false,
                    'reason' => 'Produit introuvable.',
                ];
            }

            $available = $product->status->value === 'active' && $product->stock >= $item['quantity'];

            return [
                'product_id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'stock' => $product->stock,
                'quantity' => min($item['quantity'], max($product->stock, 0)),
                'available' => $available,
                'reason' => $available ? null : 'Stock insuffisant ou produit indisponible.',
            ];
        });

        $subtotal = $lines->filter(fn ($line) => $line['available'])
            ->sum(fn ($line) => $line['price'] * $line['quantity']);

        return response()->json([
            'items' => $lines,
            'subtotal' => $subtotal,
            'all_available' => $lines->every(fn ($line) => $line['available']),
        ]);
    }

    public function applyPromo(Request $request)
    {
        $data = $request->validate([
            'code' => ['required', 'string'],
            'subtotal' => ['required', 'integer', 'min:0'],
        ]);

        $promo = PromoCode::whereRaw('upper(code) = ?', [strtoupper($data['code'])])->first();

        if (! $promo || ! $promo->isValid()) {
            return response()->json(['message' => 'Code promo invalide ou expiré.'], 422);
        }

        return response()->json([
            'code' => $promo->code,
            'type' => $promo->type,
            'value' => $promo->value,
            'discount' => $promo->discountFor($data['subtotal']),
        ]);
    }
}
