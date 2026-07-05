"use client";

import { useState } from "react";
import LandingNavbar from "@/components/sections/landing-page/Navbar";
import Footer from "@/components/layout/Footer";
import "@/styles/sectionsLayout.css";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const contactInfo = [
  { icon: Mail, label: "البريد الإلكتروني", value: "support@osta.app" },
  { icon: Phone, label: "رقم الهاتف", value: "+0123456789" },
  { icon: MapPin, label: "العنوان", value: "مصر" },
  { icon: Clock, label: "ساعات العمل", value: "السبت – الخميس، ٩ ص – ٩ م" },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen" dir="rtl">
      <LandingNavbar />

      {/* Hero */}
      <section className="primary-gradient pt-36 pb-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          تواصل معنا
        </h1>
        <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          نحن هنا للمساعدة. تواصل معنا في أي وقت وسنرد عليك في أقرب وقت ممكن.
        </p>
      </section>

      <section className="section-wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-[var(--primary-color)]">
              معلومات التواصل
            </h2>
            <div className="flex flex-col gap-4">
              {contactInfo.map((item, idx) => {
                const Icon = item.icon;

                return (
                  <div key={idx} className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <div className="bg-[#f7f9f3] rounded-3xl p-6 md:p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-10">
                <span className="text-5xl">✅</span>
                <h3 className="text-xl font-bold text-[var(--primary-color)]">
                  تم إرسال رسالتك!
                </h3>
                <p className="text-gray-500 text-sm">
                  سنتواصل معك في أقرب وقت ممكن.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="mt-2 bg-[var(--primary-color)] text-white font-bold text-sm px-6 py-2.5 rounded-full hover:opacity-90 transition"
                >
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-[var(--primary-color)] mb-6">
                  أرسل رسالة
                </h2>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-600">
                        الاسم
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="اسمك الكامل"
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[var(--primary-color)] placeholder-gray-400 focus:outline-none focus:border-[var(--primary-color)] transition"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-600">
                        البريد الإلكتروني
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        dir="ltr"
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[var(--primary-color)] placeholder-gray-400 focus:outline-none focus:border-[var(--primary-color)] transition"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">
                      الموضوع
                    </label>
                    <input
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="موضوع رسالتك"
                      className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[var(--primary-color)] placeholder-gray-400 focus:outline-none focus:border-[var(--primary-color)] transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">
                      الرسالة
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="اكتب رسالتك هنا..."
                      rows={5}
                      className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[var(--primary-color)] placeholder-gray-400 focus:outline-none focus:border-[var(--primary-color)] transition resize-none"
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-[var(--primary-color)] text-white font-bold text-sm py-3 rounded-full hover:opacity-90 transition mt-1"
                  >
                    إرسال الرسالة
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
