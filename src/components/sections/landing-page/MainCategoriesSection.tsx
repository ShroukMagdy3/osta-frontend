"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/api/axios";
import electricalIcon from "@/assets/icons/electrician.svg";
import plumbingIcon from "@/assets/icons/plumbing.svg";
import carpentryIcon from "@/assets/icons/carpentry.svg";
import acIcon from "@/assets/icons/aircondition.svg";
import CTAButton from "@/components/sections/landing-page/CTAButton";
import { categoryIcons } from "@/app/(client)/client/posts/[id]/page";

interface Category {
  _id: string;
  name: string;
  image?: string;
  description?: string;
}

export default function MainCategoriesSection() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.data.slice(0, 4) || []);
      } catch (err) {
        console.error("فشل تحميل الأقسام", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section
      className="section-wrapper !max-w-full bg-[#f7f9f3] p-3 sm:p-4 lg:p-6"
      dir="rtl"
    >
      <div className="section-header">
        <h2 className="section-title">الخدمات الاكثر طلبا</h2>
        <p className="section-desc">
          اختر من الخدمات الثابتة بأسعار واضحة وتنفيذ سريع.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 p-6 lg:grid-cols-4 gap-3 lg:gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => router.push(`/client/categories`)}
              className="rounded-2xl overflow-hidden cursor-pointer group bg-[#eef5e0]"
            >
              {/* Image */}
              <div className="relative w-full h-36 sm:h-44 md:h-48 lg:h-56 overflow-hidden">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}

                {/* Icon badge */}
                <div
                  className="absolute top-2.5 right-2.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--accent-color)" }}
                >
                  <Image
                    src={categoryIcons[cat.name as keyof typeof categoryIcons]}
                    alt="icon"
                    width={16}
                    height={16}
                    className="sm:w-[18px] sm:h-[18px]"
                  />
                </div>
              </div>

              {/* Name row */}
              <div className="px-2.5 sm:px-3 pt-3 flex justify-between items-center">
                <p className="text-[var(--primary-color)] font-bold text-sm sm:text-base lg:text-lg">
                  {cat.name}
                </p>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm shrink-0">
                  <svg
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600 rotate-180"
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
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 px-2.5 sm:px-3 pt-1.5 pb-3">
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-8 sm:mt-10">
        <CTAButton href="/login" className="px-8 py-3" />
      </div>
    </section>
  );
}
