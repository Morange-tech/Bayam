<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request. `$roles` accepts a comma-separated list
     * (e.g. `role:admin,staff`) so a route can be shared by several roles
     * before narrower gates (like `staff.section`) restrict it further.
     * Laravel splits `param1,param2` into separate `handle()` arguments
     * (not one comma-joined string), hence the variadic here.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! in_array($user->role?->value, $roles, true)) {
            abort(403, 'Accès réservé au rôle '.implode(' ou ', $roles).'.');
        }

        return $next($request);
    }
}
