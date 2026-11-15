import { type QuoteRequest } from "../types/budget";
import {
  URGENCY_MULTIPLIERS,
  COMPLEXITY_MULTIPLIERS,
  CLIENT_SEGMENT_MULTIPLIERS,
  EXTRA_REVISION_RATE,
} from "../services/quoteConfig";
import { getStoredSettings } from "./crmStorage";

// CALCULA URGÊNCIA E RETORNA MULTIPLICADOR
export function calculateUrgencyMultiplier(
  urgency: QuoteRequest["urgency"],
): number {
  const settings = getStoredSettings();
  if (urgency === "urgente") {
    return settings.urgencyUrgentMultiplier || URGENCY_MULTIPLIERS.urgente;
  }
  return URGENCY_MULTIPLIERS.normal;
}

// CALCULA COMPLEXIDADE E RETORNA MULTIPLICADOR
export function calculateComplexityMultiplier(
  complexity: QuoteRequest["complexity"],
): number {
  const settings = getStoredSettings();
  if (complexity === "média") {
    return settings.complexityMediumMultiplier || COMPLEXITY_MULTIPLIERS.média;
  }
  if (complexity === "alta") {
    return settings.complexityHighMultiplier || COMPLEXITY_MULTIPLIERS.alta;
  }
  return COMPLEXITY_MULTIPLIERS.baixa;
}

// CALCULA SEGMENTO DO CLIENTE E RETORNA MULTIPLICADOR
export function calculateClientSegmentMultiplier(
  clientSegment: QuoteRequest["clientSegment"],
): number {
  const settings = getStoredSettings();
  if (clientSegment === "pequena-empresa") {
    return (
      settings.segmentSmallBizMultiplier ||
      CLIENT_SEGMENT_MULTIPLIERS["pequena-empresa"]
    );
  }
  if (clientSegment === "grande-empresa") {
    return (
      settings.segmentLargeBizMultiplier ||
      CLIENT_SEGMENT_MULTIPLIERS["grande-empresa"]
    );
  }
  return CLIENT_SEGMENT_MULTIPLIERS["pessoa-física"];
}

// VALIDAÇÃO E TRATAMENTO DE ERROS
export function validateQuoteRequest(quote: QuoteRequest): string[] {
  const errors: string[] = [];

  if (!quote.name.trim()) {
    errors.push("Nome do serviço é obrigatório.");
  }
  if (quote.hourlyCost <= 0)
    errors.push("Custo por hora precisa ser maior que 0.");
  if (quote.estimatedHours <= 0)
    errors.push("Horas estimadas precisam ser maior que 0.");
  if (quote.profitMargin < 0 || quote.profitMargin > 100)
    errors.push("Margem de lucro precisa estar entre 0 e 100.");
  if (quote.variableCost < 0)
    errors.push("Custo variável não pode ser valor negativo.");
  if (quote.revisionsIncluded < 0)
    errors.push("Número de revisões não pode ser negativo.");

  return errors;
}

// CALCULA O VALOR FINAL
export function calculateFinalPrice(quote: QuoteRequest): number {
  const settings = getStoredSettings();
  const baseValue = Number(quote.hourlyCost) * Number(quote.estimatedHours);
  const urgencyMultiplier = calculateUrgencyMultiplier(quote.urgency);
  const complexityMultiplier = calculateComplexityMultiplier(quote.complexity);
  const segmentMultiplier = calculateClientSegmentMultiplier(
    quote.clientSegment,
  );

  // Revisões além da 1ª adicionam percentual de esforço sobre a base
  const extraRevisions = Math.max(0, Number(quote.revisionsIncluded) - 1);
  const revisionRate =
    settings.extraRevisionRatePercent !== undefined
      ? settings.extraRevisionRatePercent / 100
      : EXTRA_REVISION_RATE;
  const revisionMultiplier = 1 + extraRevisions * revisionRate;

  const adjustedBase =
    baseValue *
    urgencyMultiplier *
    complexityMultiplier *
    segmentMultiplier *
    revisionMultiplier;

  const valueWithMargin =
    adjustedBase + adjustedBase * (Number(quote.profitMargin) / 100);
  const total = valueWithMargin + Number(quote.variableCost);

  return total;
}
