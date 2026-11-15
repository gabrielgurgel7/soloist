export const URGENCY_MULTIPLIERS = {
  normal: 1,
  urgente: 1.3,
} as const;

export const COMPLEXITY_MULTIPLIERS = {
  baixa: 1,
  média: 1.15,
  alta: 1.35,
} as const;

export const CLIENT_SEGMENT_MULTIPLIERS = {
  "pessoa-física": 1,
  "pequena-empresa": 1.1,
  "grande-empresa": 1.25,
} as const;

export const EXTRA_REVISION_RATE = 0.05; // 5% sobre o valor base por revisão incluída além da 1ª

