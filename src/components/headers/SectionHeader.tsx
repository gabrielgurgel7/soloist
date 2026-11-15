import type { ReactNode } from "react";
import { FilterButton, AddButton } from "../buttons/Buttons";

interface SectionHeaderProps {
  title: string;
  icon?: ReactNode;
  badge?: ReactNode;
  onAdd?: () => void;
  onFilter?: () => void;
}

export function SectionHeader({
  title,
  icon,
  badge,
  onAdd,
  onFilter,
}: SectionHeaderProps) {
  return (
    <div className="inline-flex w-full gap-2 items-center justify-between border border-white/10 bg-neutral-900/90 shadow-2xl shadow-black/40 backdrop-blur-sm rounded-full px-4 py-2">
      <div className="flex items-center gap-2 min-w-0">
        {icon}
        <h2 className="text-amber-50 text-lg font-bold truncate">{title}</h2>
      </div>
      <div className="inline-flex items-center gap-1 shrink-0">
        {badge}
        {onFilter && <FilterButton onClick={onFilter} />}
        {onAdd && <AddButton onClick={onAdd} />}
      </div>
    </div>
  );
}

interface PageTitleHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  rightContent?: ReactNode;
}

export function PageTitleHeader({
  title,
  subtitle,
  icon,
  rightContent,
}: PageTitleHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-2 border-b border-white/10">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-neutral-900/90 border border-white/10 text-pistache-solar shrink-0 shadow-md">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-pistache-solar font-sora leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-neutral-300 font-inter">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {rightContent && <div className="flex items-center gap-2">{rightContent}</div>}
    </div>
  );
}


