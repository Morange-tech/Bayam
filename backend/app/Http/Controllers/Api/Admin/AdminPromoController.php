<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\PromoCode;
use Illuminate\Http\Request;

class AdminPromoController extends Controller
{
    public function index()
    {
        return PromoCode::latest()->get();
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['code'] = strtoupper($data['code']);

        return response()->json(PromoCode::create($data), 201);
    }

    public function show(PromoCode $promotion)
    {
        return $promotion;
    }

    public function update(Request $request, PromoCode $promotion)
    {
        $data = $this->validated($request, $promotion->id);
        $data['code'] = strtoupper($data['code']);
        $promotion->update($data);

        return $promotion;
    }

    public function destroy(PromoCode $promotion)
    {
        $promotion->delete();

        return response()->json(status: 204);
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'code' => ['required', 'string', 'max:50', 'unique:promo_codes,code'.($ignoreId ? ",{$ignoreId}" : '')],
            'type' => ['required', 'in:percent,fixed'],
            'value' => ['required', 'integer', 'min:1'],
            'expires_at' => ['nullable', 'date'],
            'max_uses' => ['nullable', 'integer', 'min:1'],
            'is_active' => ['boolean'],
        ]);
    }
}
