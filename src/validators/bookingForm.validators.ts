import {z} from "zod";

// ─── Field schemas ─────────────────────────────────────────────────────────────

const districtSchema = z
.string()
.min(1, "المنطقة مطلوبة")
.min(2, "اسم المنطقة قصير جداً")
.max(100, "اسم المنطقة طويل جداً")
.regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, "اسم المنطقة يجب أن يحتوي على أحرف فقط");

const fullAddressSchema = z.string().min(1, "العنوان مطلوب").min(10, "العنوان قصير جداً").max(300, "العنوان طويل جداً");

const notesSchema = z.string().max(500, "الملاحظات طويلة جداً").optional();

const selectedTimeSchema = z.string().min(1, "الوقت مطلوب");

// ─── Main booking form schema ──────────────────────────────────────────────────

export const bookingFormSchema = z.object({
    district: districtSchema,
    fullAddress: fullAddressSchema,
    notes: notesSchema,
    selectedTime: selectedTimeSchema,
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

// ─── Generic helper (نفس النمط المستخدم في auth.validators) ──────────────────

export function validateBookingForm(data: unknown): Partial<Record<keyof BookingFormData, string>> | null {
    const result = bookingFormSchema.safeParse(data);
    if (result.success) return null;

    const fieldErrors: Partial<Record<keyof BookingFormData, string>> = {};
    for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof BookingFormData;
        if (key && !fieldErrors[key]) {
            fieldErrors[key] = issue.message;
        }
    }
    return fieldErrors;
}