"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/api/axios";
import Button from "@/components/ui/Button";
import electricalIcon from "@/assets/icons/electrician.svg";
import plumbingIcon from "@/assets/icons/plumbing.svg";
import carpentryIcon from "@/assets/icons/carpentry.svg";
import acIcon from "@/assets/icons/aircondition.svg";
import { categoryIcons } from "@/app/(client)/client/posts/[id]/page";

interface Category {
  _id: string;
  name: string;
  image?: string;
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
    <section className="section-wrapper w-full lg:w-4/5" dir="rtl">
      <div className="section-header">
        <h2 className="section-title">الأقسام الرئيسية</h2>
        <p className="section-desc">
          استعرض الأقسام المختلفة واختر الخدمة المناسبة لاحتياجك، أو دعنا نساعدك
          في تحديد الحل الأنسب لمشكلتك.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => {
            return (
              <div
                key={cat._id}
                onClick={() => router.push("/client/categories")}
                className="rounded-2xl overflow-hidden cursor-pointer group"
                style={{ backgroundColor: "var(--secondary-color)" }}
              >
                <div className="relative w-full h-48 md:h-56 overflow-hidden">
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

                  <div
                    className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-base mr-auto"
                    style={{ backgroundColor: "var(--accent-color)" }}
                  >
                    <Image
                      src={categoryIcons[cat.name]}
                      alt="icon"
                      width={18}
                      height={18}
                    />
                  </div>
                </div>

                <div className="p-3 text-center">
                  <p
                    className="text-[var(--primary-color)] font-bold text-base md:text-lg"
                  >
                    {cat.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-center mt-10">
        <Button
          onClick={() => router.push("/client/categories")}
          className="px-8 py-3"
        >
          تصفح جميع الأقسام
        </Button>
      </div>
    </section>
  );
}
