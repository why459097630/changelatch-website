import { NextResponse } from "next/server";
import { assertAdminAccess } from "@/lib/admin/assertAdminAccess";
import { createAdminClient } from "@/lib/supabase/admin";
import { createLicenseAdminClient } from "@/lib/supabase/licenseAdmin";

export async function GET(request: Request) {
  try {
    const adminCheck = await assertAdminAccess();

    const { searchParams } = new URL(request.url);

    const paidPage = Number(
      searchParams.get("paidPage") || "1",
    );

    const trialPage = Number(
      searchParams.get("trialPage") || "1",
    );

    const pageSize = 20;

    const paidRangeStart = (paidPage - 1) * pageSize;
    const trialRangeStart = (trialPage - 1) * pageSize;

    const paidRangeEnd = paidRangeStart + pageSize - 1;
    const trialRangeEnd = trialRangeStart + pageSize - 1;

    console.log("[ADMIN ACCESS CHECK]", {
      isAdmin: adminCheck.ok,
      email: adminCheck.user?.email || null,
      userId: adminCheck.user?.id || null,
      envAllowlist: process.env.ADMIN_EMAIL_ALLOWLIST || null,
    });

    if (!adminCheck.ok) {
      return NextResponse.json(
        {
          ok: false,
          isAdmin: false,
          error: adminCheck.error,
        },
        {
          status: adminCheck.status,
        },
      );
    }

    const supabaseAdmin = createLicenseAdminClient();
    const webSupabaseAdmin = createAdminClient();

    console.log("[LICENSE SUPABASE CONFIG]", {
      url: process.env.LICENSE_SUPABASE_URL || null,
      serviceRoleKeyExists: Boolean(
        process.env.LICENSE_SUPABASE_SERVICE_ROLE_KEY,
      ),
    });

    console.log("[WEB SUPABASE CONFIG]", {
      url: process.env.WEB_SUPABASE_URL || null,
      serviceRoleKeyExists: Boolean(
        process.env.WEB_SUPABASE_SERVICE_ROLE_KEY,
      ),
    });

    const now = new Date();

    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).toISOString();

    const sevenDaysStart = new Date(
      now.getTime() - 7 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const thirtyDaysStart = new Date(
      now.getTime() - 30 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const [
      ordersResult,
      revenueResult,
      revenueTodayResult,
      revenue7DaysResult,
      revenue30DaysResult,
      paidOrdersTodayResult,
      paidOrders7DaysResult,
      paidOrders30DaysResult,
      licensesResult,
      activeLicensesResult,
      licensesTodayResult,
      licenses7DaysResult,
      licenses30DaysResult,
      activeLicensesTodayResult,
      activeLicenses7DaysResult,
      activeLicenses30DaysResult,
      authorizedUsersResult,
      authorizedUsersTodayResult,
      authorizedUsers7DaysResult,
      authorizedUsers30DaysResult,
      activeDevicesResult,
      activeDevicesTodayResult,
      activeDevices7DaysResult,
      activeDevices30DaysResult,
      trialActiveResult,
      trialCompletedResult,
      trialTodayResult,
      trial7DaysResult,
      trial30DaysResult,
      completedTrialTodayResult,
      completedTrial7DaysResult,
      completedTrial30DaysResult,
      paidUsersResult,
      trialUsersResult,
      usersResult,
      websiteVisitorsResult,
      websiteVisitorsTodayResult,
      websiteVisitors7DaysResult,
      websiteVisitors30DaysResult,
    ] = await Promise.all([
      supabaseAdmin
        .from("license_orders")
        .select("id,email,status,total_amount,currency,created_at,license_id")
        .order("created_at", { ascending: false })
        .limit(10),

      supabaseAdmin
        .from("license_orders")
        .select("total_amount")
        .eq("status", "paid"),

      supabaseAdmin
        .from("license_orders")
        .select("total_amount")
        .eq("status", "paid")
        .gte("created_at", todayStart),

      supabaseAdmin
        .from("license_orders")
        .select("total_amount")
        .eq("status", "paid")
        .gte("created_at", sevenDaysStart),

      supabaseAdmin
        .from("license_orders")
        .select("total_amount")
        .eq("status", "paid")
        .gte("created_at", thirtyDaysStart),

      supabaseAdmin
        .from("license_orders")
        .select("id")
        .eq("status", "paid")
        .gte("created_at", todayStart),

      supabaseAdmin
        .from("license_orders")
        .select("id")
        .eq("status", "paid")
        .gte("created_at", sevenDaysStart),

      supabaseAdmin
        .from("license_orders")
        .select("id")
        .eq("status", "paid")
        .gte("created_at", thirtyDaysStart),

      supabaseAdmin
        .from("licenses")
        .select("id"),

      supabaseAdmin
        .from("licenses")
        .select("id")
        .eq("status", "active"),

      supabaseAdmin
        .from("licenses")
        .select("id")
        .gte("created_at", todayStart),

      supabaseAdmin
        .from("licenses")
        .select("id")
        .gte("created_at", sevenDaysStart),

      supabaseAdmin
        .from("licenses")
        .select("id")
        .gte("created_at", thirtyDaysStart),

      supabaseAdmin
        .from("licenses")
        .select("id")
        .eq("status", "active")
        .gte("created_at", todayStart),

      supabaseAdmin
        .from("licenses")
        .select("id")
        .eq("status", "active")
        .gte("created_at", sevenDaysStart),

      supabaseAdmin
        .from("licenses")
        .select("id")
        .eq("status", "active")
        .gte("created_at", thirtyDaysStart),

      supabaseAdmin
        .from("licenses")
        .select("normalized_email"),

      supabaseAdmin
        .from("licenses")
        .select("normalized_email")
        .gte("created_at", todayStart),

      supabaseAdmin
        .from("licenses")
        .select("normalized_email")
        .gte("created_at", sevenDaysStart),

      supabaseAdmin
        .from("licenses")
        .select("normalized_email")
        .gte("created_at", thirtyDaysStart),

      supabaseAdmin
        .from("license_activations")
        .select("id")
        .is("revoked_at", null),

      supabaseAdmin
        .from("license_activations")
        .select("id")
        .is("revoked_at", null)
        .gte("created_at", todayStart),

      supabaseAdmin
        .from("license_activations")
        .select("id")
        .is("revoked_at", null)
        .gte("created_at", sevenDaysStart),

      supabaseAdmin
        .from("license_activations")
        .select("id")
        .is("revoked_at", null)
        .gte("created_at", thirtyDaysStart),

      supabaseAdmin
        .from("trial_records")
        .select("id")
        .eq("status", "active"),

      supabaseAdmin
        .from("trial_records")
        .select("id")
        .eq("status", "completed"),

      supabaseAdmin
        .from("trial_records")
        .select("id")
        .eq("status", "active")
        .gte("created_at", todayStart),

      supabaseAdmin
        .from("trial_records")
        .select("id")
        .eq("status", "active")
        .gte("created_at", sevenDaysStart),

      supabaseAdmin
        .from("trial_records")
        .select("id")
        .eq("status", "active")
        .gte("created_at", thirtyDaysStart),

      supabaseAdmin
        .from("trial_records")
        .select("id")
        .eq("status", "completed")
        .gte("created_at", todayStart),

      supabaseAdmin
        .from("trial_records")
        .select("id")
        .eq("status", "completed")
        .gte("created_at", sevenDaysStart),

      supabaseAdmin
        .from("trial_records")
        .select("id")
        .eq("status", "completed")
        .gte("created_at", thirtyDaysStart),

      supabaseAdmin
        .from("licenses")
        .select(
          `
            license_key,
            status,
            created_at,
            email,
            license_orders (
              created_at
            ),
            license_activations (
              id,
              last_check_at
            )
          `,
          {
            count: "exact",
          },
        )
        .order("created_at", { ascending: false })
        .range(paidRangeStart, paidRangeEnd),

      supabaseAdmin
        .from("trial_records")
        .select(
          `
            device_fingerprint,
            trial_limit,
            trial_used,
            status,
            created_at,
            updated_at
          `,
          {
            count: "exact",
          },
        )
        .order("created_at", { ascending: false })
        .range(trialRangeStart, trialRangeEnd),

      supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1,
      }),

      webSupabaseAdmin.rpc(
        "count_unique_page_visitors",
      ),

      webSupabaseAdmin.rpc(
        "count_unique_page_visitors",
        {
          start_time: todayStart,
        },
      ),

      webSupabaseAdmin.rpc(
        "count_unique_page_visitors",
        {
          start_time: sevenDaysStart,
        },
      ),

      webSupabaseAdmin.rpc(
        "count_unique_page_visitors",
        {
          start_time: thirtyDaysStart,
        },
      ),
    ]);

    console.log("[PAID USERS QUERY RESULT]", {
      data: paidUsersResult.data,
      error: paidUsersResult.error,
      count: paidUsersResult.data?.length || 0,
    });

    const totalRevenue =
      revenueResult.data?.reduce(
        (sum, item) => sum + Number(item.total_amount || 0),
        0,
      ) || 0;

    const getRevenue = (
      data: { total_amount: number | null }[] | null,
    ) =>
      data?.reduce(
        (sum, item) => sum + Number(item.total_amount || 0),
        0,
      ) || 0;

    const paidUsers =
      paidUsersResult.data?.map((item) => ({
        email: item.email,
        licenseKey: item.license_key,
        status: item.status,
        registeredAt: item.created_at,
        purchaseTime: item.license_orders?.[0]?.created_at || null,
        deviceCount: item.license_activations?.length || 0,
        lastUsedAt:
          item.license_activations?.reduce(
            (latest, activation) =>
              !latest ||
              (activation.last_check_at &&
                activation.last_check_at > latest)
                ? activation.last_check_at
                : latest,
            null as string | null,
          ) || null,
      })) || [];

    const trialUsers =
      trialUsersResult.data?.map((item) => ({
        deviceFingerprint: item.device_fingerprint,
        status: item.status,
        remaining: item.trial_limit - item.trial_used,
        trialUsed: item.trial_used,
        createdAt: item.created_at,
        lastCheckAt: item.updated_at,
      })) || [];

    const countUniqueEmails = (
      data: { normalized_email: string | null }[] | null,
    ) =>
      new Set(
        (data || [])
          .map((item) => item.normalized_email)
          .filter(Boolean),
      ).size;

    const getVisitorCount = (
      value: number | null,
    ) =>
      Number(value || 0);

    return NextResponse.json({
      ok: true,
      isAdmin: true,
      email: adminCheck.user?.email || null,
      userId: adminCheck.user?.id || null,
      statistics: {
        totalRevenue: {
          total: totalRevenue,
          today: getRevenue(revenueTodayResult.data),
          last7Days: getRevenue(revenue7DaysResult.data),
          last30Days: getRevenue(revenue30DaysResult.data),
        },
        paidOrders: {
          total: ordersResult.data?.length || 0,
          today: paidOrdersTodayResult.data?.length || 0,
          last7Days: paidOrders7DaysResult.data?.length || 0,
          last30Days: paidOrders30DaysResult.data?.length || 0,
        },
        totalLicenses: {
          total: licensesResult.data?.length || 0,
          today: licensesTodayResult.data?.length || 0,
          last7Days: licenses7DaysResult.data?.length || 0,
          last30Days: licenses30DaysResult.data?.length || 0,
        },
        authorizedUsers: {
          total: countUniqueEmails(authorizedUsersResult.data),
          today: countUniqueEmails(authorizedUsersTodayResult.data),
          last7Days: countUniqueEmails(authorizedUsers7DaysResult.data),
          last30Days: countUniqueEmails(authorizedUsers30DaysResult.data),
        },
        activeDevices: {
          total: activeDevicesResult.data?.length || 0,
          today: activeDevicesTodayResult.data?.length || 0,
          last7Days: activeDevices7DaysResult.data?.length || 0,
          last30Days: activeDevices30DaysResult.data?.length || 0,
        },
        activeTrials: {
          total: trialActiveResult.data?.length || 0,
          today: trialTodayResult.data?.length || 0,
          last7Days: trial7DaysResult.data?.length || 0,
          last30Days: trial30DaysResult.data?.length || 0,
        },
        websiteVisitors: {
          total: getVisitorCount(
            websiteVisitorsResult.data,
          ),
          today: getVisitorCount(
            websiteVisitorsTodayResult.data,
          ),
          last7Days: getVisitorCount(
            websiteVisitors7DaysResult.data,
          ),
          last30Days: getVisitorCount(
            websiteVisitors30DaysResult.data,
          ),
        },
      },
      recentOrders: ordersResult.data || [],
      paidUsers,
      trialUsers,
      pagination: {
        paid: {
          page: paidPage,
          pageSize,
          total: paidUsersResult.count || 0,
          totalPages: Math.ceil(
            (paidUsersResult.count || 0) / pageSize,
          ),
        },
        trial: {
          page: trialPage,
          pageSize,
          total: trialUsersResult.count || 0,
          totalPages: Math.ceil(
            (trialUsersResult.count || 0) / pageSize,
          ),
        },
      },
    });
  } catch (error) {
    console.error("[ADMIN DASHBOARD ERROR]", error);

    return NextResponse.json(
      {
        ok: false,
        isAdmin: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to check admin access.",
      },
      {
        status: 500,
      },
    );
  }
}