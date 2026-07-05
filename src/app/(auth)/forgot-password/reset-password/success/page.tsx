'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Check } from 'lucide-react';
import authBg from '@/assets/images/auth-bg.jpg';
import Button from '@/components/ui/Button';
import logoImage from '@/assets/images/logo.svg';

export default function ResetSuccessPage() {
  const router = useRouter();

  // redirect تلقائي بعد 3 ثواني
  useEffect(() => {
    const timer = setTimeout(() => router.push('/login'), 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex relative overflow-hidden" dir="ltr">
      <Image src={authBg} alt="Background" fill priority quality={75} className="object-cover object-right" />
      <div className="absolute inset-0 bg-black/25 lg:hidden" />

      {/* Logo */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <div className="flex items-center gap-2">
          <Image
            src={logoImage}
            alt="Logo"
            width={120}
            // height={60}
            className="h-auto"
          />
        </div>
      </div>

      {/* الكارت */}
      <div className="flex items-center justify-center z-10 w-full px-4 py-16 lg:w-[55%] lg:px-12 lg:py-0">
        <div className="bg-white rounded-3xl shadow-sm w-full p-7 max-w-sm sm:p-10 sm:max-w-md lg:p-12 lg:max-w-2xl" dir="rtl">

          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--primary-color)] text-center mb-3">
            تم تغير كلمة المرور بنجاح
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm text-center mb-10">
            سيتم تحويلك إلى صفحة تسجيل الدخول
          </p>

          {/* أيقون النجاح */}
          <div className="flex justify-center mb-10">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[var(--secondary-color)] flex items-center justify-center">
              <Check
                strokeWidth={2.5}
                className="text-[var(--accent-color)] w-10 h-10 sm:w-12 sm:h-12"
              />
            </div>
          </div>

          <Button
            fullWidth
            onClick={() => router.push('/login')}
        >
            العودة إلى تسجيل الدخول
        </Button>
        </div>
      </div>

      <div className="hidden lg:block lg:w-[45%]" />
    </div>
  );
}