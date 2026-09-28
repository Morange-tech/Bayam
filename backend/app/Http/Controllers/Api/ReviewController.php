<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(int $productId)
    {
        return Review::where('product_id', $productId)
            ->with('user:id,first_name,last_name')
            ->latest()
            ->paginate(10);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ]);

        $user = $request->user();

        if (Review::where('product_id', $data['product_id'])->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'Vous avez déjà laissé un avis sur ce produit.'], 422);
        }

        $verifiedPurchase = Order::where('user_id', $user->id)
            ->where('status', OrderStatus::Delivered)
            ->whereHas('items', fn ($query) => $query->where('product_id', $data['product_id']))
            ->exists();

        $review = Review::create([
            'product_id' => $data['product_id'],
            'user_id' => $user->id,
            'rating' => $data['rating'],
            'comment' => $data['comment'] ?? null,
            'verified_purchase' => $verifiedPurchase,
        ]);

        return response()->json($review->load('user:id,first_name,last_name'), 201);
    }
}
