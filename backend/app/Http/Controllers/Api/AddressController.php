<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->addresses()->orderByDesc('is_default')->get();
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['user_id'] = $request->user()->id;

        if ($data['is_default'] ?? false) {
            $request->user()->addresses()->update(['is_default' => false]);
        }

        $address = Address::create($data);

        return response()->json($address, 201);
    }

    public function show(Request $request, Address $address)
    {
        $this->authorizeOwner($request, $address);

        return $address;
    }

    public function update(Request $request, Address $address)
    {
        $this->authorizeOwner($request, $address);

        $data = $this->validated($request);

        if ($data['is_default'] ?? false) {
            $request->user()->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
        }

        $address->update($data);

        return $address;
    }

    public function destroy(Request $request, Address $address)
    {
        $this->authorizeOwner($request, $address);
        $address->delete();

        return response()->json(status: 204);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'label' => ['nullable', 'string', 'max:255'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'city' => ['required', 'string', 'max:255'],
            'neighborhood' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:500'],
            'is_default' => ['boolean'],
        ]);
    }

    private function authorizeOwner(Request $request, Address $address): void
    {
        abort_unless($address->user_id === $request->user()->id, 403);
    }
}
