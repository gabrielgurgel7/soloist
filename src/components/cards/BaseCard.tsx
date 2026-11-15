import type { ReactNode } from "react";
import { EditButton } from "../buttons/Buttons";

interface BaseCardProps {
  title: string;
  headerBg?: string;
  headerText?: string;
  children: ReactNode;
  rightAction?: ReactNode;
  showEditButton?: boolean;
  className?: string;
  minHeight?: string;
}

export function BaseCard({
  title,
  headerBg,
  headerText = "text-white",
  children,
  rightAction,
  showEditButton = false,
  className = "",
  minHeight = "min-h-52",
}: BaseCardProps) {
  return (
    <div
      className={`relative flex flex-col w-full ${minHeight} rounded-2xl shadow-sm overflow-hidden ${className}`}
    >
      {/* HEADER */}
      <div
        className={`flex items-center justify-between py-2 px-4  ${headerBg} ${headerText}`}
      >
        <h3 className="text-lg font-bold font-sora truncate">{title}</h3>

        <div className="flex items-center gap-2">
          {rightAction ?? (showEditButton && <EditButton />)}
        </div>
      </div>

      {/* BODY */}
      <div className="flex flex-col flex-1 gap-2 p-2 backdrop-blur-md bg-emerald-950/60 border border-t-0 border-amber-50/10">
        {children}
      </div>
    </div>
  );
}
