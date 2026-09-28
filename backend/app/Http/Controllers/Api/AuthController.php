<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => UserRole::Customer,
        ]);

        $token = $user->createToken('bayam-web')->plainTextToken;

        return response()->json(['user' => new UserResource($user), 'token' => $token], 201);
    }

    public function login(LoginRequest $request)
    {
        if (! Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Email ou mot de passe incorrect.'], 422);
        }

        $user = Auth::user();

        if ($user->isBanned()) {
            Auth::logout();

            return response()->json(['message' => 'Ce compte a été suspendu.'], 422);
        }

        $token = $user->createToken('bayam-web')->plainTextToken;

        return response()->json(['user' => new UserResource($user), 'token' => $token]);
    }

    /**
     * No OAuth provider is wired up yet — a real implementation verifies `access_token`
     * against Google/Facebook (e.g. via Laravel Socialite) before creating/logging in
     * the user. This validates the payload shape and reports the feature as unavailable.
     */
    public function socialLogin(Request $request)
    {
        $request->validate([
            'provider' => ['required', 'in:google,facebook'],
            'access_token' => ['required', 'string'],
        ]);

        return response()->json(['message' => 'Connexion sociale non configurée.'], 501);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté.']);
    }

    public function me(Request $request)
    {
        return new UserResource($request->user());
    }
}
