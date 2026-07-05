"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser } from "@/services/auth.service";
import { getPostLoginRoute } from "@/lib/auth-redirect";
import { UserRole } from "@/types/auth.types";

interface Props {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export default function VerificationGate({
  children,
  allowedRoles,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      const timeoutId = window.setTimeout(() => router.replace("/login"), 0);
      return () => window.clearTimeout(timeoutId);
    }

    let timeoutId: number | null = null;
    let cancelled = false;

    const getLastAllowedPathKey = (role: UserRole) => `last_allowed_path:${role}`;

    const showPendingNotice = () => {
      const notice = sessionStorage.getItem("auth_notice");
      if (!notice) return;

      sessionStorage.removeItem("auth_notice");
      window.setTimeout(() => window.alert(notice), 0);
    };

    const markReady = () => {
      timeoutId = window.setTimeout(() => {
        if (!cancelled) {
          setReady(true);
        }
      }, 0);
    };

    const syncUser = async () => {
      try {
        const { data } = await getCurrentUser();
        const user = data.data;

        localStorage.setItem("user", JSON.stringify(user));

        // if (!cancelled && !user.isVerified && pathname !== "/verify-email") {
        //   router.replace("/verify-email");
        //   return;
        // }

        if (
          !cancelled &&
          user.role === "client" &&
          !user.profileComplete &&
          pathname !== "/register/user/complete-profile"
        ) {
          router.replace("/register/user/complete-profile");
          return;
        }

        if (
          !cancelled &&
          allowedRoles &&
          !allowedRoles.includes(user.role)
        ) {
          sessionStorage.setItem(
            "auth_notice",
            "ليس لديك صلاحية الوصول لهذه الصفحة. تم توجيهك إلى الصفحة الرئيسية.",
          );

          const lastAllowedPath =
            sessionStorage.getItem(getLastAllowedPathKey(user.role)) ||
            getPostLoginRoute(user);

          router.replace(lastAllowedPath);
          return;
        }

        sessionStorage.setItem(getLastAllowedPathKey(user.role), pathname);
        showPendingNotice();
        markReady();
      } catch {
        router.replace("/login");
      }
    };

    void syncUser();

    return () => {
      cancelled = true;
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [allowedRoles, pathname, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
