"use client";

import { useEffect, useState } from "react";
import SiteHeader from "@/components/layout/SiteHeader";

type AdminStatisticsItem = {
  total: number;
  today: number;
  last7Days: number;
  last30Days: number;
};

type AdminStatistics = {
  totalRevenue: AdminStatisticsItem;
  paidOrders: AdminStatisticsItem;
  totalLicenses: AdminStatisticsItem;
  authorizedUsers: AdminStatisticsItem;
  activeDevices: AdminStatisticsItem;
  activeTrials: AdminStatisticsItem;
  websiteVisitors: AdminStatisticsItem;
};

type PaidUser = {
  email: string | null;
  licenseKey: string | null;
  status: string | null;
  registeredAt: string | null;
  purchaseTime: string | null;
  activeDeviceCount: number;
  revokedDeviceCount: number;
  lastUsedAt: string | null;
};

type TrialUser = {
  deviceFingerprint: string;
  status: string;
  remaining: number;
  trialUsed: number;
  createdAt: string;
  lastCheckAt: string | null;
};

type AdminPagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

type AdminAccessResponse = {
  ok: boolean;
  isAdmin?: boolean;
  statistics?: AdminStatistics;
  paidUsers?: PaidUser[];
  trialUsers?: TrialUser[];
  pagination?: {
    paid?: AdminPagination;
    trial?: AdminPagination;
  };
};

function formatDateTime(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(new Date(value))
    .replace(/\//g, "-");
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [statistics, setStatistics] = useState<AdminStatistics | null>(null);
  const [paidUsers, setPaidUsers] = useState<PaidUser[]>([]);
  const [trialUsers, setTrialUsers] = useState<TrialUser[]>([]);
  const [paidPagination, setPaidPagination] = useState<AdminPagination | null>(
    null,
  );
  const [trialPagination, setTrialPagination] = useState<AdminPagination | null>(
    null,
  );
  const [paidPage, setPaidPage] = useState(1);
  const [trialPage, setTrialPage] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "overview" | "paid" | "trial"
  >("overview");
  const [paidUserSearch, setPaidUserSearch] = useState("");
  const [trialUserSearch, setTrialUserSearch] = useState("");

  useEffect(() => {
    async function checkAdminAccess() {
      try {
        const response = await fetch(
          `/api/admin/access?paidPage=${paidPage}&trialPage=${trialPage}`,
          {
            cache: "no-store",
          },
        );

        const data = (await response.json()) as AdminAccessResponse;

        setIsAdmin(Boolean(response.ok && data.ok && data.isAdmin));
        setStatistics(data.statistics || null);
        setPaidUsers(data.paidUsers || []);
        setTrialUsers(data.trialUsers || []);
        setPaidPagination(data.pagination?.paid || null);
        setTrialPagination(data.pagination?.trial || null);
      } catch {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdminAccess();
  }, [paidPage, trialPage]);

  const cards: [string, AdminStatisticsItem][] = statistics
    ? [
        ["总收入", statistics.totalRevenue],
        ["支付订单数", statistics.paidOrders],
        ["License 数量", statistics.totalLicenses],
        ["授权用户数", statistics.authorizedUsers],
        ["活跃设备数", statistics.activeDevices],
        ["试用用户数", statistics.activeTrials],
        ["网站访客数", statistics.websiteVisitors],
      ]
    : [];

  const filteredPaidUsers = paidUsers.filter((user) =>
    `${user.email || ""}${user.licenseKey || ""}`
      .toLowerCase()
      .includes(paidUserSearch.toLowerCase()),
  );

  const filteredTrialUsers = trialUsers.filter((user) =>
    user.deviceFingerprint
      .toLowerCase()
      .includes(trialUserSearch.toLowerCase()),
  );

  const createPageNumbers = (totalPages: number) =>
    Array.from(
      {
        length: Math.min(totalPages, 5),
      },
      (_, index) => index + 1,
    );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="mx-auto min-h-[calc(100vh-80px)] w-full max-w-[1500px] px-6 py-12">
        {loading ? (
          <div className="w-full rounded-2xl border border-border bg-card p-8 shadow-sm">
            Checking access...
          </div>
        ) : !isAdmin ? (
          <div className="w-full rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h1 className="text-3xl font-semibold">
              Access Denied
            </h1>

            <p className="mt-3 text-muted-foreground">
              Administrator access is required.
            </p>
          </div>
        ) : (
          <div className="w-full rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h1 className="text-3xl font-semibold">
              管理后台
            </h1>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setActiveTab("overview")}
                className={`rounded-lg border border-border px-4 py-2 transition-colors ${
                  activeTab === "overview"
                    ? "bg-black text-white"
                    : "bg-transparent text-foreground hover:bg-muted"
                }`}
              >
                数据概览
              </button>

              <button
                onClick={() => setActiveTab("paid")}
                className={`rounded-lg border border-border px-4 py-2 transition-colors ${
                  activeTab === "paid"
                    ? "bg-black text-white"
                    : "bg-transparent text-foreground hover:bg-muted"
                }`}
              >
                付费用户
              </button>

              <button
                onClick={() => setActiveTab("trial")}
                className={`rounded-lg border border-border px-4 py-2 transition-colors ${
                  activeTab === "trial"
                    ? "bg-black text-white"
                    : "bg-transparent text-foreground hover:bg-muted"
                }`}
              >
                试用用户
              </button>
            </div>

            {activeTab === "overview" && (
              <div className="mt-8 grid gap-4 md:grid-cols-4">
                {cards.map(([title, value]) => (
                  <div
                    key={title}
                    className="rounded-xl border border-border p-5"
                  >
                    <h2 className="text-lg font-medium">
                      {title}
                    </h2>

                    <div className="mt-2 flex items-start justify-between gap-4">
                      <p className="text-2xl font-semibold">
                        {value.total}
                      </p>

                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div>
                          今日 {value.today}
                        </div>

                        <div>
                          近7天 {value.last7Days}
                        </div>

                        <div>
                          近30天 {value.last30Days}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "paid" && (
              <div className="mt-8 overflow-x-auto">
                <input
                  value={paidUserSearch}
                  onChange={(event) =>
                    setPaidUserSearch(event.target.value)
                  }
                  placeholder="搜索邮箱或 License Key"
                  className="mb-4 w-full rounded-lg border border-border px-4 py-2"
                />

                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b p-3 text-left">
                        邮箱
                      </th>
                      <th className="border-b p-3 text-left">
                        License Key
                      </th>
                      <th className="border-b p-3 text-left">
                        状态
                      </th>
                      <th className="border-b p-3 text-left">
                        购买时间
                      </th>
                      <th className="border-b p-3 text-left">
                        当前绑定设备
                      </th>
                      <th className="border-b p-3 text-left">
                        历史解绑设备
                      </th>
                      <th className="border-b p-3 text-left">
                        最后使用时间
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredPaidUsers.map((user) => (
                      <tr key={user.licenseKey}>
                        <td className="border-b p-3">
                          {user.email}
                        </td>
                        <td className="border-b p-3">
                          {user.licenseKey}
                        </td>
                        <td className="border-b p-3">
                          {user.status}
                        </td>
                        <td className="border-b p-3">
                          {formatDateTime(user.purchaseTime)}
                        </td>
                        <td className="border-b p-3">
                          {user.activeDeviceCount}
                        </td>
                        <td className="border-b p-3">
                          {user.revokedDeviceCount}
                        </td>
                        <td className="border-b p-3">
                          {formatDateTime(user.lastUsedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {paidPagination && (
                  <div className="mt-6 rounded-xl bg-muted p-4">
                    <div className="flex justify-end items-center gap-4 text-sm">
                      <div className="text-muted-foreground">
                        显示{" "}
                        {(paidPagination.page - 1) *
                          paidPagination.pageSize +
                          1}
                        -
                        {Math.min(
                          paidPagination.page * paidPagination.pageSize,
                          paidPagination.total,
                        )}{" "}
                        / 共 {paidPagination.total} 条
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                      <button
                        disabled={paidPage === 1}
                        onClick={() =>
                          setPaidPage((page) => Math.max(1, page - 1))
                        }
                        className="rounded px-2 py-1 hover:bg-background disabled:opacity-50"
                      >
                        &lt; 上一页
                      </button>

                      {createPageNumbers(paidPagination.totalPages).map((page) => (
                        <button
                          key={page}
                          onClick={() => setPaidPage(page)}
                          className={`rounded px-3 py-1 ${
                            paidPage === page
                              ? "bg-background font-medium"
                              : "hover:bg-background"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        disabled={paidPage === paidPagination.totalPages}
                        onClick={() =>
                          setPaidPage((page) =>
                            Math.min(paidPagination.totalPages, page + 1),
                          )
                        }
                        className="rounded px-2 py-1 hover:bg-background disabled:opacity-50"
                      >
                        下一页 &gt;
                      </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "trial" && (
              <div className="mt-8 overflow-x-auto">
                <input
                  value={trialUserSearch}
                  onChange={(event) =>
                    setTrialUserSearch(event.target.value)
                  }
                  placeholder="搜索设备指纹"
                  className="mb-4 w-full rounded-lg border border-border px-4 py-2"
                />

                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b p-3 text-left">
                        设备指纹
                      </th>
                      <th className="border-b p-3 text-left">
                        状态
                      </th>
                      <th className="border-b p-3 text-left">
                        剩余次数
                      </th>
                      <th className="border-b p-3 text-left">
                        已使用次数
                      </th>
                      <th className="border-b p-3 text-left">
                        首次试用时间
                      </th>
                      <th className="border-b p-3 text-left">
                        最后活动时间
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTrialUsers.map((user) => (
                      <tr key={user.deviceFingerprint}>
                        <td className="border-b p-3">
                          {user.deviceFingerprint}
                        </td>
                        <td className="border-b p-3">
                          {user.status}
                        </td>
                        <td className="border-b p-3">
                          {user.remaining}
                        </td>
                        <td className="border-b p-3">
                          {user.trialUsed}
                        </td>
                        <td className="border-b p-3">
                          {formatDateTime(user.createdAt)}
                        </td>
                        <td className="border-b p-3">
                          {formatDateTime(user.lastCheckAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {trialPagination && (
                  <div className="mt-6 rounded-xl bg-muted p-4">
                    <div className="flex justify-end items-center gap-4 text-sm">
                      <div className="text-muted-foreground">
                        显示{" "}
                        {(trialPagination.page - 1) *
                          trialPagination.pageSize +
                          1}
                        -
                        {Math.min(
                          trialPagination.page * trialPagination.pageSize,
                          trialPagination.total,
                        )}{" "}
                        / 共 {trialPagination.total} 条
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                      <button
                        disabled={trialPage === 1}
                        onClick={() =>
                          setTrialPage((page) => Math.max(1, page - 1))
                        }
                        className="rounded px-2 py-1 hover:bg-background disabled:opacity-50"
                      >
                        &lt; 上一页
                      </button>

                      {createPageNumbers(trialPagination.totalPages).map((page) => (
                        <button
                          key={page}
                          onClick={() => setTrialPage(page)}
                          className={`rounded px-3 py-1 ${
                            trialPage === page
                              ? "bg-background font-medium"
                              : "hover:bg-background"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        disabled={trialPage === trialPagination.totalPages}
                        onClick={() =>
                          setTrialPage((page) =>
                            Math.min(trialPagination.totalPages, page + 1),
                          )
                        }
                        className="rounded px-2 py-1 hover:bg-background disabled:opacity-50"
                      >
                        下一页 &gt;
                      </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}