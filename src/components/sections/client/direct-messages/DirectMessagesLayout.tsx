"use client";

import { ReactNode } from "react";

interface Props {
  navbar: ReactNode;
  roomList: ReactNode;
  chatWindow: ReactNode;
  /**
   * على الموبايل بنعرض عمود واحد بس في المرة الواحدة.
   * لو فيه غرفة مختارة (activeRoom) بنعرض الشات، غير كده بنعرض القايمة.
   * على lg+ الاتنين بيظهروا جنب بعض زي الأول.
   */
  isRoomSelected?: boolean;
}

/**
 * الـ layout الموحد لصفحة الرسائل (client + technician).
 * النافبار فوق، وتحته container واحد فيه:
 * - عمود الشات على الشمال (الأكبر)
 * - عمود قائمة المحادثات على اليمين ("الرسائل")
 */
export default function DirectMessagesLayout({
  navbar,
  roomList,
  chatWindow,
  isRoomSelected = false,
}: Props) {
  return (
    <div className="min-h-dvh bg-[#F4F6F4] flex flex-col" dir="rtl">
      {navbar}

      <div className="flex-1 min-h-0 px-3 py-3 sm:px-4 md:px-6 md:py-4">
        <div className="mx-auto flex h-[calc(100dvh-110px)] max-w-7xl flex-col overflow-hidden rounded-3xl border border-[#EAECE8] bg-white shadow-[0_8px_30px_rgba(17,45,39,0.06)] lg:flex-row">
          {/* عمود قائمة المحادثات — على اليمين */}
          <div
            className={`${
              isRoomSelected ? "hidden" : "flex"
            } min-h-0 w-full flex-shrink-0 flex-col border-b border-[#EEF1EF] lg:flex lg:max-w-[360px] lg:border-b-0 lg:border-l`}
          >
            {roomList}
          </div>

          {/* عمود الشات — على الشمال */}
          <div
            className={`${
              isRoomSelected ? "flex" : "hidden"
            } min-h-0 min-w-0 flex-1 flex-col border-t border-[#EEF1EF] lg:flex lg:border-t-0 lg:border-l`}
          >
            {chatWindow}
          </div>
        </div>
      </div>
    </div>
  );
}