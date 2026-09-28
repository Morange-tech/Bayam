<?php

namespace App\Enums;

/**
 * The "poste" an admin assigns when creating a staff account (User with
 * role = UserRole::Staff). Each poste maps to the admin/* sections it may
 * reach — e.g. Comptable is scoped to `finances` only — enforced by the
 * `staff.section` middleware alongside the `role:admin,staff` gate in
 * routes/api.php.
 */
enum StaffRole: string
{
    case Comptable = 'comptable';
    case Commandes = 'commandes';
    case Catalogue = 'catalogue';
    case Support = 'support';

    public function label(): string
    {
        return match ($this) {
            self::Comptable => 'Comptable',
            self::Commandes => 'Gestionnaire commandes',
            self::Catalogue => 'Gestionnaire catalogue',
            self::Support => 'Support client',
        };
    }

    /**
     * admin/* section keys this poste may access, checked by the
     * `staff.section:<key>` middleware. An admin bypasses this entirely.
     *
     * @return string[]
     */
    public function sections(): array
    {
        return match ($this) {
            self::Comptable => ['finances'],
            self::Commandes => ['commandes'],
            self::Catalogue => ['catalogue'],
            self::Support => ['utilisateurs'],
        };
    }
}
