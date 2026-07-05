"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/landing");
      return;
    }

    try {
      const raw = localStorage.getItem("user");
      const user = raw ? JSON.parse(raw) : null;
      const role = user?.role;

      if (role === "client") {
        router.replace("/client/home");
      } else if (role === "technician") {
        router.replace("/technician/orders");
      } else if (role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/landing");
      }
    } catch {
      localStorage.removeItem("user");
      router.replace("/landing");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
