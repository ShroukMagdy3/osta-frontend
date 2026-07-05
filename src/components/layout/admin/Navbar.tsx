"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, Shield, Users, Wrench, X } from "lucide-react";
import logoImage from "@/assets/images/logo.svg";
import { logoutUser } from "@/services/auth.service";

const NAV_LINKS = [
  { label: "لوحة التحكم", href: "/admin", icon: LayoutDashboard },
  { label: "المراجعات", href: "/admin/technician-reviews", icon: Shield },
  { label: "الفنيون", href: "/admin#technicians", icon: Wrench },
  { label: "المستخدمون", href: "/admin#users", icon: Users },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const activePath = useMemo(() => pathname ?? "/admin", [pathname]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Local cleanup still matters if the backend request fails.
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      router.replace("/login");
    }
  };

  return (
    <nav
      className="sticky top-0 z-40 mx-auto w-full border-b border-[#E7ECE6] bg-[#FEFEFE]/85 px-6 py-3 backdrop-blur-md lg:w-[92%] lg:rounded-b-[32px]"
      dir="rtl"
    >
      <div className="flex items-center justify-between gap-4">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--secondary-color)]">
            <Image src={logoImage} alt="Osta" width={34} height={34} />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm text-[#6E7F79]">منصة أُسطى</p>
            <p className="text-lg font-bold text-[var(--primary-color)]">
              لوحة تحكم الإدارة
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const active =
              link.href === "/admin"
                ? activePath === "/admin"
                : activePath === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  active
                    ? "bg-[var(--secondary-color)] text-[var(--primary-color)]"
                    : "text-[#31554B] hover:bg-[#F6F8F4]"
                }`}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLogout}
            className="hidden items-center gap-2 rounded-full border border-[#D6DFD9] px-4 py-2 text-sm font-medium text-[#31554B] transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 md:flex"
          >
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D6DFD9] text-[var(--primary-color)] md:hidden"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="mt-4 flex flex-col gap-2 rounded-[28px] border border-[#E7ECE6] bg-white p-3 md:hidden">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-[#31554B] transition-all hover:bg-[#F6F8F4]"
              >
                <span>{link.label}</span>
                <Icon size={16} />
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-red-600 transition-all hover:bg-red-50"
          >
            <span>تسجيل الخروج</span>
            <LogOut size={16} />
          </button>
        </div>
      ) : null}
    </nav>
  );
}
