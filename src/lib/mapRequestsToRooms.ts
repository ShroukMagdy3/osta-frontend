import {AssignedRequest, RequestStatus} from "@/types/request.types";
import {Room} from "@/types/chat.types";
import {chatService} from "@/api/services/chat.service";

// ── الطلبات اللي الشات متاح ليها (نفس allowedStatuses في الباك اند) ──────────
const CHATTABLE_STATUSES: RequestStatus[] = ["accepted", "in_progress", "on_the_way", "started"];

/**
 * بتجيب unreadCount + lastMessage الحقيقيين من GET /chat/:requestId/unread.
 * لو الـ request فشل (مثلاً الشات لسه متاح لكن مفيش رسايل) بترجع قيم افتراضية
 * عشان صفحة الرسائل ما توقفش بسبب room واحد.
 */
async function fetchUnreadInfo(
    requestId: string
): Promise<{unreadCount: number; lastMessage?: string; lastMessageTime?: string}> {
    try {
        const {count, lastMessage} = await chatService.getUnreadInfo(requestId);
        return {
            unreadCount: count ?? 0,
            lastMessage:
                lastMessage?.content?.trim() ||
                (lastMessage?.imageUrl ? "صورة" : undefined),
            // ⚠️ دي الساعة بتاعت آخر رسالة فعلية — مش تاريخ تحديث الـ request
            lastMessageTime: lastMessage?.createdAt,
        };
    } catch {
        return {unreadCount: 0};
    }
}

/**
 * بيحول رد /requests/my أو /requests/assigned لـ Room[]
 * اللي بتتعرض في RoomList.
 *
 * @param requests   array الطلبات الراجعة من الـ API
 * @param viewerRole دور المستخدم الحالي — بيحدد إزاي نجيب اسم "الطرف الآخر"
 */
export async function mapRequestsToRooms(
    requests: AssignedRequest[],
    viewerRole: "client" | "technician"
): Promise<Room[]> {
    const chattable = requests.filter((r) => CHATTABLE_STATUSES.includes(r.status));

    // نجيب unread info لكل room بالتوازي (مفيش bulk endpoint دلوقتي)
    const unreadInfos = await Promise.all(chattable.map((r) => fetchUnreadInfo(r._id)));

    return chattable.map((r, idx): Room => {
        // الـ client بيشوف اسم الفني، والفني بيشوف اسم الـ client
        // ⚠️ ملاحظة: AssignedRequest النهاردة فيها userId (بيانات الـ client) بس.
        // لو هتعرضي الصفحة دي للـ client، لازم الباك اند يرجّع بيانات الفني
        // (مثلاً assignedTechnician) جوه /requests/my response. لو الحقل
        // اسمه مختلف، غيّري الأسطر المعلّمة تحت بس.
        const otherPartyName =
            viewerRole === "client"
                ? // 👇 لو الحقل اسمه مختلف (مثلاً assignedTechnician) غيريه هنا
                  (r as unknown as {assignedTechnician?: {fullName?: string}}).assignedTechnician?.fullName ?? "الفني"
                : r.userId?.fullName ?? "العميل";

        const {unreadCount, lastMessage, lastMessageTime} = unreadInfos[idx];

        return {
            id: r._id,
            variant: "fixed",
            otherPartyName,
            initials: otherPartyName.slice(0, 2),
            title: r.serviceId?.name ?? r.title ?? "طلب خدمة",
            // لو مفيش رسايل لسه، نرجع لـ undefined عشان RoomList تعرض room.title بدالها
            lastMessage,
            // لو مفيش رسايل لسه، منرجعش تاريخ تحديث الـ request — نسيبها undefined
            lastMessageTime,
            unreadCount,
            requestId: r._id,
        };
    });
}
