import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  EMAIL_PATTERN,
  LICENSE_CURRENCY,
  LICENSE_PRICE,
  LICENSE_REFERENCE_ID,
  getPayPalAccessToken,
  getPayPalBaseUrl,
  type PayPalOrderResponse,
} from "@/lib/paypal-server";

type CreateLicenseOrderRequest = {
  licenseEmail?: unknown;
};

function getSiteUrl(request: Request) {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredSiteUrl) {
    return configuredSiteUrl.replace(/\/$/, "");
  }

  return new URL(request.url).origin;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | CreateLicenseOrderRequest
      | null;

    const licenseEmail =
      typeof body?.licenseEmail === "string"
        ? body.licenseEmail.trim().toLowerCase()
        : "";

    if (!EMAIL_PATTERN.test(licenseEmail)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Enter a valid license email.",
        },
        { status: 400 },
      );
    }

    const accessToken = await getPayPalAccessToken();
    const siteUrl = getSiteUrl(request);

    const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": randomUUID(),
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: LICENSE_REFERENCE_ID,
            custom_id: licenseEmail,
            description: "PatchPilot Personal License",
            amount: {
              currency_code: LICENSE_CURRENCY,
              value: LICENSE_PRICE,
            },
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              brand_name: "PatchPilot",
              landing_page: "LOGIN",
              shipping_preference: "NO_SHIPPING",
              user_action: "PAY_NOW",
              return_url: `${siteUrl}/purchase-success?provider=paypal`,
              cancel_url: `${siteUrl}/pricing?payment=cancelled`,
            },
          },
        },
      }),
      cache: "no-store",
    });

    const data = (await response.json().catch(() => null)) as
      | PayPalOrderResponse
      | null;

    const approvalUrl =
      data?.links?.find((link) => link.rel === "payer-action")?.href ||
      data?.links?.find((link) => link.rel === "approve")?.href;

    if (!response.ok || !data?.id || !approvalUrl) {
      const detailMessage = data?.details?.find(
        (detail) => detail.description,
      )?.description;

      throw new Error(
        detailMessage ||
          data?.message ||
          "Failed to create PayPal order.",
      );
    }

    return NextResponse.json({
      ok: true,
      orderId: data.id,
      url: approvalUrl,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create PayPal order.",
      },
      { status: 500 },
    );
  }
}