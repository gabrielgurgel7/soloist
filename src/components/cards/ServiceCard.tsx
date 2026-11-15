import { Check, Plus, Flame } from "lucide-react";
import { BaseCard } from "./BaseCard";

interface ServiceCardProps {
  title: string;
  description: string;
  price: number;
  category?: string;
  estimatedHours?: number;
  revisionsIncluded?: number;
  timesRequested?: number;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export function ServiceCard({
  title,
  description,
  price,
  category,
  estimatedHours,
  revisionsIncluded,
  timesRequested,
  isSelected = false,
  onToggleSelect,
}: ServiceCardProps) {
  return (
    <BaseCard
      title={title}
      headerBg={isSelected ? "bg-pistache-solar" : "bg-blue-300"}
      headerText="text-slate-800"
      minHeight="h-auto"
      className={
        isSelected
          ? "ring-2 ring-pistache-solar shadow-lg shadow-pistache-solar/20 transition-all"
          : "transition-all"
      }
      rightAction={
        onToggleSelect ? (
          <button
            type="button"
            onClick={onToggleSelect}
            title={
              isSelected
                ? "Remover da combinação"
                : "Selecionar para orçamento/combinação"
            }
            className={[
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold cursor-pointer transition-colors",
              isSelected
                ? "bg-emerald-950 text-pistache-solar"
                : "bg-slate-800/80 text-white hover:bg-slate-900",
            ].join(" ")}
          >
            {isSelected ? (
              <>
                <Check size={13} /> Selecionado
              </>
            ) : (
              <>
                <Plus size={13} /> Combinar
              </>
            )}
          </button>
        ) : undefined
      }
    >
      <p className="text-sm text-neutral-200 font-inter">
        {description || "Sem descrição informada."}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="inline-block text-center text-xs font-bold bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full">
          R${" "}
          {price.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>

        {category && (
          <span className="text-xs bg-white/10 text-neutral-200 px-2 py-0.5 rounded-full">
            {category}
          </span>
        )}

        {estimatedHours !== undefined && (
          <span className="text-xs bg-white/10 text-neutral-300 px-2 py-0.5 rounded-full">
            {estimatedHours}h
          </span>
        )}

        {revisionsIncluded !== undefined && (
          <span className="text-xs bg-white/10 text-neutral-300 px-2 py-0.5 rounded-full">
            {revisionsIncluded} rev.
          </span>
        )}

        {timesRequested !== undefined && timesRequested > 0 && (
          <span className="inline-flex items-center gap-1 text-xs bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-full ml-auto">
            <Flame size={12} className="text-pistache-solar" />
            {timesRequested}x
          </span>
        )}
      </div>
    </BaseCard>
  );
}


