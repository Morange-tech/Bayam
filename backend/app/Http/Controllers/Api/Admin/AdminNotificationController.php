<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AdminNotificationController extends Controller
{
    /**
     * No push/SMS/email provider is wired up yet — this validates the payload and
     * logs it so the endpoint is exercisable end-to-end; swap the body for a real
     * notification dispatch (queued job/mailable) once a provider is configured.
     */
    public function send(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:1000'],
            'audience' => ['required', 'in:all,customers,admins'],
        ]);

        Log::info('Admin notification queued (mock)', $data);

        return response()->json(['message' => 'Notification mise en file d\'attente.', 'queued' => $data]);
    }
}
