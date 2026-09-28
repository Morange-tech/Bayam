<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()
            ->wishlist()
            ->with('product.category')
            ->latest()
            ->get()
            ->pluck('product');
    }

    public function toggle(Request $request, int $productId)
    {
        $existing = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $productId)
            ->first();

        if ($existing) {
            $existing->delete();

            return response()->json(['wishlisted' => false]);
        }

        Wishlist::create(['user_id' => $request->user()->id, 'product_id' => $productId]);

        return response()->json(['wishlisted' => true]);
    }
}
