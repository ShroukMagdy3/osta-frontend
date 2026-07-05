// مطابق لـ enum WithdrawalMethod في الباك إند
export enum WithdrawalMethod {
  INSTAPAY = "instapay",
  VODAFONE_CASH = "vodafone_cash",
  VISA = "visa",
}

export interface WithdrawalFormErrors {
  amount?: string;
  method?: string;
  accountNumber?: string;
}

export interface WithdrawalFormValues {
  amount: string;
  method: WithdrawalMethod | "";
  accountNumber: string;
}

const EGYPTIAN_MOBILE_REGEX = /^01[0125][0-9]{8}$/;
const BANK_ACCOUNT_REGEX = /^[0-9]{10,20}$/;

/**
 * يتحقق من قيم فورم طلب السحب، مطابق لـ RequestWithdrawalDto في الباك إند:
 * - amount: @IsNumber() @Min(50)
 * - method: @IsEnum(WithdrawalMethod)
 * - accountNumber: @IsString() @IsNotEmpty()
 *
 * @param values قيم الفورم الحالية
 * @param maxAmount الرصيد المتاح (اختياري)، لو موجود بنتحقق إن المبلغ المطلوب مش أكبر منه
 */
export function validateWithdrawalForm(
  values: WithdrawalFormValues,
  maxAmount?: number
): WithdrawalFormErrors {
  const { amount, method, accountNumber } = values;
  const errors: WithdrawalFormErrors = {};

  // amount
  if (!amount.trim()) {
    errors.amount = "من فضلك أدخل المبلغ";
  } else if (Number.isNaN(Number(amount))) {
    errors.amount = "المبلغ يجب أن يكون رقمًا";
  } else if (Number(amount) < 50) {
    errors.amount = "أقل مبلغ للسحب هو 50 جنيه";
  } else if (maxAmount !== undefined && Number(amount) > maxAmount) {
    errors.amount = "المبلغ المطلوب أكبر من رصيدك المتاح";
  }

  // method
  if (!method) {
    errors.method = "من فضلك اختر طريقة السحب";
  }

  // accountNumber
  if (!accountNumber.trim()) {
    errors.accountNumber = "من فضلك أدخل رقم الحساب";
  } else if (
    (method === WithdrawalMethod.VODAFONE_CASH || method === WithdrawalMethod.INSTAPAY) &&
    !EGYPTIAN_MOBILE_REGEX.test(accountNumber.trim())
  ) {
    errors.accountNumber = "من فضلك أدخل رقم موبايل مصري صحيح (01xxxxxxxxx)";
  } else if (method === WithdrawalMethod.VISA && !BANK_ACCOUNT_REGEX.test(accountNumber.trim())) {
    errors.accountNumber = "من فضلك أدخل رقم حساب بنكي صحيح (10-20 رقم)";
  }

  return errors;
}

export function isWithdrawalFormValid(errors: WithdrawalFormErrors): boolean {
  return Object.keys(errors).length === 0;
}