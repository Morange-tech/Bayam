<?php

namespace App\Models;

use App\Enums\PromoType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PromoCode extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'type',
        'value',
        'expires_at',
        'max_uses',
        'used_count',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'type' => PromoType::class,
            'expires_at' => 'datetime',
            'is_active' => 'boolean',
            'value' => 'integer',
            'max_uses' => 'integer',
            'used_count' => 'integer',
        ];
    }

    public function isValid(): bool
    {
        if (! $this->is_active) {
            return false;
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        if ($this->max_uses && $this->used_count >= $this->max_uses) {
            return false;
        }

        return true;
    }

    public function discountFor(int $subtotal): int
    {
        $discount = $this->type === PromoType::Percent
            ? (int) round($subtotal * $this->value / 100)
            : $this->value;

        return min($discount, $subtotal);
    }
}
