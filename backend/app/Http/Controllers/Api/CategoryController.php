<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        return Category::whereNull('parent_id')
            ->with('children')
            ->orderBy('name')
            ->get();
    }

    /**
     * Root categories used as the homepage's "featured categories" tiles.
     * There is no dedicated "featured" flag on the model, so this simply
     * returns the top-level categories, capped to a reasonable count.
     */
    public function featured()
    {
        return Category::whereNull('parent_id')
            ->orderBy('name')
            ->limit(6)
            ->get();
    }
}
