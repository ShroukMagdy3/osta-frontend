import { api } from "@/api/axios";
import { WithdrawalMethod } from "@/validators/withdraw.validators";

export interface Transaction {
  _id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  status: string;
  requestId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalletData {
  _id: string;
  userId: string;
  balance: number;
  totalEarned: number;
  totalWithdrawn: number;
  transactions: Transaction[];
  createdAt: string;
  updatedAt: string;
}

export interface WalletApiResponse {
  success: boolean;
  message: string;
  data: WalletData;
  timestamp: string;
}

export interface RequestWithdrawalPayload {
  amount: number;
  method: WithdrawalMethod;
  accountNumber: string;
}


export async function getWallet(): Promise<WalletData> {
  try {
    const { data } = await api.get<WalletApiResponse>("/wallet");
    return data.data;
  } catch (err) {
    throw new Error("فشل تحميل بيانات المحفظة");
  }
}

/**
 * POST /wallet/withdraw
 */
export async function requestWithdrawal(payload: RequestWithdrawalPayload): Promise<void> {
  try {
    await api.post("/wallet/withdraw", payload);
  } catch (err: any) {
    const message = err?.response?.data?.message || "حدث خطأ أثناء إرسال طلب السحب";
    throw new Error(message);
  }
}