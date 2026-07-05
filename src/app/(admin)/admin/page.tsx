"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  LoaderCircle,
  ShieldAlert,
  ShieldCheck,
  Star,
  UserCog,
  Users,
  Wrench,
} from "lucide-react";
import {
  getAdminDashboard,
  getAdminUsers,
  getApprovedTechnicians,
  setUserAsAdmin,
} from "@/services/admin.service";
import {
  AdminDashboardData,
  AdminTechnician,
  AdminUser,
  PaginationMeta,
} from "@/types/admin.types";

type LoadingState = {
  dashboard: boolean;
  approved: boolean;
  users: boolean;
};

const INITIAL_LOADING: LoadingState = {
  dashboard: true,
  approved: true,
  users: true,
};

const EMPTY_META: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

const ROLE_FILTERS: Array<{ label: string; value: "all" | AdminUser["role"] }> = [
  { label: "الكل", value: "all" },
  { label: "عملاء", value: "client" },
  { label: "فنيون", value: "technician" },
  { label: "مديرون", value: "admin" },
];

const statusStyles: Record<string, string> = {
  accepted: "bg-cyan-50 text-cyan-700 border-cyan-200",
  in_progress: "bg-sky-50 text-sky-700 border-sky-200",
  on_the_way: "bg-indigo-50 text-indigo-700 border-indigo-200",
  started: "bg-violet-50 text-violet-700 border-violet-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
};

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  accepted: "مقبول",
  in_progress: "قيد التنفيذ",
  on_the_way: "في الطريق",
  started: "بدأ العمل",
  completed: "مكتمل",
  cancelled: "ملغي",
};

function formatDate(value?: string) {
  if (!value) {
    return "غير متوفر";
  }

  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function MetricCard({
  title,
  value,
  helper,
  icon: Icon,
  accentClass,
}: {
  title: string;
  value: number;
  helper: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  accentClass: string;
}) {
  return (
    <div className="rounded-[30px] border border-[#E4ECE7] bg-white/90 p-6 shadow-[0_20px_60px_rgba(17,45,39,0.08)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[#70817A]">{title}</p>
          <p className="mt-3 text-4xl font-bold text-[var(--primary-color)]">
            {value}
          </p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentClass}`}
        >
          <Icon size={22} className="text-[var(--primary-color)]" />
        </div>
      </div>
      <p className="text-sm text-[#5F726B]">{helper}</p>
    </div>
  );
}

function SectionShell({
  id,
  title,
  description,
  action,
  children,
}: {
  id?: string;
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="rounded-[34px] border border-[#E4ECE7] bg-white/90 p-6 shadow-[0_20px_60px_rgba(17,45,39,0.08)] md:p-8"
    >
      <div className="mb-6 flex flex-col gap-3 border-b border-[#EEF2EE] pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--primary-color)]">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-7 text-[#6C7E77]">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [approvedTechnicians, setApprovedTechnicians] = useState<AdminTechnician[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [approvedMeta, setApprovedMeta] = useState<PaginationMeta>(EMPTY_META);
  const [usersMeta, setUsersMeta] = useState<PaginationMeta>(EMPTY_META);
  const [loading, setLoading] = useState<LoadingState>(INITIAL_LOADING);
  const [pageError, setPageError] = useState("");
  const [submittingAction, setSubmittingAction] = useState<string | null>(null);
  const [userRoleFilter, setUserRoleFilter] = useState<"all" | AdminUser["role"]>("all");
  const [feedback, setFeedback] = useState("");

  const loadDashboard = async () => {
    setLoading((prev) => ({ ...prev, dashboard: true }));
    const { data } = await getAdminDashboard();
    setDashboard(data.data);
    setLoading((prev) => ({ ...prev, dashboard: false }));
  };

  const loadApprovedTechnicians = async () => {
    setLoading((prev) => ({ ...prev, approved: true }));
    const { data } = await getApprovedTechnicians();
    setApprovedTechnicians(data.data);
    setApprovedMeta(data.meta);
    setLoading((prev) => ({ ...prev, approved: false }));
  };

  const loadUsers = async (role: "all" | AdminUser["role"]) => {
    setLoading((prev) => ({ ...prev, users: true }));
    const { data } = await getAdminUsers(1, 10, role === "all" ? undefined : role);
    setUsers(data.data);
    setUsersMeta(data.meta);
    setLoading((prev) => ({ ...prev, users: false }));
  };

  useEffect(() => {
    const loadPage = async () => {
      try {
        setPageError("");
        await Promise.all([loadDashboard(), loadApprovedTechnicians()]);
      } catch {
        setPageError("تعذر تحميل لوحة التحكم حالياً. حاول مرة أخرى بعد قليل.");
        setLoading({
          dashboard: false,
          approved: false,
          users: false,
        });
      }
    };

    void loadPage();
  }, []);

  useEffect(() => {
    const refreshUsers = async () => {
      try {
        await loadUsers(userRoleFilter);
      } catch {
        setPageError("تعذر تحديث قائمة المستخدمين.");
      }
    };

    void refreshUsers();
  }, [userRoleFilter]);

  const handlePromoteUser = async (userId: string) => {
    try {
      setSubmittingAction(userId);
      setFeedback("");
      await setUserAsAdmin(userId);
      setFeedback("تمت ترقية المستخدم إلى مدير.");
      await Promise.all([loadDashboard(), loadUsers(userRoleFilter)]);
    } catch {
      setFeedback("تعذر ترقية المستخدم الآن.");
    } finally {
      setSubmittingAction(null);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#F5FAF4_0%,#FCFDFB_28%,#F7F8F6_100%)]" dir="rtl">
      <div className="mx-auto flex w-full max-w-[1450px] flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <section className="relative overflow-hidden rounded-[38px] border border-[#DDE8E1] bg-[radial-gradient(circle_at_top_right,rgba(179,231,24,0.22),transparent_30%),linear-gradient(135deg,#163D35_0%,#1C4B41_45%,#2F6254_100%)] p-7 text-white shadow-[0_24px_70px_rgba(17,45,39,0.18)] md:p-10">
          <div className="absolute left-[-40px] top-[-40px] h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-[-70px] right-[-20px] h-52 w-52 rounded-full bg-[var(--accent-color)]/20 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white/90">
                <ShieldCheck size={14} />
                صلاحيات الإدارة مفعلة
              </span>
              <h1 className="mt-5 text-3xl font-bold leading-tight md:text-5xl">
                متابعة المنصة ومراقبة النشاط من لوحة قيادة مختصرة
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-white/78 md:text-base">
                هذه الشاشة مخصصة للمؤشرات السريعة والقرارات الإدارية اليومية، بينما
                انتقلت مراجعة الفنيين الجدد بالكامل إلى صفحة مستقلة أكثر تركيزاً.
              </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:min-w-[360px]">
              <div className="rounded-[28px] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-sm text-white/70">المستخدمون</p>
                <p className="mt-2 text-3xl font-bold">
                  {dashboard?.users.total ?? 0}
                </p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-sm text-white/70">الفنيون بانتظار القرار</p>
                <p className="mt-2 text-3xl font-bold">
                  {dashboard?.technicians.pending ?? 0}
                </p>
              </div>
            </div>
          </div>
        </section>

        {pageError ? (
          <div className="flex items-start gap-3 rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <p className="text-sm">{pageError}</p>
          </div>
        ) : null}

        {feedback ? (
          <div className="flex items-start gap-3 rounded-[24px] border border-[#DDE8E1] bg-white px-5 py-4 text-[#31554B] shadow-sm">
            <BadgeCheck size={18} className="mt-0.5 flex-shrink-0 text-[var(--accent-hover)]" />
            <p className="text-sm">{feedback}</p>
          </div>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-3">
          <MetricCard
            title="إجمالي المستخدمين"
            value={dashboard?.users.total ?? 0}
            helper={`عملاء: ${dashboard?.users.clients ?? 0} • فنيون: ${dashboard?.users.technicians ?? 0} • مديرون: ${dashboard?.users.admins ?? 0}`}
            icon={Users}
            accentClass="bg-[#EEF8DB]"
          />
          <MetricCard
            title="حالة الفنيين"
            value={dashboard?.technicians.total ?? 0}
            helper={`مقبولون: ${dashboard?.technicians.approved ?? 0} • بانتظار: ${dashboard?.technicians.pending ?? 0}`}
            icon={Wrench}
            accentClass="bg-[#E7F0FF]"
          />
          <MetricCard
            title="حركة الطلبات"
            value={dashboard?.requests.total ?? 0}
            helper={`قيد التنفيذ: ${dashboard?.requests.inProgress ?? 0} • مكتملة: ${dashboard?.requests.completed ?? 0}`}
            icon={ArrowUpRight}
            accentClass="bg-[#FFF3DD]"
          />
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
          <SectionShell
            title="مراجعة الفنيين الجدد"
            description="انتقلت عملية المراجعة إلى صفحة مستقلة تعرض الملفات والبيانات وقرارات القبول أو الرفض في مكان واحد."
            action={
              <Link
                href="/admin/technician-reviews"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--primary-color)] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#163D35]"
              >
                <span>فتح صفحة المراجعة</span>
                <ArrowLeft size={16} />
              </Link>
            }
          >
            <div className="rounded-[28px] border border-[#E7ECE7] bg-[#FBFCFB] p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg font-bold text-[var(--primary-color)]">
                    الطلبات المعلقة حالياً
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#6C7E77]">
                    استخدم الصفحة المخصصة لمراجعة صور البطاقة والملفات المرفوعة ثم
                    اعتماد الفني أو رفضه بسبب واضح.
                  </p>
                </div>
                <div className="rounded-[26px] bg-[#F5FAF2] px-6 py-5 text-center">
                  <p className="text-sm text-[#6C7E77]">بانتظار القرار</p>
                  <p className="mt-2 text-4xl font-bold text-[var(--primary-color)]">
                    {dashboard?.technicians.pending ?? 0}
                  </p>
                </div>
              </div>
            </div>
          </SectionShell>

          <SectionShell
            title="أفضل الفنيين"
            description="ترتيب سريع للفنيين المعتمدين حسب متوسط التقييم."
          >
            {loading.dashboard ? (
              <div className="flex min-h-[220px] items-center justify-center">
                <LoaderCircle className="animate-spin text-[var(--primary-color)]" size={28} />
              </div>
            ) : (
              <div className="space-y-3">
                {dashboard?.topTechnicians.length ? (
                  dashboard.topTechnicians.map((technician, index) => (
                    <div
                      key={technician._id}
                      className="flex items-center justify-between rounded-[24px] border border-[#EEF2EE] bg-[#FBFCFB] p-4"
                    >
                      <div>
                        <p className="text-sm font-bold text-[var(--primary-color)]">
                          {index + 1}. {technician.userId?.fullName || "فني"}
                        </p>
                        <p className="mt-2 text-xs text-[#6F827A]">
                          {technician.userId?.phone || "بدون رقم هاتف"}
                        </p>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star size={14} fill="currentColor" />
                          <span className="text-sm font-bold">
                            {technician.averageRating.toFixed(1)}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-[#6F827A]">
                          {technician.totalReviews} مراجعة
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#70827B]">لا توجد بيانات كافية بعد.</p>
                )}
              </div>
            )}
          </SectionShell>
        </div>

        <SectionShell
          title="أحدث الطلبات"
          description="نظرة سريعة على آخر ما دخل المنصة لتقدير الضغط التشغيلي."
        >
          {loading.dashboard ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <LoaderCircle className="animate-spin text-[var(--primary-color)]" size={28} />
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {dashboard?.recentRequests.length ? (
                dashboard.recentRequests.map((request) => (
                  <div
                    key={request._id}
                    className="rounded-[24px] border border-[#EEF2EE] bg-[#FBFCFB] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-[var(--primary-color)]">
                          {request.title}
                        </p>
                        <p className="mt-2 text-xs text-[#6F827A]">
                          {request.userId?.fullName || "بدون اسم عميل"}
                        </p>
                      </div>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${
                          statusStyles[request.status] ??
                          "border-slate-200 bg-slate-100 text-slate-700"
                        }`}
                      >
                        {statusLabels[request.status] ?? request.status}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-[#83958E]">
                      {formatDate(request.createdAt)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#70827B]">لا توجد طلبات حديثة.</p>
              )}
            </div>
          )}
        </SectionShell>

        <SectionShell
          id="technicians"
          title="الفنيون المعتمدون"
          description="متابعة الفنيين الذين تم اعتمادهم بالفعل مع مؤشرات الأداء والتوفر."
          action={
            <span className="rounded-full bg-[#F5FAF2] px-4 py-2 text-sm font-medium text-[var(--primary-color)]">
              {loading.approved ? "جارٍ التحديث..." : `${approvedMeta.total} فني`}
            </span>
          }
        >
          {loading.approved ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <LoaderCircle className="animate-spin text-[var(--primary-color)]" size={28} />
            </div>
          ) : approvedTechnicians.length === 0 ? (
            <p className="text-sm text-[#70827B]">لا يوجد فنيون معتمدون حالياً.</p>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {approvedTechnicians.map((technician) => (
                <div
                  key={technician._id}
                  className="rounded-[28px] border border-[#E7ECE7] bg-[#FBFCFB] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-[var(--primary-color)]">
                        {technician.userId.fullName}
                      </p>
                      <p className="mt-1 text-sm text-[#6F827A]">
                        {technician.userId.city || "غير متوفر"}،{" "}
                        {technician.userId.governorate || "غير متوفر"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${
                        technician.isAvailable
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-slate-100 text-slate-700"
                      }`}
                    >
                      {technician.isAvailable ? "متاح" : "غير متاح"}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-[20px] bg-white p-3">
                      <p className="text-xs text-[#7A8A84]">التقييم</p>
                      <p className="mt-2 flex items-center gap-1 text-sm font-bold text-[var(--primary-color)]">
                        <Star size={14} className="text-amber-500" fill="currentColor" />
                        {technician.averageRating.toFixed(1)}
                      </p>
                    </div>
                    <div className="rounded-[20px] bg-white p-3">
                      <p className="text-xs text-[#7A8A84]">المراجعات</p>
                      <p className="mt-2 text-sm font-bold text-[var(--primary-color)]">
                        {technician.totalReviews}
                      </p>
                    </div>
                    <div className="rounded-[20px] bg-white p-3">
                      <p className="text-xs text-[#7A8A84]">سنوات الخبرة</p>
                      <p className="mt-2 text-sm font-bold text-[var(--primary-color)]">
                        {technician.yearsOfExperience}
                      </p>
                    </div>
                    <div className="rounded-[20px] bg-white p-3">
                      <p className="text-xs text-[#7A8A84]">مناطق الخدمة</p>
                      <p className="mt-2 text-sm font-bold text-[var(--primary-color)]">
                        {technician.serviceAreas.length}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-[#71847C]">
                    تاريخ الاعتماد: {formatDate(technician.verifiedAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </SectionShell>

        <SectionShell
          id="users"
          title="إدارة المستخدمين"
          description="فلترة المستخدمين حسب الدور، ومتابعة الحسابات النشطة، وترقية أي مستخدم إلى مدير عند الحاجة."
          action={
            <div className="flex flex-wrap gap-2">
              {ROLE_FILTERS.map((roleFilter) => (
                <button
                  key={roleFilter.value}
                  type="button"
                  onClick={() => setUserRoleFilter(roleFilter.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    userRoleFilter === roleFilter.value
                      ? "bg-[var(--primary-color)] text-white"
                      : "bg-[#F5F8F4] text-[#31554B] hover:bg-[#E9F0E7]"
                  }`}
                >
                  {roleFilter.label}
                </button>
              ))}
            </div>
          }
        >
          {loading.users ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <LoaderCircle className="animate-spin text-[var(--primary-color)]" size={28} />
            </div>
          ) : users.length === 0 ? (
            <p className="text-sm text-[#70827B]">لا يوجد مستخدمون ضمن هذا الفلتر.</p>
          ) : (
            <div className="overflow-hidden rounded-[28px] border border-[#E8EEEA]">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white text-right">
                  <thead className="bg-[#F7FAF7] text-sm text-[#62736D]">
                    <tr>
                      <th className="px-5 py-4 font-medium">الاسم</th>
                      <th className="px-5 py-4 font-medium">البريد</th>
                      <th className="px-5 py-4 font-medium">الدور</th>
                      <th className="px-5 py-4 font-medium">الموقع</th>
                      <th className="px-5 py-4 font-medium">تاريخ الإنشاء</th>
                      <th className="px-5 py-4 font-medium">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-t border-[#EEF2EE] text-sm text-[#31554B]"
                      >
                        <td className="px-5 py-4 font-semibold text-[var(--primary-color)]">
                          {user.fullName}
                        </td>
                        <td className="px-5 py-4">{user.email}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                              user.role === "admin"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : user.role === "technician"
                                  ? "border-sky-200 bg-sky-50 text-sky-700"
                                  : "border-slate-200 bg-slate-100 text-slate-700"
                            }`}
                          >
                            {user.role === "admin"
                              ? "مدير"
                              : user.role === "technician"
                                ? "فني"
                                : "عميل"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {user.city || "غير متوفر"}، {user.governorate || "غير متوفر"}
                        </td>
                        <td className="px-5 py-4">{formatDate(user.createdAt)}</td>
                        <td className="px-5 py-4">
                          {user.role === "admin" ? (
                            <span className="inline-flex items-center gap-2 rounded-full bg-[#EEF8DB] px-3 py-2 text-xs font-medium text-[var(--primary-color)]">
                              <ShieldCheck size={14} />
                              مدير بالفعل
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => void handlePromoteUser(user.id)}
                              disabled={submittingAction === user.id}
                              className="inline-flex items-center gap-2 rounded-full border border-[#D4E0D9] px-3 py-2 text-xs font-medium text-[var(--primary-color)] transition-all hover:border-[var(--accent-color)] hover:bg-[#F7FCEB] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <UserCog size={14} />
                              {submittingAction === user.id ? "جارٍ التنفيذ..." : "ترقية إلى مدير"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-[#EEF2EE] bg-[#FBFCFB] px-5 py-4 text-sm text-[#6F827A]">
                <span>الإجمالي: {usersMeta.total}</span>
                <span>
                  الصفحة {usersMeta.page} من {usersMeta.totalPages || 1}
                </span>
              </div>
            </div>
          )}
        </SectionShell>

        <div className="grid gap-5 md:grid-cols-4">
          <div className="rounded-[28px] border border-[#E7ECE7] bg-white p-5">
            <div className="flex items-center gap-3 text-[var(--primary-color)]">
              <CheckCircle2 size={20} />
              <h3 className="font-semibold">الاعتمادات</h3>
            </div>
            <p className="mt-3 text-sm leading-7 text-[#6F827A]">
              مراجعة الفنيين أصبحت في صفحة مستقلة لعرض الملفات واتخاذ القرار بسرعة.
            </p>
          </div>
          <div className="rounded-[28px] border border-[#E7ECE7] bg-white p-5">
            <div className="flex items-center gap-3 text-[var(--primary-color)]">
              <ShieldAlert size={20} />
              <h3 className="font-semibold">صلاحيات الإدارة</h3>
            </div>
            <p className="mt-3 text-sm leading-7 text-[#6F827A]">
              الواجهة محمية في الفرونت إند، والباك إند يفرض دور `admin` أيضاً.
            </p>
          </div>
          <div className="rounded-[28px] border border-[#E7ECE7] bg-white p-5">
            <div className="flex items-center gap-3 text-[var(--primary-color)]">
              <Star size={20} />
              <h3 className="font-semibold">متابعة الجودة</h3>
            </div>
            <p className="mt-3 text-sm leading-7 text-[#6F827A]">
              أفضل الفنيين وآخر الطلبات معروضة لتسريع قرارات المتابعة اليومية.
            </p>
          </div>
          <div className="rounded-[28px] border border-[#E7ECE7] bg-white p-5">
            <div className="flex items-center gap-3 text-[var(--primary-color)]">
              <ArrowUpRight size={20} />
              <h3 className="font-semibold">الانتقال السريع</h3>
            </div>
            <p className="mt-3 text-sm leading-7 text-[#6F827A]">
              افتح صفحة المراجعات عند وجود فنيين جدد، واستخدم هذه اللوحة للمؤشرات العامة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
