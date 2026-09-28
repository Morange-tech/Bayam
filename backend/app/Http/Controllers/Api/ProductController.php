<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    private function baseQuery(): Builder
    {
        return Product::query()->active()->with('category');
    }

    private function applyFilters(Builder $query, Request $request): Builder
    {
        $query
            ->when($request->string('q')->toString(), fn ($q, $search) => $q->where('name', 'like', "%{$search}%"))
            ->when($request->string('category')->toString(), function ($q, $slug) {
                $q->whereHas('category', fn ($c) => $c->where('slug', $slug));
            })
            ->when($request->filled('min_price'), fn ($q) => $q->where('price', '>=', (int) $request->input('min_price')))
            ->when($request->filled('max_price'), fn ($q) => $q->where('price', '<=', (int) $request->input('max_price')))
            ->when($request->boolean('in_stock'), fn ($q) => $q->where('stock', '>', 0));

        return match ($request->string('sort')->toString()) {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'newest' => $query->orderByDesc('created_at'),
            default => $query->orderByDesc('created_at'),
        };
    }

    public function index(Request $request)
    {
        return $this->applyFilters($this->baseQuery(), $request)->paginate(12);
    }

    public function search(Request $request)
    {
        $request->validate(['q' => ['required', 'string']]);

        return $this->applyFilters($this->baseQuery(), $request)->paginate(12);
    }

    public function bestsellers()
    {
        return $this->baseQuery()
            ->withCount('reviews')
            ->orderByDesc('reviews_count')
            ->limit(8)
            ->get();
    }

    /**
     * Products currently discounted (original_price set). There is no dedicated flash-sale
     * table/flag in the schema, so `ends_at` is a rolling window computed on each request —
     * matches the shape the frontend already expects from its mock data.
     */
    public function flashSale()
    {
        $products = $this->baseQuery()
            ->whereNotNull('original_price')
            ->limit(8)
            ->get();

        return response()->json([
            'ends_at' => now()->addHours(6)->toIso8601String(),
            'products' => $products,
        ]);
    }

    public function latest()
    {
        return $this->baseQuery()->orderByDesc('created_at')->limit(8)->get();
    }

    /**
     * Stand-in for a real recommendation engine: highest-rated active products.
     */
    public function recommended()
    {
        return $this->baseQuery()
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->orderByDesc('reviews_avg_rating')
            ->limit(8)
            ->get();
    }

    public function show(string $slug)
    {
        $product = $this->baseQuery()
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->where('slug', $slug)
            ->firstOrFail();

        return $product;
    }

    public function byCategory(string $slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();

        return $this->baseQuery()
            ->where('category_id', $category->id)
            ->orWhereHas('category', fn ($q) => $q->where('parent_id', $category->id))
            ->paginate(12);
    }

    public function related(int $id)
    {
        $product = Product::findOrFail($id);

        return $this->baseQuery()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get();
    }
}
