"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/api/axios";
import { ArrowUpLeft } from "lucide-react";
import electricalIcon from "@/assets/icons/electrician.svg";
import plumbingIcon from "@/assets/icons/plumbing.svg";
import carpentryIcon from "@/assets/icons/carpentry.svg";
import acIcon from "@/assets/icons/aircondition.svg";

interface Service {
  _id: string;
  name: string;
  description: string;
  image: string;
  category: {
    _id: string;
    name: string;
  };
  priceRange: {
    min: number;
    max: number;
  };
}

const serviceIcons: Record<string, string> = {
  كهرباء: electricalIcon,
  سباكة: plumbingIcon,
  نجارة: carpentryIcon,
  تكييف: acIcon,
};

export default function CommonServicesSection() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services/most-common");
        setServices(res.data.data || []);
      } catch (err) {
        console.error("فشل تحميل الخدمات", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <section className="section-wrapper w-full lg:w-4/5" dir="rtl">
      <div className="section-header">
        <h2 className="section-title">الخدمات الشائعة</h2>
        <p className="section-desc">
          الخدمات التي يطلبها المستخدمون بشكل متكرر ويمكنك حجزها مباشرة بخطوات
          بسيطة.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service) => {
            return (
              <div
                key={service._id}
                onClick={() => router.push(`/client/services/${service._id}`)}
                className="px-3 rounded-2xl overflow-hidden cursor-pointer group bg-[var(--secondary-color)] hover:bg-[var(--accent-color)] shadow-sm hover:shadow-md transition-all"
              >
                {/* الصورة */}
                <div className="relative w-full h-48 rounded-b-3xl overflow-hidden">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.name}
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
                      src={serviceIcons[service.category.name]}
                      alt="icon"
                      width={18}
                      height={18}
                    />
                  </div>
                </div>

                <div className="p-4">
                  <div
                    className="flex items-center justify-between gap-2 mb-4 mr-auto"
                    dir="ltr"
                  >
                    <ArrowUpLeft
                      size={36}
                      className="text-[var(--primary-color)] group-hover:text-[var(--accent-color)] bg-[white] group-hover:bg-[var(--primary-color)] p-2 rounded-full flex-shrink-0 mt-0.5"
                    />
                    <p className="font-bold text-[var(--primary-color)] text-base">
                      {service.name}
                    </p>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed text-right line-clamp-2">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
