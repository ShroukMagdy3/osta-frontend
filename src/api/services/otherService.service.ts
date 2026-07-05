import { api } from "@/api/axios";

export async function suggestTitle(description: string): Promise<string> {
  const token =
   typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/suggest-title`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ description }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? `HTTP ${res.status}`);
  }

  const json = await res.json();
  // Shape: { success, message, data: { title }, timestamp }
  const title = json?.data?.title;
  if (!title) throw new Error("لم يتم إرجاع عنوان من الخادم");
  return title;
}

export async function createPost(data: {
  categoryId: string;
  description: string;
  title: string;
  selectedTime: string;
  selectedDate: "today" | "other";
  customDate: string;
  district: string;
  fullAddress: string;
  hasBudget: boolean;
  budget: string;
  image: File | null;
}) {
  const formData = new FormData();
  formData.append("categoryId", data.categoryId);
  formData.append("description", data.description);
  formData.append("title", data.title);
  formData.append("preferredTime", data.selectedTime);
  formData.append(
    "preferredDate",
    data.selectedDate === "today"
      ? new Date().toISOString().split("T")[0]
      : data.customDate
  );
  formData.append("address[district]", data.district);
  formData.append("address[fullAddress]", data.fullAddress);
const budgetNum = Number(data.budget);
if (data.hasBudget && !isNaN(budgetNum) && budgetNum > 0) {
  formData.append("budget", String(budgetNum));
}  if (data.image) formData.append("image", data.image);

  await api.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}