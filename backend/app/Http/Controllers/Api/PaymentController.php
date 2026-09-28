<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * Kicks off a payment with the gateway matching the order's payment_method.
     * No real CinetPay/Stripe credentials are configured yet — this returns a
     * mock payment reference so the frontend flow can be wired end-to-end;
     * swap the body for a real gateway API call once keys exist.
     */
    public function initiate(Request $request, int $id)
    {
        $order = $request->user()->orders()->findOrFail($id);

        if ($order->payment_status !== PaymentStatus::Pending) {
            return response()->json(['message' => 'Cette commande a déjà été traitée.'], 422);
        }

        return response()->json([
            'order_id' => $order->id,
            'payment_method' => $order->payment_method,
            'reference' => 'MOCK-'.strtoupper(uniqid()),
            'redirect_url' => null,
        ]);
    }

    public function cinetpayWebhook(Request $request)
    {
        return $this->handleWebhook($request, 'cinetpay');
    }

    public function stripeWebhook(Request $request)
    {
        return $this->handleWebhook($request, 'stripe');
    }

    /**
     * A real integration must verify the payload signature against a gateway-specific
     * secret (e.g. the `x-token` header for CinetPay, `Stripe-Signature` for Stripe)
     * before trusting this payload — wire that check in here once keys are configured.
     */
    private function handleWebhook(Request $request, string $gateway)
    {
        $data = $request->validate([
            'order_id' => ['required', 'integer', 'exists:orders,id'],
            'status' => ['required', 'in:paid,failed'],
        ]);

        $order = Order::findOrFail($data['order_id']);

        if ($data['status'] === 'paid') {
            $order->update(['payment_status' => PaymentStatus::Paid, 'status' => OrderStatus::Confirmed]);
            $order->tracking()->create(['status' => 'Paiement confirmé', 'note' => "Webhook {$gateway}."]);
        } else {
            $order->update(['payment_status' => PaymentStatus::Failed]);
            $order->tracking()->create(['status' => 'Paiement échoué', 'note' => "Webhook {$gateway}."]);
        }

        Log::info("Payment webhook received from {$gateway}", $data);

        return response()->json(['received' => true]);
    }
}
