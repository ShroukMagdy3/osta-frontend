"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Star, CheckCircle2, AlertCircle, Info, ArrowLeft } from "lucide-react";
import { api } from "@/api/axios";
import Navbar from "@/components/layout/client/Navbar";
import Button from "@/components/ui/Button";
import arrowUpIcon from "@/assets/icons/arrow-up.svg";
import BookingModal from "@/components/sections/client/booking/BookingModal";

interface Service {
  _id: string;
  name: string;
  key: string;
  description: string;
  image: string;
  category: { _id: string; key: string; name: string; image: string };
  fixingSteps: {
    includes: string[];
    doesNotInclude: string[];
  };
  priceRange: { min: number; max: number };
  averageRating: number;
  totalRatings: number;
  tip?: string;
}

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await api.get(`/services/${id}`);
        console.log("Fetched service data:", data.data);
        setService(data.data);
      } catch {
        console.error("فشل تحميل الخدمة");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!service) return null;

  return (
    <div className="min-h-screen bg-[#F8FAF5]" dir="ltr">
      <div className="lg:p-5 z-10">
        <Navbar />
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" dir="rtl">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span
            className="cursor-pointer hover:text-[var(--primary-color)] transition-colors"
            onClick={() => router.push("/client/categories")}
          >
            الأقسام
          </span>
          <ArrowLeft size={14} />
          <span
            className="cursor-pointer hover:text-[var(--primary-color)] transition-colors"
            onClick={() =>
              router.push("/client/categories")
            }
          >
            {service.category.name}
          </span>
          <ArrowLeft size={14} />
          <span className="text-[var(--primary-color)] font-medium">
            {service.name}
          </span>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col-reverse lg:flex-row gap-8">
          {/* الجانب الأيسر */}
          <div className="w-full lg:w-80 lg:flex-shrink-0">
            <div className="top-24 flex flex-col gap-4">
              {/* بطاقة السعر */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-sm text-gray-500 text-right mb-1">
                  السعر التقديري
                </p>
                <div className="flex items-baseline gap-1 justify-end mb-3">
                  <span className="text-3xl font-bold text-[var(--accent-color)]">
                    {service.priceRange.min}
                  </span>

                  <span className="text-gray-400 text-lg">-</span>

                  <span className="text-lg font-semibold text-[var(--primary-color)]">
                    {service.priceRange.max}
                  </span>
                  <span className="text-sm text-gray-400">ج.م</span>
                </div>

                {/* Slider */}
                <div className="relative h-2 bg-gray-100 rounded-full mb-2">
                  <div
                    className="absolute h-2 gradient-brand rounded-full"
                    style={{ width: "100%" }}
                  />
                  <div
                    className="absolute w-3 h-3 bg-[var(--primary-color)] rounded-full top-1/2 -translate-y-1/2"
                    style={{ left: "1%" }}
                  />
                  <div
                    className="absolute w-3 h-3 bg-[var(--accent-color)] rounded-full top-1/2 -translate-y-1/2"
                    style={{ right: "1%" }}
                  />
                </div>

                <p className="text-xs text-gray-400 text-center mb-5">
                  السعر النهائي يُحدد بعد المعاينة
                </p>

                <div className="h-px bg-gray-100 mb-5" />

                <div className="flex flex-col gap-3">
                  <Button
                    fullWidth
                    className="py-3"
                    onClick={() => setShowBooking(true)}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Image src={arrowUpIcon} alt="orders" />
                      اطلب الآن
                    </span>
                  </Button>

                  {showBooking && service && (
                    <BookingModal
                      service={service}
                      onClose={() => setShowBooking(false)}
                    />
                  )}
                </div>
              </div>

              {/* لماذا أُسطى */}
              <div className="bg-[var(--primary-color)] rounded-2xl p-6">
                <h3 className="text-white font-bold text-base mb-4 text-right">
                  لماذا أُسطى؟
                </h3>
                <div className="flex flex-col gap-3">
                  {[
                    "حرفيون موثوقون ومعتمدون",
                    "ضمان جودة الخدمة",
                    "أسعار تنافسية وشفافة",
                    "دعم فوري على مدار الساعة",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-end gap-2"
                    >
                      <span className="text-white/90 text-sm">{item}</span>
                      <CheckCircle2
                        size={18}
                        className="text-[#8DC63F] flex-shrink-0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* الجانب الأيمن —  */}
          <div className="flex-1 flex flex-col gap-4">
            {/* صورة الخدمة */}
            <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden">
              <Image
                src={service.image}
                alt={service.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="bg-white/90 backdrop-blur-sm text-[var(--primary-color)] text-xs font-semibold px-3 py-1.5 rounded-full">
                  {service.category.name}
                </span>
              </div>
            </div>

            {/* الاسم والتقييم */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--primary-color)] mb-2 text-right">
                {service.name}
              </h1>
              <div className="flex items-center gap-1 justify-end">
                <span className="text-sm text-gray-400">
                  ({service.totalRatings} تقييم)
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  {service.averageRating.toFixed(1)}
                </span>
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
              </div>
            </div>

            {/* وصف الخدمة */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[var(--primary-color)] mb-3 text-right">
                وصف الخدمة
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed text-right">
                {service.description}
              </p>
            </div>

            {/* السعر يشمل */}
            {service.fixingSteps?.includes?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-[var(--primary-color)] mb-4 text-right">
                  السعر يشمل
                </h2>
                <div className="flex flex-col gap-3">
                  {service.fixingSteps.includes.map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-end gap-2"
                    >
                      <span className="text-gray-600 text-sm">{item}</span>
                      <CheckCircle2
                        size={18}
                        className="text-[#8DC63F] flex-shrink-0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* قد يختلف السعر */}
            {service.fixingSteps?.doesNotInclude?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-[var(--primary-color)] mb-4 text-right">
                  قد يختلف السعر في حالة
                </h2>
                <div className="flex flex-col gap-3">
                  {service.fixingSteps.doesNotInclude.map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-end gap-2"
                    >
                      <span className="text-gray-600 text-sm">{item}</span>
                      <AlertCircle
                        size={18}
                        className="text-[#8DC63F] flex-shrink-0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* تلميح */}
            {service.tip && (
              <div className="bg-[#F0F9E8] rounded-2xl p-4 flex items-center justify-end gap-3">
                <span className="text-gray-600 text-sm">{service.tip}</span>
                <Info size={18} className="text-[#8DC63F] flex-shrink-0" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
