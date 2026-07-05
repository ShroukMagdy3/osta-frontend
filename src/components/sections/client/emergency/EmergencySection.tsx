"use client";

import { useEffect, useState } from "react";
import { Phone, MapPin, AlertTriangle } from "lucide-react";
import icon_water from "@/assets/icons/icon_water.svg";
import icon_electrician from "@/assets/icons/icon_electrician.svg";
import icon_fire from "@/assets/icons/icon_fire.svg";
import { api } from "@/api/axios";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EmergencyNumber {
  _id: string;
  type: "urgent" | "utilities";
  name: string;
  phone: string;
}

// ─── Static Tips ──────────────────────────────────────────────────────────────

const TIPS = [
  {
    icon: icon_fire,
    title: "تسريب الغاز",
    desc: "لا تُشغّل أي كهرباء — افتح النوافذ فوراً — اخرج من المكان قبل الاتصال بـ 129",
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    icon: icon_electrician,
    title: "انقطاع الكهرباء المفاجئ",
    desc: "أغلق الأجهزة الكهربائية الرئيسية — اتصل بـ 121 — لا تلمس الأسلاك المكشوفة",
    color: "text-yellow-500",
    bg: "bg-yellow-50",
  },
  {
    icon: icon_water,
    title: "تسريب مياه كبير",
    desc: "أغلق صمام المياه الرئيسي فوراً — اتصل بـ 125 لإصلاح الشبكة العامة",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
];

// ─── Phone Card ───────────────────────────────────────────────────────────────

function PhoneCard({ item }: { item: EmergencyNumber }) {
  return (
    <a
      href={`tel:${item.phone.replace(/\s/g, "")}`}
      className="flex items-center justify-between bg-white border border-red-100 rounded-xl px-4 py-3 hover:bg-red-50 transition-all group"
      dir=""
    >
      <span className="text-sm text-gray-700 font-medium">{item.name}</span>

      <div className="flex items-center gap-2">
        <span className="font-bold text-red-500 text-sm">{item.phone}</span>
        <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 group-hover:bg-red-200 transition-all">
          <Phone size={13} className="text-red-500" />
        </div>
      </div>
    </a>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmergencyPage() {
  const [numbers, setNumbers] = useState<EmergencyNumber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/emergency")
      .then((res) => setNumbers(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const urgent = numbers.filter((n) => n.type === "urgent");
  const utilities = numbers.filter((n) => n.type === "utilities");

  return (
    <div className="min-h-screen bg-[#FEF8F8] py-8 px-4 sm:px-6 lg:px-8" dir="">
      <div className="max-w-4xl mx-auto">
        {/* تحذير الغاز */}
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-center gap-3 mb-8">
          <AlertTriangle size={20} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 text-right leading-relaxed">
            <span className="font-bold">في حالة تسريب الغاز:</span> لا تُشغّل أي
            كهرباء أو مفاتيح إضاءة — افتح جميع النوافذ فوراً — اخرج من المبنى —
            اتصل من خارج المبنى بـ <span className="font-bold">129</span>
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-red-300 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* طوارئ عاجلة */}
            {urgent.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <MapPin size={15} className="text-red-500" />
                  </div>
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    طوارئ عاجلة
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {urgent.map((item) => (
                    <PhoneCard key={item._id} item={item} />
                  ))}
                </div>
              </div>
            )}

            {/* مرافق وخدمات عامة */}
            {utilities.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <MapPin size={15} className="text-orange-500" />
                  </div>
                  <span className="bg-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                    مرافق وخدمات عامة
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {utilities.map((item) => (
                    <PhoneCard key={item._id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* نصائح في حالات الطوارئ */}
        <div className="py-8">
          <h2 className="text-[42px] font-bold text-[#E24A42] text-center mb-16">
            نصائح في حالات الطوارئ
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TIPS.map((tip) => (
              <div
                key={tip.title}
                className="
                  bg-white
                  border-2 border-[#E6E1DB]
                  rounded-[24px]
                  px-4 py-4
                  flex flex-col
                "
              >
                <div className="w-12 h-12 rounded-full bg-[#FCECEC] flex items-center justify-center mb-4">
                  <Image
                    src={tip.icon}
                    alt={tip.title}
                    width={22}
                    height={22}
                  />
                </div>

                <h3 className="text-xl font-bold text-[#E24A42] mb-5">
                  {tip.title}
                </h3>

                <p className="text-gray-600 leading-9">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
