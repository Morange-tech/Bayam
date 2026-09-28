<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        return User::query()
            ->when($request->filled('role'), fn ($q) => $q->where('role', $request->input('role')))
            ->when($request->filled('q'), fn ($q) => $q->where('name', 'like', '%'.$request->input('q').'%'))
            ->latest()
            ->paginate(15);
    }

    /**
     * Toggles the user's banned state (a single route serves ban and unban),
     * and revokes their existing tokens when banning.
     */
    public function ban(User $user)
    {
        $user->update(['banned_at' => $user->banned_at ? null : now()]);

        if ($user->isBanned()) {
            $user->tokens()->delete();
        }

        return $user;
    }
}
