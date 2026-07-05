export function validateStep1(fields: {
  description: string;
  title: string;
  hasBudget: boolean;
  budget: string;
}) {
  const e: Record<string, string> = {};
  if (!fields.description || fields.description.length < 10)
    e.description = "وصف المشكلة يجب أن يكون 10 أحرف على الأقل";
  if (fields.description.length > 500)
    e.description = "لا يتجاوز 500 حرف";
  if (!fields.title || fields.title.length < 5)
    e.title = "عنوان الخدمة يجب أن يكون 5 أحرف على الأقل";
  if (fields.title.length > 100)
    e.title = "لا يتجاوز 100 حرف";
  if (fields.hasBudget && fields.budget && Number(fields.budget) < 50)
    e.budget = "الميزانية 50 جنيه على الأقل";
  return e;
}

export function validateStep2(fields: {
  selectedTime: string;
  selectedDate: string;
  district: string;
  fullAddress: string;
}) {
  const e: Record<string, string> = {};
  if (!fields.selectedDate) e.date = "اختر تاريخ مناسب";
  if (!fields.selectedTime) e.time = "اختر وقت مناسب";
  if (!fields.district || fields.district.length < 3) e.district = "المنطقة 3 أحرف على الأقل";
  if (!fields.fullAddress || fields.fullAddress.length < 10) e.fullAddress = "العنوان 10 أحرف على الأقل";
  return e;
}