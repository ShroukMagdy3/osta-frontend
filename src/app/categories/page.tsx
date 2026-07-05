"use client";

import { useEffect, useState } from "react";
import LandingNavbar from "@/components/sections/landing-page/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { api } from "@/api/axios";
import "@/styles/sectionsLayout.css";

interface Category {
  _id: string;
  name: string;
  description: string;
  image?: string;
  servicesCount?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.data || []);
      } catch (err) {
        console.error("فشل تحميل الأقسام", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <main className="min-h-screen" dir="rtl">
      <LandingNavbar />

      {/* Hero */}
      <section className="primary-gradient pt-36 pb-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          الأقسام
        </h1>
        <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          تصفح جميع أقسام الخدمات المتاحة واختر ما يناسب احتياجك المنزلي.
        </p>
      </section>

      <section className="section-wrapper">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-sm">
            لا توجد أقسام متاحة حالياً
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="rounded-2xl overflow-hidden bg-[#f7f9f3] border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
              >
                {/* Image */}
                <div className="relative w-full h-44 overflow-hidden bg-gray-200">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--primary-color)]/10 to-[var(--accent-color)]/20 flex items-center justify-center">
                      <span className="text-5xl opacity-30">🔧</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[var(--primary-color)] text-lg">
                      {cat.name}
                    </h3>
                    {cat.servicesCount !== undefined && (
                      <span className="text-xs bg-[var(--accent-color)]/20 text-[var(--primary-color)] font-semibold px-2.5 py-1 rounded-full">
                        {cat.servicesCount} خدمة
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                  <Link
                    href="/login"
                    className="mt-2 inline-flex items-center gap-2 text-[var(--primary-color)] font-bold text-sm hover:text-[var(--accent-color)] transition-colors"
                  >
                    استعرض الخدمات
                    <svg
                      className="w-4 h-4 rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-14">
          <p className="text-gray-500 text-sm mb-4">
            سجّل الدخول للوصول إلى جميع الخدمات وطلب حرفي الآن
          </p>
          <Link
            href="/login"
            className="inline-flex bg-[var(--primary-color)] text-white font-black text-sm px-8 py-3.5 rounded-full hover:opacity-90 transition shadow-lg"
          >
            سجّل الدخول
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
