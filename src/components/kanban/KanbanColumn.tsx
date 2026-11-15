import type { DragEvent, ReactNode } from "react";
import { SectionHeader } from "../headers/SectionHeader";

interface KanbanColumnProps {
  title: string;
  subtitle?: string;
  isDragOver: boolean;
  isDraggingAny: boolean;
  emptyMessage?: string;
  hasItems: boolean;
  itemCount?: number;
  onAdd?: () => void;
  onFilter?: () => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  children: ReactNode;
}

export function KanbanColumn({
  title,
  subtitle,
  isDragOver,
  isDraggingAny,
  emptyMessage = "Arraste um card para cá",
  hasItems,
  itemCount = 0,
  onAdd,
  onFilter,
  onDragOver,
  onDragLeave,
  onDrop,
  children,
}: KanbanColumnProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      aria-label={`Coluna ${title}`}
      className={[
        "flex flex-col gap-4 rounded-2xl p-2 min-h-80 transition-all duration-200",
        isDragOver
          ? "bg-pistache-solar/10 ring-2 ring-pistache-solar border border-dashed border-pistache-solar/60 scale-[1.01]"
          : isDraggingAny
            ? "bg-neutral-900/30 border border-dashed border-white/20"
            : "border border-transparent",
      ].join(" ")}
    >
      <div className="flex flex-col gap-1">
        <SectionHeader title={title} onAdd={onAdd} onFilter={onFilter} />
        {subtitle && (
          <span className="text-xs text-pistache-solar/80 font-inter px-4">
            {subtitle}
          </span>
        )}
      </div>

      <ul
        className={[
          "flex flex-col gap-4 flex-1",
          itemCount > 4 ? "solo-card-scroll" : "",
        ].join(" ")}
      >
        {children}

        {!hasItems && (
          <li
            className={[
              "flex flex-1 min-h-36 items-center justify-center rounded-2xl border border-dashed px-4 text-center text-xs transition-colors",
              isDragOver
                ? "border-pistache-solar text-pistache-solar bg-pistache-solar/10 font-medium"
                : "border-white/10 text-neutral-400 bg-neutral-900/20",
            ].join(" ")}
          >
            {isDragOver ? `Soltar em "${title}"` : emptyMessage}
          </li>
        )}

        {hasItems && isDragOver && (
          <li className="flex h-16 items-center justify-center rounded-2xl border border-dashed border-pistache-solar bg-pistache-solar/10 text-xs font-medium text-pistache-solar transition-all">
            Soltar em &ldquo;{title}&rdquo;
          </li>
        )}
      </ul>
    </div>
  );
}
