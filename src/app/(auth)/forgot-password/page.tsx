'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import authBg from '@/assets/images/auth-bg.jpg';
import AuthInput from '@/components/auth/AuthInput';
import Button from '@/components/ui/Button';
import { api } from '@/api/axios';
import logoImage from '@/assets/images/logo.svg';
import { forgotPasswordSchema, validateSchema } from "@/validators/auth.validators";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // const validate = () => {
  //   if (!email.trim()) { setError('البريد الإلكتروني مطلوب'); return false; }
  //   setError('');
  //   return true;
  // };

  const validate = () => {
  const fieldErrors = validateSchema(forgotPasswordSchema, { email });
  if (fieldErrors?.email) { setError(fieldErrors.email); return false; }
  setError("");
  return true;
};
  const handleSubmit = async () => {
  if (!validate()) return;
  try {
    await api.post('/auth/forget-password', { email });
    localStorage.setItem('reset_email', email);
    router.push('/forgot-password/verify-otp');
  } catch (error: any) {
    const message = error.response?.data?.message;
    setError(Array.isArray(message) ? message[0] : message || 'حدث خطأ، حاول مرة أخرى');
  }
};

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
      <div className="
        flex items-center justify-center z-10
        w-full px-4 py-16
        lg:w-[55%] lg:px-12 lg:py-0
      ">
        <div className="
          bg-white rounded-3xl shadow-sm w-full
          p-7 max-w-sm
          sm:p-10 sm:max-w-md
          lg:p-12 lg:max-w-2xl
        " dir="rtl">

          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--primary-color)] text-center mb-3">
            استعادة كلمة المرور
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm text-center mb-8">
            يرجى إدخال بريدك الإلكتروني وسنقوم بإرسال رمز تحقق إليك.
          </p>

          <AuthInput
            label="البريد الإلكتروني"
            placeholder="Ex: user@example.com"
            type="email"
            value={email}
            onChange={(val) => { setEmail(val); if (error) setError(''); }}
            error={error}
          />

          <Button
            fullWidth
            onClick={handleSubmit}
            className='mt-6'
          >
            إرسال رمز التحقق
          </Button>

          <p className="text-center text-xs sm:text-sm text-gray-400 mt-5">
            تذكرت كلمة المرور؟{' '}
            <span
              onClick={() => router.push('/')}
              className="text-[var(--primary-color)] font-bold cursor-pointer hover:underline"
            >
              تسجيل الدخول
            </span>
          </p>
        </div>
      </div>

      <div className="hidden lg:block lg:w-[45%]" />
    </div>
  );
}