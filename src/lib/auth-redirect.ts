import {AuthUser} from "@/types/auth.types";

function getTechnicianNextRoute(user: AuthUser): string {
    const currentStep = user.technicianData?.currentStep ?? 1;
    const isProfileComplete = user.technicianData?.isProfileComplete ?? false;

    if (isProfileComplete || currentStep >= 5) {
        return "/technician/orders";
    }

    if (currentStep <= 1) {
        return "/register/technician/specializationsAndServices";
    }

    if (currentStep === 2) {
        return "/register/technician/experienceAndTools";
    }

    if (currentStep === 3) {
        return "/register/technician/work-area";
    }

    return "/register/technician/identity-verification";
}

export function getPostLoginRoute(user: AuthUser): string {
    // if (!user.isVerified) {
    //     return "/verify-email";
    // }

    if (user.role === "client" && !user.profileComplete) {
        return "/register/user/complete-profile";
    }

    if (user.role === "technician") {
        return getTechnicianNextRoute(user);
    }

    if (user.role === "admin") {
        return "/admin";
    }

    return "/client/home";
}
