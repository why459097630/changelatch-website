import { NextResponse } from "next/server";
import {
  createLicenseKey,
  getLicensePurchaseUnit,
  getPayPalAccessToken,
  getPayPalBaseUrl,
  type PayPalOrderResponse,
} from "@/lib/paypal-server";

type CaptureLicenseOrderRequest = {
  paypalOrderId?: unknown;
};

const PAYPAL_ORDER_ID_PATTERN = /^[A-Z0-9]{6,64}$/i;

async function getPayPalOrder(orderId: string, accessToken: string) {
  const response = await fetch(
    `${getPayPalBaseUrl()}/v2/checkout/orders/${encodeURIComponent(orderId)}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

  const data = (await response.json().catch(() => null)) as
    | PayPalOrderResponse
    | null;

  if (!response.ok || !data?.id) {
    throw new Error(data?.message || "Failed to retrieve PayPal order.");
  }

  return data;
}

async function capturePayPalOrder(orderId: string, accessToken: string) {
  const response = await fetch(
    `${getPayPalBaseUrl()}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `patchpilot-license-capture-${orderId}`,
        Prefer: "return=representation",
      },
      body: "{}",
      cache: "no-store",
    },
  );

  const data = (await response.json().catch(() => null)) as
    | PayPalOrderResponse
    | null;

  if (!response.ok || !data?.id) {
    const detailMessage = data?.details?.find(
      (detail) => detail.description,
    )?.description;

    throw new Error(
      detailMessage ||
        data?.message ||
        "Failed to capture PayPal payment.",
    );
  }

  return data;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | CaptureLicenseOrderRequest
      | null;

    const paypalOrderId =
      typeof body?.paypalOrderId === "string"
        ? body.paypalOrderId.trim()
        : "";

    if (!PAYPAL_ORDER_ID_PATTERN.test(paypalOrderId)) {
      return NextResponse.json(
        {
          ok: false,
          error: "A valid PayPal order ID is required.",
        },
        { status: 400 },
      );
    }

    const accessToken = await getPayPalAccessToken();
    const currentOrder = await getPayPalOrder(paypalOrderId, accessToken);

    getLicensePurchaseUnit(currentOrder);

    let completedOrder = currentOrder;

    if (currentOrder.status === "APPROVED") {
      completedOrder = await capturePayPalOrder(paypalOrderId, accessToken);
    } else if (currentOrder.status !== "COMPLETED") {
      return NextResponse.json(
        {
          ok: false,
          error: `PayPal order is not ready to capture. Current status: ${currentOrder.status || "UNKNOWN"}.`,
        },
        { status: 409 },
      );
    }

    if (completedOrder.status !== "COMPLETED") {
      throw new Error("PayPal payment was not completed.");
    }

    const { licenseEmail } = getLicensePurchaseUnit(completedOrder);
    const licenseKey = createLicenseKey(paypalOrderId, licenseEmail);

    return NextResponse.json({
      ok: true,
      status: "completed",
      licenseEmail,
      licenseKey,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to verify PayPal payment.",
      },
      { status: 500 },
    );
  }
}