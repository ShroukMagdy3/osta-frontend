import { ClientRequest } from "@/types/trackingClient.types";

export function getErrorMessage(error: unknown, p0?: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "حدث خطأ غير متوقع";
}

export function getInvoiceAmounts(request: ClientRequest) {
    const servicePrice = request.servicePrice ?? 0;
    const materialsPrice = request.extraMaterialsPrice ?? 0;
    const total = request.totalPrice ?? servicePrice + materialsPrice;

    const prepaid = request.depositStatus === "paid" ? request.depositAmount ?? 0 : 0;

    const remaining = request.isFullyPaid ? 0 : Math.max(total - prepaid, 0);

    return {
        servicePrice,
        materialsPrice,
        total,
        prepaid,
        remaining,
    };
}