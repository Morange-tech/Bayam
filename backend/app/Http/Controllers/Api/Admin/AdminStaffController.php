<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\StaffRole;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreStaffRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

/**
 * Admin-only management of staff accounts (role:admin strictly — never
 * reachable by a staff token, even one with the `admin` poste equivalent,
 * so a Comptable can't create fellow staff). Each staff account's `staff_role`
 * (its "poste") is what the `staff.section` middleware checks elsewhere in
 * routes/api.php to scope what it can reach — e.g. Comptable → finances only.
 */
class AdminStaffController extends Controller
{
    public function index()
    {
        return UserResource::collection(
            User::query()->where('role', UserRole::Staff)->latest()->get()
        );
    }

    public function store(StoreStaffRequest $request)
    {
        $staff = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => UserRole::Staff,
            'staff_role' => $request->staff_role,
        ]);

        return response()->json(new UserResource($staff), 201);
    }

    public function update(Request $request, User $staff)
    {
        abort_unless($staff->role === UserRole::Staff, 404);

        $data = $request->validate([
            'first_name' => ['sometimes', 'string', 'min:2', 'max:255'],
            'last_name' => ['sometimes', 'string', 'min:2', 'max:255'],
            'staff_role' => ['sometimes', Rule::enum(StaffRole::class)],
        ]);

        $staff->update($data);

        // Explicit response()->json() (rather than returning the Resource directly)
        // keeps this flat like store()'s response, instead of Laravel's default
        // Responsable auto-wrap in {"data": ...} for a single resource.
        return response()->json(new UserResource($staff));
    }

    public function destroy(User $staff)
    {
        abort_unless($staff->role === UserRole::Staff, 404);

        $staff->tokens()->delete();
        $staff->delete();

        return response()->json(status: 204);
    }
}
