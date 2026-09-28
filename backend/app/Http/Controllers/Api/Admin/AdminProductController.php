<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminProductController extends Controller
{
    public function index(Request $request)
    {
        return Product::query()
            ->with('category')
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->input('status')))
            ->when($request->filled('category'), fn ($q) => $q->where('category_id', $request->input('category')))
            ->when($request->filled('q'), fn ($q) => $q->where('name', 'like', '%'.$request->input('q').'%'))
            ->latest()
            ->paginate(15);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        $product = Product::create($data);

        return response()->json($product->load('category'), 201);
    }

    public function show(Product $product)
    {
        return $product->load('category');
    }

    public function update(Request $request, Product $product)
    {
        $data = $this->validated($request, $product->id);

        if (! empty($data['name']) && empty($request->input('slug'))) {
            $data['slug'] = Str::slug($data['name']);
        }

        $product->update($data);

        return $product->load('category');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(status: 204);
    }

    public function toggleStatus(Request $request, Product $product)
    {
        $data = $request->validate(['status' => ['required', 'in:active,hidden,draft']]);
        $product->update(['status' => $data['status']]);

        return $product;
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug'.($ignoreId ? ",{$ignoreId}" : '')],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'integer', 'min:0'],
            'original_price' => ['nullable', 'integer', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'category_id' => ['required', 'exists:categories,id'],
            'status' => ['required', 'in:active,hidden,draft'],
            'images' => ['nullable', 'array'],
            'metadata' => ['nullable', 'array'],
        ]);
    }
}
