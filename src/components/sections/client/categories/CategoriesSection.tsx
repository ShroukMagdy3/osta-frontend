"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  ArrowUpLeft,
  Star,
  Clock,
  Coins,
} from "lucide-react";
import electricalIcon from "@/assets/icons/electrician.svg";
import plumbingIcon from "@/assets/icons/plumbing.svg";
import carpentryIcon from "@/assets/icons/carpentry.svg";
import acIcon from "@/assets/icons/aircondition.svg";
import { api } from "@/api/axios";
import BookOtherServiceModal from "@/components/sections/client/otherService/BookOtherServiceModal";
import { categoryIcons } from "@/app/(client)/client/posts/[id]/page";

interface Service {
  _id: string;
  name: string;
  description: string;
  image: string;
  priceRange: { min: number; max: number };
  averageRating: number;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  servicesCount: number;
  services?: Service[];
}

export default function CategoriesSection() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [loadingServices, setLoadingServices] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

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

  const toggleCategory = async (cat: Category) => {
    if (openCategoryId === cat._id) {
      setOpenCategoryId(null);
      return;
    }

    setOpenCategoryId(cat._id);

    // جيب السيرفيسز لو مش محملة
    const existing = categories.find((c) => c._id === cat._id);
    if (existing?.services) return;

    setLoadingServices(cat._id);
    try {
      const res = await api.get(`/services?categoryId=${cat._id}`);
      setCategories((prev) =>
        prev.map((c) =>
          c._id === cat._id ? { ...c, services: res.data.data } : c,
        ),
      );
    } catch (err) {
      console.error("فشل تحميل الخدمات", err);
    } finally {
      setLoadingServices(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <div className="w-8 h-8 border-2 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <section className="section-wrapper w-4/5" dir="rtl">
      <div className="flex flex-col gap-3">
        {categories.map((cat) => {
          const isOpen = openCategoryId === cat._id;

          return (
            <div
              key={cat._id}
              className="rounded-2xl overflow-hidden border border-gray-100"
              dir="ltr"
            >
              {/* Header الكاتيجوري */}
              <button
                onClick={() => toggleCategory(cat)}
                className="w-full flex items-center justify-between px-6 py-5 bg-white hover:bg-gray-50 transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-[var(--secondary-color)] border-[var(--primary-color)]' flex items-center justify-center transition-all flex-shrink-0">
                  {isOpen ? (
                    <ChevronUp
                      size={16}
                      className="text-[var(--primary-color)]"
                    />
                  ) : (
                    <ChevronDown size={16} className="text-gray-400" />
                  )}
                </div>

                <div className="flex items-center gap-4 flex-1 justify-end">
                  <div className="text-right">
                    <div className="text-xs text-[#E6A23C] bg-[#FFF6E8] px-2 py-1 w-fit mb-1 ml-auto rounded-full font-semibold whitespace-nowra">
                      <p dir="rtl">{cat.servicesCount} خدمة</p>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <span className="font-bold text-[var(--primary-color)] text-lg">
                        {cat.name}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-0.5">
                      {cat.description}
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "var(--accent-color)" }}
                    >
                      <Image
                        src={categoryIcons[cat.name]}
                        alt="icon"
                        width={24}
                        height={24}
                      />
                    </div>
                  </div>
                </div>
              </button>

              {/* السيرفيسز */}
              {isOpen && (
                <div className="border-t border-gray-100 bg-gray-50/50 p-6">
                  {loadingServices === cat._id ? (
                    <div className="flex justify-center py-8">
                      <div className="w-7 h-7 border-2 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                      dir="rtl"
                    >
                      {cat.services?.map((service) => {
                        return (
                          <div
                            key={service._id}
                            onClick={() =>
                              router.push(`/client/services/${service._id}`)
                            }
                            className="px-3 rounded-2xl bg-[var(--secondary-color)] hover:bg-[var(--accent-color)] overflow-hidden cursor-pointer group transition-all hover:shadow-md"
                          >
                            {/* الصوره */}
                            <div className="relative w-full h-44 rounded-b-xl group-hover:h-56  group-hover:rounded-b-xl overflow-hidden transition-all duration-300">
                              <Image
                                src={service.image}
                                alt={service.name}
                                fill
                                className="object-cover group-hover:scale-105  transition-transform duration-300"
                                unoptimized
                              />
                            </div>

                            {/* المحتوى */}
                            <div className="p-2">
                              <div
                                className="flex items-center gap-2 justify-end mb-1"
                                dir="rtl"
                              >
                                <span className="font-bold text-sm ml-auto">
                                  {service.name}
                                </span>
                                <div
                                  className="
                                    w-7 h-7 group-hover:w-9 group-hover:h-9
                                    bg-white group-hover:bg-[var(--primary-color)]
                                    rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300
                                  "
                                >
                                  <ArrowUpLeft
                                    size={13}
                                    className="text-[var(--primary-color)] group-hover:text-[var(--secondary-color)] transition-colors duration-300"
                                  />
                                </div>
                              </div>

                              <div
                                className="flex items-center gap-1 justify-end mb-2 group-hover:hidden"
                                dir="ltr"
                              >
                                <p className="text-xs text-gray-500">
                                  {/* {service.averageRating > 0
                                    ? service.averageRating
                                    : "4.5"} */}
                                  {service.averageRating}
                                </p>
                                <Star
                                  size={12}
                                  className="text-yellow-400 fill-yellow-400"
                                />
                              </div>

                              <p className="text-xs leading-relaxed text-right line-clamp-2 mb-3 text-gray-400">
                                {service.description}
                              </p>

                              {/* السعر والوقت — يختفو على الهوفر */}
                              <div
                                className="flex items-center justify-center gap-2 group-hover:hidden"
                                dir="ltr"
                              >
                                <div
                                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white text-[var(--primary-color)]"
                                  dir="rtl"
                                >
                                  <Coins size={11} />
                                  <span>
                                    {service.priceRange.min} -{" "}
                                    {service.priceRange.max} ج.م
                                  </span>
                                </div>
                                <div
                                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white text-[var(--primary-color)]"
                                  dir="rtl"
                                >
                                  <Clock size={11} />
                                  <span>30 - 45 دقيقة</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div
                    className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 flex-col sm:flex-row gap-3 sm:gap-0"
                    dir="rtl"
                  >
                    <p className="text-sm text-gray-500">
                      لم تجد ما تحتاجه في قسم{" "}
                      <span className="font-bold text-[var(--primary-color)]">
                        {cat.name}
                      </span>
                      ؟
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat);
                        setModalOpen(true);
                      }}
                      className="group flex items-center gap-1.5 border border-[var(--purple-dark)] bg-[var(--purple-light)] hover:bg-[var(--purple-dark)] hover:text-white text-[var(--purple-dark)] text-xs sm:text-sm font-bold px-3 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all whitespace-nowrap flex-shrink-0"
                    >
                      <Star
                        size={13}
                        className="fill-current transition-colors"
                      />
                      اطلب خدمة مخصصة
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <BookOtherServiceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        categoryId={selectedCategory?._id || ""}
        categoryName={selectedCategory?.name || ""}
      />
    </section>
  );
}
