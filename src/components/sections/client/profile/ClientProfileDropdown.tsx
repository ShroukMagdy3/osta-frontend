"use client";

import { RefObject, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, CreditCard, FileText, LogOut } from "lucide-react";
import { api } from "@/api/axios";

interface CurrentUser {
  fullName: string;
  email: string;
}

interface Props {
  currentUser: CurrentUser | null;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;

}

export default function ClientProfileDropdown({ currentUser, onClose, anchorRef }: Props) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userInitial = currentUser?.fullName?.charAt(0) ?? "؟";

  useEffect(() => {
    const position = () => {
      const el = dropdownRef.current;
      const anchor = anchorRef?.current;
      if (!el) return;

      // mobile: let CSS handle full-width fixed panel
      if (!anchor || window.innerWidth < 640) {
        el.style.removeProperty("left");
        el.style.removeProperty("top");
        return;
      }

      const rect = anchor.getBoundingClientRect();
      const dropdownWidth = el.offsetWidth;

      let left = rect.left - dropdownWidth + rect.width;
      if (left < 8) left = 8;
      const maxLeft = window.innerWidth - dropdownWidth - 8;
      if (left > maxLeft) left = maxLeft;

      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom - 8;
      const dropdownHeight = el.offsetHeight || 260;

      if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
        el.style.top = `${rect.top - dropdownHeight - 8}px`;
      } else {
        el.style.top = `${rect.bottom + 8}px`;
      }

      el.style.left = `${left}px`;
    };

    position();
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => {
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  }, [anchorRef]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    // بنأخر إضافة الـ listener شوية عشان نتجنب إن نفس اللمسة اللي فتحت
    // الدروب داون (على الموبايل) تتفسر كـ "كليك برة" وتقفله فورًا في نفس اللحظة.
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, anchorRef]);

  const handleLogout = async () => {
    onClose();
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      router.push("/login");
    }
  };

  return createPortal(
    <div
      ref={dropdownRef}
      dir="rtl"
      style={{ position: "fixed" }}
      className="fixed inset-x-3 top-16 z-[99999] w-[calc(100vw-1.5rem)] overflow-hidden rounded-[20px] border border-[#EAECE8] bg-white shadow-[0_18px_42px_rgba(17,45,39,0.18)] sm:inset-auto sm:top-auto sm:w-[min(18rem,calc(100vw-1rem))]"
    >
      <div className="flex items-center gap-3 px-5 py-5 primary-gradient">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white text-lg font-bold text-[var(--primary-color)]">
          {currentUser ? (
            userInitial
          ) : (
            <span className="block h-5 w-5 animate-pulse rounded-full bg-gray-200" />
          )}
        </div>
        <div className="min-w-0 text-right">
          {currentUser ? (
            <>
              <p className="truncate text-sm font-semibold text-white">{currentUser.fullName}</p>
              <p className="truncate text-xs text-white/70">{currentUser.email}</p>
            </>
          ) : (
            <div className="space-y-1.5">
              <div className="h-3 w-28 animate-pulse rounded bg-white/20" />
              <div className="h-2.5 w-36 animate-pulse rounded bg-white/20" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col px-2 py-2">
        <Link href="/client/profile" onClick={onClose} className="flex items-center justify-between gap-3 rounded-2xl px-3 py-3 text-sm text-[#112D27] transition-all hover:bg-gray-50">
          <span className="font-medium text-[var(--primary-color)]">الملف الشخصي</span>
          <User size={18} className="text-[#112D27]" />
        </Link>

        <Link href="/client/orders-history" onClick={onClose} className="flex items-center justify-between gap-3 rounded-2xl px-3 py-3 text-sm text-[#112D27] transition-all hover:bg-gray-50">
          <span className="font-medium text-[var(--primary-color)]">سجل الطلبات</span>
          <CreditCard size={18} className="text-[#112D27]" />
        </Link>

        <Link href="/client/invoices" onClick={onClose} className="flex items-center justify-between gap-3 rounded-2xl px-3 py-3 text-sm text-[#112D27] transition-all hover:bg-gray-50">
          <span className="font-medium text-[var(--primary-color)]">الفواتير</span>
          <FileText size={18} className="text-[#112D27]" />
        </Link>
      </div>

      <div className="border-t border-gray-100" />

      <div className="px-2 py-2">
        <button onClick={handleLogout} className="flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-3 text-sm text-red-500 transition-all hover:bg-red-50">
          <span className="font-medium">تسجيل الخروج</span>
          <LogOut size={18} />
        </button>
      </div>
    </div>,
    document.body
  );
}