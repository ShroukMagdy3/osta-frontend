"use client";

import { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Award,
  ShieldAlert,
  Mail,
  Phone,
 
} from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "كيف يمكنني طلب خدمة من فني؟",
    answer:
      "من الصفحة الرئيسية اختر القسم المناسب لمشكلتك، ثم اختر الخدمة وحدد موعدك المفضل، وسيتم ربطك بأقرب فني متاح.",
  },
  {
    question: "كيف يتم احتساب سعر الخدمة؟",
    answer:
      "يتم تحديد السعر بناءً على نوع الخدمة وتفاصيل المشكلة، ويظهر لك نطاق السعر التقريبي قبل تأكيد الحجز.",
  },
  {
    question: "هل يمكنني إلغاء الطلب بعد تأكيده؟",
    answer:
      "يمكنك إلغاء الطلب قبل وصول الفني من صفحة الطلبات الحالية، مع مراعاة سياسة الإلغاء المعمول بها.",
  },
  {
    question: "كيف أتأكد من جودة عمل الفني؟",
    answer:
      "جميع الفنيين على المنصة تم التحقق من بياناتهم، ويمكنك الاطلاع على تقييمات العملاء السابقين قبل تأكيد الحجز.",
  },
  {
    question: "ما هي طرق الدفع المتاحة؟",
    answer:
      "يمكنك الدفع عن طريق البطاقات الائتمانية أو المحافظ الإلكترونية، بالإضافة إلى الدفع نقداً عند استلام الخدمة.",
  },
  {
    question: "كيف أقدم شكوى ضد فني؟",
    answer:
      "يمكنك التواصل المباشر مع فريق الدعم من خلال بيانات التواصل أدناه، أو برفع تذكرة جديدة توضح فيها تفاصيل المشكلة.",
  },
];

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
      <div className="w-9 h-9 rounded-full bg-[var(--primary-color)] flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-white" />
      </div>
      <div className="text-right flex-1">
        <h3 className="font-bold text-[var(--primary-color)]">{title}</h3>
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

export default function HelpCenterTab() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-6">
      {/* نظام المكافآت / نظام الإنذارات */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <SectionHeader
          icon={HelpCircle}
          title="الأسئلة الشائعة"
          subtitle="إجابات سريعة لأكثر الاستفسارات شيوعاً"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          <div className="bg-gray-50 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-color)]/30 flex items-center justify-center mb-4">
              <Award size={18} className="text-[var(--primary-color)]" />
            </div>
            <h4 className="font-bold text-[var(--primary-color)] mb-3 text-right">
              نظام المكافآت
            </h4>
            <ul className="text-sm text-gray-500 text-right space-y-2">
              <li>
                عند حصول الفني على 5 تقييمات بـ 5 نجوم، يحصل على مكافأة مالية
              </li>
              <li>قيمة المكافأة تعادل 10% من سعر أعلى خدمة تم إنجازها</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-4">
              <ShieldAlert size={18} className="text-orange-500" />
            </div>
            <h4 className="font-bold text-[var(--primary-color)] mb-3 text-right">
              نظام الإنذارات
            </h4>
            <ul className="text-sm text-gray-500 text-right space-y-2">
              <li>
                إذا حصل الفني على تقييم أقل من 3 نجوم 5 مرات، يتم توجيه إنذار
                رسمي له
              </li>
              <li>عند المرة السادسة يتم إيقاف الحساب لمدة أسبوع كامل</li>
            </ul>
          </div>
        </div>
      </div>

      {/* بيانات التواصل */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <SectionHeader
          icon={MessageCircle}
          title="بيانات التواصل"
          subtitle="نحن هنا لمساعدتك على مدار الساعة"
        />
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-2xl px-4 py-3 flex items-center justify-between">
              <div className="w-9 h-9 rounded-full bg-[var(--accent-color)]/30 flex items-center justify-center flex-shrink-0">
                <Mail size={16} className="text-[var(--primary-color)]" />
              </div>

              <div className="text-right flex-1 mr-3">
                <p className="text-xs text-gray-400">البريد الإلكتروني</p>
                <p
                  className="text-sm font-bold text-[var(--primary-color)]"
                  dir="ltr"
                >
                  support@osta.app
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl px-4 py-3 flex items-center justify-between">
              <div className="w-9 h-9 rounded-full bg-[var(--accent-color)]/30 flex items-center justify-center flex-shrink-0">
                <Phone size={16} className="text-[var(--primary-color)]" />
              </div>

              <div className="text-right flex-1 mr-3">
                <p className="text-xs text-gray-400">رقم الهاتف</p>
                <p
                  className="text-sm font-bold text-[var(--primary-color)]"
                  dir="ltr"
                >
                  +971 2 304 3333
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* الأسئلة الشائعة — accordion */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <SectionHeader
          icon={HelpCircle}
          title="الأسئلة الشائعة"
          subtitle="إجابات سريعة لأكثر الاستفسارات شيوعاً"
        />
        <div>
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className="border-b border-gray-100 last:border-b-0"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex flex-row-reverse items-center px-6 py-4 text-right hover:bg-gray-50 transition-all"
                >
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 transition-transform flex-shrink-0 ml-3 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />

                  <span className="flex-1 text-right text-sm font-medium text-[var(--primary-color)]">
                    {item.question}
                  </span>
                </button>
                {isOpen && (
                  <p className="px-6 pb-4 text-sm text-gray-500 text-right leading-relaxed">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
