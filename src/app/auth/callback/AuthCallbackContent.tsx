"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCurrentUser } from "@/services/auth.service";
import { getPostLoginRoute } from "@/lib/auth-redirect";

export default function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    const finalizeLogin = async () => {
      if (accessToken) {
        localStorage.setItem("access_token", accessToken);
      }

      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
      }

      try {
        const { data } = await getCurrentUser();
        localStorage.setItem("user", JSON.stringify(data.data));
        router.replace(getPostLoginRoute(data.data));
      } catch {
        router.replace("/login");
      }
    };

    finalizeLogin();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 rounded-full border-4 border-[var(--accent-color)] border-t-transparent animate-spin" />
    </div>
  );
}
