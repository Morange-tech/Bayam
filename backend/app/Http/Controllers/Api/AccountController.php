<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AccountController extends Controller
{
    public function show(Request $request)
    {
        return new UserResource($request->user());
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'phone' => ['nullable', 'string', 'max:30'],
        ]);

        $user->update($data);

        return new UserResource($user);
    }

    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        if (! Hash::check($data['current_password'], $user->password)) {
            return response()->json(['message' => 'Mot de passe actuel incorrect.'], 422);
        }

        $user->update(['password' => $data['password']]);

        return response()->json(['message' => 'Mot de passe mis à jour.']);
    }

    public function orders(Request $request)
    {
        return $request->user()->orders()->with('items.product')->latest()->paginate(10);
    }

    public function orderDetail(Request $request, int $id)
    {
        $order = $request->user()->orders()->with(['items.product', 'tracking'])->findOrFail($id);

        return $order;
    }

    public function stats(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'total_orders' => $user->orders()->count(),
            'active_orders' => $user->orders()
                ->whereNotIn('status', [OrderStatus::Delivered, OrderStatus::Cancelled])
                ->count(),
            'wishlist_count' => $user->wishlist()->count(),
        ]);
    }
}
