/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState, KeyboardEvent, ChangeEvent } from "react";
import { ChatComposerPayload } from "@/types/chat.types";

interface Props {
  onSend: (payload: ChatComposerPayload) => Promise<boolean>;
  onAttachImage?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ChatInput({
  onSend,
  onAttachImage,
  disabled = false,
  placeholder = "صف مشكلتك هنا...",
}: Props) {
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resetComposer = () => {
    setText("");
    setSelectedImage(null);
    setLocalError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    if ((!trimmed && !selectedImage) || disabled) return;

    const didSend = await onSend({ content: trimmed, image: selectedImage });
    if (didSend) {
      resetComposer();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const handleSelectImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setLocalError("يسمح فقط بصور JPG أو PNG أو WebP.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setLocalError("حجم الصورة يجب أن يكون أقل من 5 ميجابايت.");
      event.target.value = "";
      return;
    }

    setLocalError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedImage(null);
    setPreviewUrl(null);
    setLocalError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="border-t border-[#EEF1EF] bg-white flex-shrink-0">
      {/* Image Preview */}
      {previewUrl || localError ? (
        <div className="px-3 sm:px-4 pt-2 sm:pt-3">
          {previewUrl ? (
            <div className="inline-flex items-start gap-1.5 sm:gap-2 rounded-2xl border border-[#E0DED9] bg-[#FAFBFA] p-1.5 sm:p-2">
              <img
                src={previewUrl}
                alt="معاينة الصورة"
                className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex flex-col justify-between gap-1 sm:gap-2 min-w-0">
                <span className="max-w-24 sm:max-w-32 truncate text-[11px] sm:text-xs text-[#31554B]">
                  {selectedImage?.name}
                </span>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-right text-[10px] sm:text-[11px] text-[#A05A5A] hover:underline"
                >
                  إزالة الصورة
                </button>
              </div>
            </div>
          ) : null}

          {localError ? (
            <p className="mt-2 text-[11px] sm:text-xs text-[#A05A5A]">{localError}</p>
          ) : null}
        </div>
      ) : null}

      {/* Input Area */}
      <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3">
        {/* Attach Image Button */}
        <button
          type="button"
          onClick={() => {
            setLocalError(null);
            onAttachImage?.();
            fileInputRef.current?.click();
          }}
          disabled={disabled}
          aria-label="إرفاق صورة"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:bg-[#F4F6F4] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg
            width="20"
            height="17"
            viewBox="0 0 25 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.0212 20.02H4.60375C3.58167 20.02 2.60146 19.614 1.87874 18.8913C1.15602 18.1685 0.75 17.1883 0.75 16.1663V7.17375C0.749836 6.66756 0.849395 6.1663 1.04299 5.6986C1.23659 5.2309 1.52043 4.80592 1.8783 4.44793C2.23617 4.08994 2.66106 3.80597 3.1287 3.61222C3.59634 3.41847 4.09756 3.31875 4.60375 3.31875H6.3775C6.8875 3.31875 7.3775 3.11625 7.74 2.75375L9.1775 1.315C9.54 0.95375 10.0275 0.75 10.54 0.75H14.085C14.3381 0.749982 14.5887 0.799875 14.8225 0.896825C15.0563 0.993774 15.2687 1.13588 15.4475 1.315L16.885 2.75375C17.2475 3.115 17.7375 3.31875 18.2475 3.31875H20.0212C20.5274 3.31875 21.0287 3.41847 21.4963 3.61222C21.9639 3.80597 22.3888 4.08994 22.7467 4.44793C23.1046 4.80592 23.3884 5.2309 23.582 5.6986C23.7756 6.1663 23.8752 6.66756 23.875 7.17375V16.1663C23.875 17.1883 23.469 18.1685 22.7463 18.8913C22.0235 19.614 21.0433 20.02 20.0212 20.02Z"
              stroke="#1C4B41"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.9462 14.6612C14.9825 15.6249 13.6755 16.1663 12.3126 16.1663C10.9497 16.1663 9.64264 15.6249 8.67893 14.6612C7.71523 13.6975 7.17383 12.3904 7.17383 11.0275C7.17383 9.66466 7.71523 8.3576 8.67893 7.3939C9.64264 6.4302 10.9497 5.88879 12.3126 5.88879C13.6755 5.88879 14.9825 6.4302 15.9462 7.3939C16.9099 8.3576 17.4513 9.66466 17.4513 11.0275C17.4513 12.3904 16.9099 13.6975 15.9462 14.6612Z"
              stroke="#1C4B41"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          onChange={handleSelectImage}
          className="hidden"
        />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          dir="rtl"
          className="flex-1 resize-none rounded-full border border-[#E0DED9] px-3 sm:px-4 py-1.5 sm:py-2.5 text-xs sm:text-sm text-[#1F2D28] placeholder-[#BBBBBB] outline-none focus:border-[#7CB342] transition-colors bg-[#FAFBFA] disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed overflow-hidden"
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={() => {
            void handleSend();
          }}
          disabled={disabled || (!text.trim() && !selectedImage)}
          aria-label="إرسال"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#B3E718] flex items-center justify-center flex-shrink-0 transition-all hover:bg-[#6a9e32] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.8865 18.0716C7.85484 18.1505 7.79981 18.2179 7.72878 18.2646C7.65775 18.3113 7.57413 18.3352 7.48914 18.333C7.40415 18.3308 7.32186 18.3027 7.25331 18.2524C7.18477 18.2021 7.13325 18.1321 7.10567 18.0516L1.689 2.2183C1.66233 2.14446 1.65724 2.06455 1.67433 1.98793C1.69142 1.9113 1.72997 1.84113 1.78549 1.78561C1.841 1.7301 1.91117 1.69154 1.9878 1.67446C2.06442 1.65737 2.14433 1.66246 2.21817 1.68913L18.0515 7.1058C18.1319 7.13338 18.202 7.1849 18.2523 7.25344C18.3026 7.32199 18.3307 7.40428 18.3329 7.48926C18.335 7.57425 18.3112 7.65787 18.2645 7.7289C18.2177 7.79993 18.1504 7.85497 18.0715 7.88663L11.4632 10.5366C11.2543 10.6203 11.0645 10.7453 10.9052 10.9043C10.7459 11.0633 10.6205 11.2529 10.5365 11.4616L7.8865 18.0716Z"
              stroke="#1C4B41"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.78812 1.78918L10.9048 10.905"
              stroke="#1C4B41"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}