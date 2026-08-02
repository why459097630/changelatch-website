import { createHmac } from "node:crypto";

export const LICENSE_PRICE = "29.99";
export const LICENSE_CURRENCY = "USD";
export const LICENSE_REFERENCE_ID = "changelatch-personal-license";
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type PayPalAccessTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

export type PayPalAmount = {
  currency_code?: string;
  value?: string;
};

export type PayPalPurchaseUnit = {
  reference_id?: string;
  custom_id?: string;
  amount?: PayPalAmount;
  payments?: {
    captures?: Array<{
      status?: string;
      amount?: PayPalAmount;
    }>;
  };
};

export type PayPalOrderResponse = {
  id?: string;
  status?: string;
  purchase_units?: PayPalPurchaseUnit[];
  links?: Array<{
    href?: string;
    rel?: string;
  }>;
  details?: Array<{
    issue?: string;
    description?: string;
  }>;
  message?: string;
};

export function getPayPalBaseUrl() {
  return process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

export async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID?.trim();
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are not configured.");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as
    | PayPalAccessTokenResponse
    | null;

  if (!response.ok || !data?.access_token) {
    throw new Error(
      data?.error_description ||
        data?.error ||
        "Failed to authenticate with PayPal.",
    );
  }

  return data.access_token;
}

export function getLicensePurchaseUnit(order: PayPalOrderResponse) {
  const purchaseUnit = order.purchase_units?.find(
    (unit) => unit.reference_id === LICENSE_REFERENCE_ID,
  );

  if (!purchaseUnit) {
    throw new Error("PayPal order does not contain a ChangeLatch license purchase.");
  }

  const licenseEmail = purchaseUnit.custom_id?.trim().toLowerCase() || "";

  if (!EMAIL_PATTERN.test(licenseEmail)) {
    throw new Error("PayPal order does not contain a valid license email.");
  }

  if (
    purchaseUnit.amount?.currency_code !== LICENSE_CURRENCY ||
    purchaseUnit.amount?.value !== LICENSE_PRICE
  ) {
    throw new Error("PayPal order amount does not match the ChangeLatch license price.");
  }

  const completedCapture = purchaseUnit.payments?.captures?.find(
    (capture) => capture.status === "COMPLETED",
  );

  if (completedCapture) {
    if (
      completedCapture.amount?.currency_code !== LICENSE_CURRENCY ||
      completedCapture.amount?.value !== LICENSE_PRICE
    ) {
      throw new Error("Captured PayPal amount does not match the ChangeLatch license price.");
    }
  }

  return {
    licenseEmail,
    purchaseUnit,
  };
}

export function createLicenseKey(paypalOrderId: string, licenseEmail: string) {
  const signingSecret =
    process.env.LICENSE_KEY_SECRET?.trim() ||
    process.env.PAYPAL_CLIENT_SECRET?.trim();

  if (!signingSecret) {
    throw new Error("License key signing secret is not configured.");
  }

  const digest = createHmac("sha256", signingSecret)
    .update(`changelatch:${paypalOrderId}:${licenseEmail}`)
    .digest("hex")
    .toUpperCase();

  return `CL-${digest.slice(0, 4)}-${digest.slice(4, 8)}-${digest.slice(8, 12)}-${digest.slice(12, 16)}`;
}