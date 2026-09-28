<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Narrows a `role:admin,staff` route group to a specific admin/* section
 * for staff accounts (admins always pass through). E.g. `staff.section:finances`
 * lets a Comptable reach /admin/stats/* but not /admin/products.
 */
class EnsureStaffCanAccessSection
{
    public function handle(Request $request, Closure $next, string $section): Response
    {
        if (! $request->user()?->canAccessSection($section)) {
            abort(403, "Votre poste ne donne pas accès à cette section ({$section}).");
        }

        return $next($request);
    }
}
