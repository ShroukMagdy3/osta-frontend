import Link from "next/link";

interface CTAButtonProps {
  href?: string;
  text?: string;
  className?: string;
}

export default function CTAButton({
  href = "/login",
  text = "اطلب خدمة الآن",
  className = "",
}: CTAButtonProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Arrow Circle */}
      <div
        className="
          w-14
          h-14
          rounded-full
          bg-[var(--accent-color)]
          flex
          items-center
          justify-center
          shadow-lg
        "
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </div>

      {/* Button */}
      <Link
        href={href}
        className="
          px-12
          py-4
          rounded-full
          bg-[var(--accent-color)]
          text-[var(--primary-color)]
          font-bold
          shadow-lg
          hover:bg-[var(--accent-hover)]
          transition-all
        "
      >
        {text}
      </Link>
    </div>
  );
}