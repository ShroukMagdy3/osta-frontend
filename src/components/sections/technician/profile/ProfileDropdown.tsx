"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, CreditCard, Wallet, LogOut } from "lucide-react";
import { api } from "@/api/axios";

interface CurrentUser {
  fullName: string;
  email: string;
}

interface ProfileDropdownProps {
  currentUser: CurrentUser | null;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}

const MENU_LINKS = [
  {
    label: "لوحة التحكم",
    href: "/technician/profile",
    icon: User,
  },
  {
    label: "سجل الخدمات",
    href: "/technician/services-history",
    icon: CreditCard,
  }
];

export default function ProfileDropdown({
  currentUser,
  onClose,
  anchorRef,
}: ProfileDropdownProps) {
  const router = useRouter();
  const userInitial = currentUser?.fullName?.charAt(0) ?? "؟";
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Position the dropdown under the anchor button
  useEffect(() => {
    const position = () => {
      if (!anchorRef.current || !dropdownRef.current) return;

      const rect = anchorRef.current.getBoundingClientRect();
      const dropdownWidth = dropdownRef.current.offsetWidth;

      let left = rect.left + window.scrollX - dropdownWidth + rect.width;

      // يمنع خروج القائمة من الشمال
      if (left < 8) {
        left = 8;
      }

      // يمنع خروجها من اليمين
      const maxLeft = window.innerWidth - dropdownWidth - 8 + window.scrollX;

      if (left > maxLeft) {
        left = maxLeft;
      }

      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom - 8;
      const dropdownHeight = dropdownRef.current.offsetHeight || 260;

      if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
        dropdownRef.current.style.top = `${rect.top + window.scrollY - dropdownHeight - 8}px`;
      } else {
        dropdownRef.current.style.top = `${rect.bottom + window.scrollY + 8}px`;
      }

      dropdownRef.current.style.left = `${left}px`;
    };

    position();

    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);

    return () => {
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  }, [anchorRef]);

  // Close on outside click
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, anchorRef]);

  const handleLogout = async () => {
    onClose();
    try {
      await api.post("/auth/logout");
    } catch {
      // proceed with local cleanup even if request fails
    } finally {
      localStorage.removeItem("access_token");
      router.push("/login");
    }
  };

  return createPortal(
    <div
      ref={dropdownRef}
      dir="rtl"
      style={{ position: "absolute" }}
      className="z-[99999] w-[min(18rem,calc(100vw-1rem))] overflow-hidden rounded-[20px] border border-[#EAECE8] bg-white shadow-[0_18px_42px_rgba(17,45,39,0.18)]"
    >
      {/* Header */}
      <div className="primary-gradient flex items-center gap-3 px-5 py-5">
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
              <p className="truncate text-sm font-semibold text-white">
                {currentUser.fullName}
              </p>
              <p className="truncate text-xs text-white/70">
                {currentUser.email}
              </p>
            </>
          ) : (
            <div className="space-y-1.5">
              <div className="h-3 w-28 animate-pulse rounded bg-white/20" />
              <div className="h-2.5 w-36 animate-pulse rounded bg-white/20" />
            </div>
          )}
        </div>
      </div>

      {/* Menu links */}
      <div className="flex flex-col px-2 py-2">
        {MENU_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center justify-between gap-3 rounded-2xl px-3 py-3 text-sm text-[#112D27] transition-all hover:bg-gray-50"
            >
              <span className="font-medium text-[var(--primary-color)]">
                {link.label}
              </span>
              <Icon size={18} className="text-[#112D27]" />
            </Link>
          );
        })}
      </div>

      <div className="border-t border-gray-100" />

      <div className="px-2 py-2">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-3 text-sm text-red-500 transition-all hover:bg-red-50"
        >
          <span className="font-medium">تسجيل الخروج</span>
          <LogOut size={18} />
        </button>
      </div>
    </div>,
    document.body,
  );
}
