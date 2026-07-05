import Image from "next/image";
import Link from "next/link";
import techcta from "@/assets/images/techbg.jpg";


export default function TechnicianCTA() {
  return (
    <section className="bg-white py-10 px-6" dir="ltr">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden min-h-[320px] flex items-center">
          {/* Background Image */}
          <Image
            src={techcta}
            alt="technicians"
            fill
            className="object-cover object-center"
            unoptimized
          />

          {/* Dark overlay on right half to make image visible on left */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/10 via-black/30 to-black/60" />

          {/* Content Card — positioned on the right (RTL) */}
          <div className="relative z-10 bg-white/80 ml-4 rounded-2xl p-8 shadow-xl max-w-xs mr-8 my-8">
            <h3 className="font-black text-gray-900 text-xl sm:text-2xl leading-snug mb-3 text-right">
              هل تمتلك خبرة مهنية؟
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed text-right mb-6">
              انضم إلى شبكة الحرفيين في أسطى واستقبل طلبات تناسب مهاراتك وموقعك.
            </p>
            <Link
              href="/register/technician"
              className="inline-block bg-[var(--accent-color)] text-[var(--primary-color)] font-black px-7 py-3 rounded-full hover:bg-[var(--accent-hover)] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 transform text-sm"
            >
              سجل حرفيًا الآن
            </Link>
           
          </div>
        </div>
      </div>
    </section>
  );
}
