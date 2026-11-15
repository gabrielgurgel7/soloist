export interface QuoteRequest {
  name: string;
  description: string;
  hourlyCost: number;
  profitMargin: number;
  estimatedHours: number;
  revisionsIncluded: number;
  complexity: "baixa" | "média" | "alta";
  urgency: "normal" | "urgente";
  variableCost: number;
  locality: string;
  clientSegment: "pessoa-física" | "pequena-empresa" | "grande-empresa";
}
