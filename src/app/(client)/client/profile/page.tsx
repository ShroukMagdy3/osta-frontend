"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/layout/Footer";
import ProfileHeroSection from "@/components/sections/client/profile/ProfileHeroSection";
import ContactInfoSection from "@/components/sections/client/profile/ContactInfoSection";
import PasswordSection from "@/components/sections/client/profile/PasswordSection";
import LocationSection from "@/components/sections/client/profile/LocationSection";
import GenderSection from "@/components/sections/client/profile/GenderSection";
import Navbar from "@/components/layout/client/Navbar";
import { api } from "@/api/axios";

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  isVerified: boolean;
  createdAt: string;
  governorate?: string;
  city?: string;
  gender?: string;
  passwordChangedAt?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ data: UserProfile }>("/users/me")
      .then((res) => {
        const u = res.data?.data ?? (res.data as unknown as UserProfile);
        setUser(u);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="primary-gradient w-full" dir="rtl">
          <div className="lg:p-5">
            <Navbar />
          </div>
          <div className="px-8 md:px-16 lg:px-24 pt-4 pb-12 flex items-center justify-end gap-6">
            <div className="text-right space-y-2">
              <div className="h-8 w-48 bg-white/10 rounded-xl animate-pulse ml-auto" />
              <div className="h-4 w-36 bg-white/10 rounded-xl animate-pulse ml-auto" />
              <div className="h-3 w-28 bg-white/10 rounded-xl animate-pulse ml-auto" />
            </div>
            <div className="w-20 h-20 rounded-full bg-white/10 animate-pulse flex-shrink-0" />
          </div>
        </section>
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeroSection
        fullName={user.fullName}
        email={user.email}
        isVerified={user.isVerified}
        createdAt={user.createdAt}
        onNameUpdated={(newName) =>
          setUser((u) => (u ? { ...u, fullName: newName } : u))
        }
      />

      <div id="contact-section" className="max-w-4xl mx-auto px-4 md:px-8 py-10 space-y-5">
        <ContactInfoSection
          email={user.email}
          phone={user.phone ?? ""}
          onSaved={(newPhone) =>
            setUser((u) => (u ? { ...u, phone: newPhone } : u))
          }
        />
        <PasswordSection
          email={user.email}
          passwordChangedAt={user.passwordChangedAt}
          onPasswordChanged={() =>
            setUser((u) =>
              u ? { ...u, passwordChangedAt: new Date().toISOString() } : u
            )
          }
        />

        <LocationSection
          governorate={user.governorate ?? ""}
          city={user.city ?? ""}
          onSaved={({ governorate, city }) =>
            setUser((u) => (u ? { ...u, governorate, city } : u))
          }
        />

        <GenderSection gender={user.gender ?? ""} />

        
      </div>

    
    </div>
  );
}