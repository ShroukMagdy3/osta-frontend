import { z } from "zod";

// ─── Reusable field schemas ───────────────────────────────────────────────────

const fullNameSchema = z
  .string()
  .min(1, "الاسم مطلوب")
  .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل")
  .max(100, "الاسم طويل جداً")
  .regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, "الاسم يجب أن يحتوي على أحرف فقط");

const genderSchema = z
  .string()
  .min(1, "الرجاء اختيار النوع")
  .refine(
    (value) => ["male", "female"].includes(value),
    "النوع غير صحيح"
  );

const emailSchema = z
  .string()
  .min(1, "البريد الإلكتروني مطلوب")
  .email("البريد الإلكتروني غير صحيح")
  .max(254, "البريد الإلكتروني طويل جداً")
  .toLowerCase(); // normalise before sending

const egyptianPhoneSchema = z
  .string()
  .min(1, "رقم الهاتف مطلوب")
  .regex(
    /^(\+20|0020|0)?1[0125][0-9]{8}$/,
    "رقم الهاتف يجب أن يكون رقم مصري صحيح (مثال: 01012345678)"
  );

const passwordSchema = z
  .string()
  .min(1, "كلمة المرور مطلوبة")
  .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
  .max(72, "كلمة المرور طويلة جداً") // bcrypt hard limit
  .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير واحد على الأقل")
  .regex(/[a-z]/, "يجب أن تحتوي على حرف صغير واحد على الأقل")
  .regex(/[0-9]/, "يجب أن تحتوي على رقم واحد على الأقل")
  .regex(/[^A-Za-z0-9]/, "يجب أن تحتوي على رمز خاص واحد على الأقل (!@#$%...)");

const governorateSchema = z
  .string()
  .min(1, "المحافظة مطلوبة");

const citySchema = z
  .string()
  .min(1, "المدينة مطلوبة")
  .min(2, "اسم المدينة قصير جداً")
  .max(100, "اسم المدينة طويل جداً")
  .regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, "اسم المدينة يجب أن يحتوي على أحرف فقط");

// ─── 1. Login ─────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "كلمة المرور مطلوبة"), // login: no strength rules, just required
});

export const clientGoogleCompletionSchema = z.object({
  phone: egyptianPhoneSchema,
  governorate: governorateSchema,
  city: citySchema,
  gender: genderSchema,
});

export type ClientGoogleCompletionFormData = z.infer<
  typeof clientGoogleCompletionSchema
>;

export type LoginFormData = z.infer<typeof loginSchema>;

// ─── 2. Register — User ───────────────────────────────────────────────────────

export const userRegisterSchema = z
  .object({
    fullName: fullNameSchema,
    gender: genderSchema,
    email: emailSchema,
    phone: egyptianPhoneSchema,
    governorate: z.string().optional(),
    city: z.string().optional(),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "يجب الموافقة على الشروط والأحكام",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export type UserRegisterFormData = z.infer<typeof userRegisterSchema>;

// ─── 3. Register — Technician Basic Info ─────────────────────────────────────

export const technicianBasicInfoSchema = z
  .object({
    fullName: fullNameSchema,
    gender: genderSchema,
    email: emailSchema,
    phone: egyptianPhoneSchema,
    governorate: governorateSchema,
    city: citySchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export type TechnicianBasicInfoFormData = z.infer<typeof technicianBasicInfoSchema>;

// ─── 4. Technician — Specializations & Services ───────────────────────────────

export const specializationsSchema = z.object({
  categoryId: z.string().min(1, "اختر تخصصاً واحداً على الأقل"),
  serviceIds: z.array(z.string()).optional(),
});

export type SpecializationsFormData = z.infer<typeof specializationsSchema>;

// ─── 5. Technician — Experience & Tools ──────────────────────────────────────

export const experienceSchema = z
  .object({
    experienceYears: z.string().min(1, "اختر سنوات الخبرة"),
    hasTransport: z.string().min(1, "اختر إجابة وسيلة المواصلات"),
    hasTools: z.string().min(1, "اختر إجابة الأدوات"),
    selectedDays: z.array(z.string()).min(1, "اختر يوم عمل واحد على الأقل"),
    fromHour: z.string().min(1, "اختر وقت بدء العمل"),
    toHour: z.string().min(1, "اختر وقت انتهاء العمل"),
  })
  .refine(
    (data) => {
      // make sure end time is after start time
      if (!data.fromHour || !data.toHour) return true;
      const toIndex = getHourIndex(data.toHour);
      const fromIndex = getHourIndex(data.fromHour);
      return toIndex > fromIndex;
    },
    {
      message: "وقت الانتهاء يجب أن يكون بعد وقت البدء",
      path: ["toHour"],
    }
  );

export type ExperienceFormData = z.infer<typeof experienceSchema>;

// ─── 6. Technician — Work Area ────────────────────────────────────────────────

export const workAreaSchema = z.object({
  workRange: z
    .string()
    .min(1, "حدد نطاق العمل")
    .min(3, "نطاق العمل قصير جداً")
    .max(200, "نطاق العمل طويل جداً"),
  canWorkOutside: z.string().min(1, "اختر إجابة العمل خارج المنطقة"),
});

export type WorkAreaFormData = z.infer<typeof workAreaSchema>;

// ─── 7. Technician — Identity Verification ───────────────────────────────────

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

const imageFileSchema = (label: string) =>
  z
    .instanceof(File)
    .refine((f) => ALLOWED_TYPES.includes(f.type), {
      message: `${label}: يجب أن تكون الصورة من نوع JPG أو PNG أو WebP`,
    })
    .refine((f) => f.size <= MAX_FILE_SIZE, {
      message: `${label}: حجم الصورة يجب أن يكون أقل من 5 ميجابايت`,
    });

export const identitySchema = z.object({
  idFrontImage: imageFileSchema("صورة البطاقة الأمامية")
    .nullable()
    .refine((f) => f !== null, { message: "صورة البطاقة الأمامية مطلوبة" }),
  idBackImage: imageFileSchema("صورة البطاقة الخلفية")
    .nullable()
    .refine((f) => f !== null, { message: "صورة البطاقة الخلفية مطلوبة" }),
  personalImage: imageFileSchema("صورة السيلفي")
    .nullable()
    .refine((f) => f !== null, { message: "صورة السيلفي مع البطاقة مطلوبة" }),
  certificateImage: imageFileSchema("شهادة الخبرة").nullable().optional(),
  criminalRecordImage: imageFileSchema("فيش وتشبيه").nullable().optional(),
});

export type IdentityFormData = z.infer<typeof identitySchema>;

// ─── 8. Forgot Password ───────────────────────────────────────────────────────

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// ─── 9. Reset Password ────────────────────────────────────────────────────────

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// ─── Generic helper — run a Zod schema and return field errors map ────────────

export function validateSchema<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): Partial<Record<string, string>> | null {
  const result = schema.safeParse(data);
  if (result.success) return null;

  const fieldErrors: Partial<Record<string, string>> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as string;
    if (key && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

// ─── Internal helper — convert hour label to numeric index ───────────────────

function getHourIndex(hour: string): number {
  const hourMap: Record<string, number> = {
    "12 AM": 0,  "1 AM": 1,  "2 AM": 2,  "3 AM": 3,
    "4 AM": 4,   "5 AM": 5,  "6 AM": 6,  "7 AM": 7,
    "8 AM": 8,   "9 AM": 9,  "10 AM": 10,"11 AM": 11,
    "12 PM": 12, "1 PM": 13, "2 PM": 14, "3 PM": 15,
    "4 PM": 16,  "5 PM": 17, "6 PM": 18, "7 PM": 19,
    "8 PM": 20,  "9 PM": 21, "10 PM": 22,"11 PM": 23,
  };
  return hourMap[hour] ?? -1;
}
