import { type ReactNode } from "react";

interface SegmentedButtonItem {
  content: ReactNode;
  onClick?: () => void;
  ariaLabel: string;
  type?: "button" | "submit";
}

interface SegmentedButtonGroupProps {
  items: SegmentedButtonItem[];
  className?: string;
}

export function SegmentedButtonGroup({
  items,
  className = "",
}: SegmentedButtonGroupProps) {
  return (
    <div className={`flex flex-row h-8 ${className}`}>
      {items.map((item, index) => {
        const isFirst = index === 0;
        const isLast = index === items.length - 1;

        return (
          <button
            key={index}
            type={item.type ?? "button"}
            onClick={item.onClick}
            aria-label={item.ariaLabel}
            className={[
              "shrink-0 px-2 text-neutral-400 text-sm hover:text-pistache-solar transition-colors cursor-pointer border border-transparent active:scale-90",
              isFirst
                ? "bg-neutral-600 rounded-l-full border-l-white/10 hover:border-l-pistache-solar"
                : "",
              isLast
                ? "bg-neutral-800 rounded-r-full border-r-white/10 hover:border-r-pistache-solar"
                : "",
            ].join(" ")}
          >
            {item.content}
          </button>
        );
      })}
    </div>
  );
}
