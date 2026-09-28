<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;

class AdminBannerController extends Controller
{
    public function index()
    {
        return Banner::orderBy('order')->get();
    }

    public function store(Request $request)
    {
        return response()->json(Banner::create($this->validated($request)), 201);
    }

    public function show(Banner $banner)
    {
        return $banner;
    }

    public function update(Request $request, Banner $banner)
    {
        $banner->update($this->validated($request));

        return $banner;
    }

    public function destroy(Banner $banner)
    {
        $banner->delete();

        return response()->json(status: 204);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'cta_text' => ['nullable', 'string', 'max:255'],
            'cta_url' => ['nullable', 'string', 'max:255'],
            'image_url' => ['required', 'string', 'max:2000'],
            'position' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
            'order' => ['integer', 'min:0'],
        ]);
    }
}
