"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/technician/Navbar";
import ProfileSidebar, {
  ProfileTab,
} from "@/components/sections/technician/profile/ProfileSidebar";
import AccountInfoSection from "@/components/sections/technician/profile/AccountInfoSection";
import WorkInfoSection from "@/components/sections/technician/profile/WorkInfoSection";
import ExperienceToolsSection from "@/components/sections/technician/profile/ExperienceToolsSection";
import WorkAreaSection from "@/components/sections/technician/profile/WorkAreaSection";
import IdentitySection from "@/components/sections/technician/profile/IdentitySection";
import SecuritySection from "@/components/sections/technician/profile/SecuritySection";
import ReviewsSection from "@/components/sections/technician/profile/ReviewsSection";
import { api } from "@/api/axios";
import WalletPage from "@/components/sections/technician/profile/WalletPage";

interface ServiceOption {
  id: string;
  name: string;
}

interface TechDetails {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  passwordChangedAt?: string | null;
  governorate: string;
  city: string;
  jobTitle: string;
  categoryId: string;
  category: string;
  services: ServiceOption[];
  yearsOfExperience: number;
  hasTools: boolean;
  hasTransportation: boolean;
  workingDays: string[];
  startTime: string;
  endTime: string;
  serviceAreas: string[];
  canWorkOutsideArea: boolean;
  verificationStatus: "incomplete" | "pending" | "approved" | "rejected";
  verifiedAt?: string | null;
  rejectionReason?: string | null;
  idFrontImage?: string | null;
  idBackImage?: string | null;
  personalImage?: string | null;
  certificateImage?: string | null;
  criminalRecordImage?: string | null;
}

interface TechDashboardProfile {
  verificationStatus: "incomplete" | "pending" | "approved" | "rejected";
  averageRating: number;
  totalReviews: number;
}

const TAB_LABELS: Record<ProfileTab, string> = {
  account: "بيانات الحساب",
  work: "بيانات العمل",
  experience: "الخبرة والأدوات",
  area: "منطقة العمل",
  identity: "التحقق من الهوية",
  security: "الأمان",
  reviews: "التقييمات",
  wallet: "المحفظة",
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("account");

  const [details, setDetails] = useState<TechDetails | null>(null);
  const [dashboardProfile, setDashboardProfile] =
    useState<TechDashboardProfile | null>(null);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [detailsRes, dashboardRes] = await Promise.all([
          api.get("/technician/details"),
          api.get("/technician/dashboard"),
        ]);

        console.log("detailsRes.data:", detailsRes.data);
        console.log("dashboardRes.data:", dashboardRes.data);
        const fetchedDetails = detailsRes.data?.data ?? null;
        setDetails(
          fetchedDetails
            ? {
                ...fetchedDetails,
                jobTitle: fetchedDetails.jobTitle ?? "",
                categoryId: fetchedDetails.categoryId ?? "",
                category: fetchedDetails.category ?? "",
                services: fetchedDetails.services ?? [],
                workingDays: fetchedDetails.workingDays ?? [],
                serviceAreas: fetchedDetails.serviceAreas ?? [],
                canWorkOutsideArea: fetchedDetails.canWorkOutsideArea ?? false,
                verificationStatus:
                  fetchedDetails.verificationStatus ?? "incomplete",
              }
            : null,
        );
        setDashboardProfile(dashboardRes.data?.data?.profile ?? null);
        setCompletedOrders(dashboardRes.data?.data?.stats?.completed ?? 0);
      } catch {
        // VerificationGate / axios interceptor already handles auth redirects
      } finally {
        setLoading(false);
      }
    };

    void fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9F7]">
        <div className="lg:p-5">
          <Navbar />
        </div>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary-color)] border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!details) return null;

  return (
    <div className="min-h-screen bg-[#F8F9F7]">
      <div className="lg:p-5">
        <Navbar />
      </div>

      <div
        dir="rtl"
        className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-8 md:px-8 lg:grid-cols-[320px_1fr] lg:px-0"
      >
        {/* Sidebar — first in DOM so it sits on the right under dir="rtl" */}
        <div>
          <ProfileSidebar
            fullName={details.fullName}
            category={details.category}
            isVerified={dashboardProfile?.verificationStatus === "approved"}
            stats={{
              yearsOfExperience: details.yearsOfExperience ?? 0,
              totalOrders: completedOrders,
              averageRating: dashboardProfile?.averageRating ?? 0,
            }}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Main content */}
        <div>
          {activeTab === "account" && (
            <AccountInfoSection phone={details.phone} email={details.email} />
          )}

          {activeTab === "work" && (
            <WorkInfoSection
              jobTitle={details.jobTitle}
              category={details.category}
              categoryId={details.categoryId}
              services={details.services}
              onSaved={({ jobTitle, services }) =>
                setDetails((d) => (d ? { ...d, jobTitle, services } : d))
              }
            />
          )}

          {activeTab === "experience" && (
            <ExperienceToolsSection
              yearsOfExperience={details.yearsOfExperience}
              hasTools={details.hasTools}
              hasTransportation={details.hasTransportation}
              workingDays={details.workingDays}
              startTime={details.startTime}
              endTime={details.endTime}
              onSaved={(data) => setDetails((d) => (d ? { ...d, ...data } : d))}
            />
          )}

          {activeTab === "area" && (
            <WorkAreaSection
              governorate={details.governorate}
              city={details.city}
              serviceAreas={details.serviceAreas}
              canWorkOutsideArea={details.canWorkOutsideArea}
              onSaved={(data) => setDetails((d) => (d ? { ...d, ...data } : d))}
            />
          )}

          {activeTab === "identity" && (
            <IdentitySection
              verificationStatus={details.verificationStatus}
              verifiedAt={details.verifiedAt}
              rejectionReason={details.rejectionReason}
              idFrontImage={details.idFrontImage}
              idBackImage={details.idBackImage}
              personalImage={details.personalImage}
              certificateImage={details.certificateImage}
              criminalRecordImage={details.criminalRecordImage}
              onResubmitted={() => {
                // Refetch details so verificationStatus updates to "pending"
                api.get("/technician/details").then((res) => {
                  const d = res.data?.data;
                  if (d)
                    setDetails((prev) => (prev ? { ...prev, ...d } : prev));
                });
              }}
            />
          )}

          {activeTab === "security" && (
            <SecuritySection
              email={details.email}
              passwordChangedAt={details.passwordChangedAt}
              onPasswordChanged={() => {
                // Refetch /users/me to get the new passwordChangedAt
                api.get("/users/me").then((res) => {
                  const d = res.data?.data;
                  if (d)
                    setDetails((prev) =>
                      prev
                        ? { ...prev, passwordChangedAt: d.passwordChangedAt }
                        : prev,
                    );
                });
              }}
            />
          )}

          {activeTab === "reviews" && (
            <ReviewsSection
              technicianId={details._id}
              averageRating={dashboardProfile?.averageRating ?? 0}
              totalReviews={dashboardProfile?.totalReviews ?? 0}
            />
          )}

          {activeTab === "wallet" && <WalletPage />}
        </div>
      </div>
    </div>
  );
}
