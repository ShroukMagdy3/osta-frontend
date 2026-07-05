"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search,
  ChevronDown,
  MapPin,
  ExternalLink,
  Store,
  AlertCircle,
  Loader2,
  Phone,
} from "lucide-react";
import Button from "@/components/ui/Button";
import {
  getTechnicianDefaults,
  getShopCategories,
  searchMaintenanceShops,
} from "@/api/services/maintenance-shops.service";
import type {
  MaintenanceShop,
  ShopCategory,
} from "@/types/maintenance-shops.types";

const GOVERNORATES = [
  "القاهرة",
  "الإسكندرية",
  "الجيزة",
  "الشرقية",
  "الدقهلية",
  "الإسماعيلية",
  "الغربية",
  "المنوفية",
  "البحيرة",
  "كفر الشيخ",
  "القليوبية",
  "الفيوم",
  "بني سويف",
  "المنيا",
  "أسيوط",
  "سوهاج",
  "قنا",
  "الأقصر",
  "أسوان",
  "البحر الأحمر",
  "بورسعيد",
  "السويس",
  "دمياط",
  "شمال سيناء",
  "جنوب سيناء",
  "الوادي الجديد",
  "مطروح",
];

function ShopCard({ shop }: { shop: MaintenanceShop }) {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow"
      dir="rtl"
    >
      <div
  className="relative w-full h-32 rounded-xl overflow-hidden bg-gray-100"
  style={{
    backgroundImage:
      "linear-gradient(#d9dcd9 1px, transparent 1px), linear-gradient(90deg, #d9dcd9 1px, transparent 1px)",
    backgroundSize: "18px 18px",
    backgroundColor: "#eceeec",
  }}
>
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-10 h-10 rounded-full bg-[var(--accent-color)]/20 flex items-center justify-center">
      <div className="w-7 h-7 rounded-full bg-[var(--accent-color)] flex items-center justify-center shadow-sm">
        <MapPin size={16} className="text-[var(--primary-color)]" />
      </div>
    </div>
  </div>
</div>

      <div className="flex-1">
        <h3 className="font-bold text-[var(--primary-color)] text-base mb-2 text-right leading-snug">
          {shop.name || "محل بدون اسم"}
        </h3>
        <div className="flex items-start gap-2 text-gray-400 text-xs leading-relaxed mb-2">
          <MapPin size={14} className="shrink-0 mt-0.5 text-gray-300" />
          <span className="text-right">
            {shop.address || "العنوان غير متاح"}
          </span>
        </div>
        {shop.phone && (
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Phone size={14} className="shrink-0 text-gray-300" />
            <span dir="ltr" className="text-right">
              {shop.phone}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {shop.phone && (
          <a
            href={`tel:${shop.phone}`}
            className="flex items-center justify-center gap-2 h-10 w-12 shrink-0 rounded-full bg-[var(--secondary-color)] text-[var(--primary-color)] hover:bg-[var(--accent-color)] transition-colors"
            aria-label="اتصل بالمحل"
          >
            <Phone size={16} />
          </a>
        )}
        <a
          href={shop.Maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 flex-1 h-10 rounded-full bg-[var(--secondary-color)] text-[var(--primary-color)] text-sm font-bold hover:bg-[var(--accent-color)] transition-colors"
        >
          فتح في الخرائط
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}

function ShopCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 animate-pulse">
      <div className="w-full h-32 rounded-xl bg-gray-100" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-100 rounded-full w-3/4 mr-auto" />
        <div className="h-3 bg-gray-100 rounded-full w-full" />
        <div className="h-3 bg-gray-100 rounded-full w-2/3 mr-auto" />
      </div>
      <div className="h-10 bg-gray-100 rounded-full" />
    </div>
  );
}

export default function StoresSearchSection() {
  // فلاتر البحث
  const [governorate, setGovernorate] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [defaultsLoading, setDefaultsLoading] = useState(true);
  const [defaultsError, setDefaultsError] = useState("");

  // نتائج البحث
  const [results, setResults] = useState<MaintenanceShop[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const runSearch = useCallback(
    async (params: { governorate: string; city: string; category: string }) => {
      if (!params.governorate || !params.city || !params.category) return;

      setSearching(true);
      setSearchError("");
      try {
        const data = await searchMaintenanceShops(params);
        setResults(data.results ?? []);
        setSearchQuery(data.searchQuery ?? "");
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 404) {
          setSearchError("التصنيف المختار غير موجود");
        } else if (status === 503) {
          setSearchError(
            "خدمة البحث عن المحلات غير متاحة حاليًا، حاول مرة أخرى لاحقًا",
          );
        } else {
          setSearchError("حدث خطأ أثناء البحث عن المحلات، حاول مرة أخرى");
        }
        setResults([]);
      } finally {
        setSearching(false);
        setHasSearched(true);
      }
    },
    [],
  );

  // أول تحميل: نجيب التصنيفات وبيانات الفني (محافظته، مدينته، تخصصه) بشكل منفصل
  // عشان لو حصل خطأ في واحدة، التانية تكمل عادي وما توقفش الصفحة كلها.
  useEffect(() => {
    const init = async () => {
      setDefaultsLoading(true);
      setDefaultsError("");

      const [categoriesResult, defaultsResult] = await Promise.allSettled([
        getShopCategories(),
        getTechnicianDefaults(),
      ]);

      if (categoriesResult.status === "fulfilled") {
        setCategories(categoriesResult.value);
      } else {
        // eslint-disable-next-line no-console
        console.error(
          "[stores] failed to load categories:",
          categoriesResult.reason,
        );
        setDefaultsError("تعذر تحميل التصنيفات، حاول تحديث الصفحة");
      }

      if (defaultsResult.status === "fulfilled") {
        const defaults = defaultsResult.value;
        setGovernorate(defaults.governorate);
        setCity(defaults.city);
        setCategory(defaults.category);

        if (defaults.governorate && defaults.city && defaults.category) {
          await runSearch(defaults);
        }
      } else {
        // eslint-disable-next-line no-console
        console.error(
          "[stores] failed to load technician defaults:",
          defaultsResult.reason,
        );
        setDefaultsError((prev) =>
          prev
            ? prev
            : "تعذر تحميل بياناتك الافتراضية، يمكنك اختيار الموقع والتصنيف يدويًا",
        );
      }

      setDefaultsLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    runSearch({ governorate, city, category });
  };

  const canSearch = Boolean(governorate && city.trim() && category);

  return (
    <section className="bg-[#f7f7f5] min-h-screen" dir="rtl">
      {/* ── شريط البحث والفلاتر ───────────────────────────── */}
      <div className="px-6 md:px-12 lg:px-16 pt-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 max-w-5xl ml-auto">
          <div className="flex items-start justify-between gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[var(--secondary-color)] flex items-center justify-center shrink-0">
              <Search size={18} className="text-[var(--primary-color)]" />
            </div>
            <div className="text-right flex-1">
              <h2 className="font-bold text-[var(--primary-color)] text-lg mb-1">
                ابحث عن محل قريب
              </h2>
              <p className="text-xs text-gray-400">
                غيّر المحافظة والمدينة ونوع الخدمة المناسبة لك
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* التصنيف */}
            <div>
              <label className="text-xs font-bold text-[var(--primary-color)] mb-2 block">
                التصنيف
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={defaultsLoading}
                  className="w-full appearance-none bg-[#F8FAF9] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[var(--primary-color)] outline-none focus:border-[var(--primary-color)] transition-colors cursor-pointer pr-4 pl-10 disabled:opacity-60"
                  dir="rtl"
                >
                  <option value="" disabled>
                    اختر التصنيف
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* المدينة */}
            <div>
              <label className="text-xs font-bold text-[var(--primary-color)] mb-2 block">
                المدينة
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={defaultsLoading}
                placeholder="اكتب اسم المدينة"
                className="w-full bg-[#F8FAF9] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[var(--primary-color)] outline-none focus:border-[var(--primary-color)] transition-colors placeholder:text-gray-300 disabled:opacity-60"
                dir="rtl"
              />
            </div>

            {/* المحافظة */}
            <div>
              <label className="text-xs font-bold text-[var(--primary-color)] mb-2 block">
                المحافظة
              </label>
              <div className="relative">
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  disabled={defaultsLoading}
                  className="w-full appearance-none bg-[#F8FAF9] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[var(--primary-color)] outline-none focus:border-[var(--primary-color)] transition-colors cursor-pointer pr-4 pl-10 disabled:opacity-60"
                  dir="rtl"
                >
                  <option value="" disabled>
                    اختر المحافظة
                  </option>
                  {GOVERNORATES.map((gov) => (
                    <option key={gov} value={gov}>
                      {gov}
                    </option>
                  ))}
                  {governorate && !GOVERNORATES.includes(governorate) && (
                    <option value={governorate}>{governorate}</option>
                  )}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* زرار البحث */}
            <Button
              fullWidth
              disabled={!canSearch || searching || defaultsLoading}
              onClick={handleSearch}
              className="h-[46px] flex items-center justify-center gap-2"
            >
              {searching ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}
              بحث
            </Button>
          </div>

          {defaultsError && (
            <p className="text-xs text-amber-600 mt-4 text-right flex items-center gap-1.5 justify-end">
              <AlertCircle size={13} />
              {defaultsError}
            </p>
          )}
        </div>
      </div>

      {/* ── النتائج ───────────────────────────────────────── */}
      <div className="px-6 md:px-12 lg:px-16 py-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[var(--primary-color)] text-lg">
            المحلات المقترحة
          </h2>
          {!searching && hasSearched && !searchError && (
            <p className="text-sm text-gray-400">
              {results.length} محل قريب من موقعك
            </p>
          )}
        </div>

        {searchQuery && !searching && !searchError && (
          <p className="text-xs text-gray-400 mb-4 text-right">
            نتائج البحث عن: {searchQuery}
          </p>
        )}

        {searching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <ShopCardSkeleton key={i} />
            ))}
          </div>
        ) : searchError ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
            <AlertCircle size={32} className="text-red-400 mb-3" />
            <p className="text-sm text-gray-500 mb-4 text-center px-4">
              {searchError}
            </p>
            <Button onClick={handleSearch} disabled={!canSearch}>
              إعادة المحاولة
            </Button>
          </div>
        ) : !hasSearched ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
            <Store size={32} className="text-gray-300 mb-3" />
            <p className="text-sm text-gray-400">
              اختر المحافظة والمدينة والتصنيف ثم اضغط بحث لعرض المحلات القريبة
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
            <Store size={32} className="text-gray-300 mb-3" />
            <p className="text-sm text-gray-400">
              لا توجد محلات متاحة في هذه المنطقة حاليًا
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((shop, idx) => (
              <ShopCard key={`${shop.name}-${idx}`} shop={shop} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
