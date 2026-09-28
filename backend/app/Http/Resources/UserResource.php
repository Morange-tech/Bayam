<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Maps the DB's snake_case columns onto the camelCase shape the frontend's
 * authStore/User interface expects (see frontend/stores/authStore.js).
 */
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'firstName' => $this->first_name,
            'lastName' => $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->role->value,
            'staffRole' => $this->staff_role?->value,
            'staffSections' => $this->staff_role?->sections() ?? [],
            'avatarUrl' => $this->avatar_url ?? null,
        ];
    }
}
