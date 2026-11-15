import { CircleAlert } from "lucide-react";
import { BaseCard } from "../cards/BaseCard";
import { LineDivision } from "../division/LineDivision";
import { CloseButton, SendButton } from "../buttons/Buttons";
import { Input } from "../inputs/Input";
import React, { useState } from "react";
import { type QuoteRequest } from "../../types/budget";
import {
  calculateFinalPrice,
  validateQuoteRequest,
} from "../../services/quoteCalculator";
import {
  getStoredSettings,
  getCalculatedBaseHourlyCost,
} from "../../services/crmStorage";

interface BudgetFormProps {
  onSave?: (quote: QuoteRequest, finalPrice: number) => void;
  onClose?: () => void;
}

function getInitialFormData(): QuoteRequest {
  const settings = getStoredSettings();
  const baseHourly = getCalculatedBaseHourlyCost(settings);

  return {
    name: "",
    description: "",
    hourlyCost: baseHourly,
    profitMargin: settings.defaultProfitMargin,
    estimatedHours: 10,
    revisionsIncluded: settings.defaultRevisionsIncluded,
    complexity: "média",
    urgency: "normal",
    variableCost: 0,
    locality: settings.defaultLocality,
    clientSegment: "pessoa-física",
  };
}

const NUMERIC_FIELDS = new Set([
  "hourlyCost",
  "profitMargin",
  "estimatedHours",
  "revisionsIncluded",
  "variableCost",
]);

export function BudgetForm({ onSave, onClose }: BudgetFormProps) {
  const [formData, setFormData] = useState<QuoteRequest>(() =>
    getInitialFormData(),
  );
  const [errors, setErrors] = useState<string[]>([]);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: NUMERIC_FIELDS.has(name) ? (value === "" ? 0 : Number(value)) : value,
    }));
    if (errors.length > 0) {
      setErrors([]);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateQuoteRequest(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const finalPrice = calculateFinalPrice(formData);
    onSave?.(formData, finalPrice);
    setFormData(getInitialFormData());
    setErrors([]);
  }

  const previewPrice = calculateFinalPrice(formData);

  return (
    <BaseCard
      className="max-w-sm w-full"
      title="Novo Serviço"
      headerBg="bg-neutral-700"
      headerText="text-pistache-solar"
      minHeight="h-auto"
      rightAction={<CloseButton onClose={onClose} aria-label="Fechar formulário" />}
    >
      <form
        aria-label="Formulário de novo serviço"
        onSubmit={handleSubmit}
        className="max-h-[80vh] overflow-y-auto solo-card-scroll pr-1"
      >
        <fieldset className="flex flex-col gap-2">
          <legend className="sr-only">Dados do novo serviço</legend>

          <Input
            id="name"
            name="name"
            type="text"
            label="Nome do serviço"
            autoComplete="off"
            placeholder="Nome do serviço"
            required={true}
            value={formData.name}
            onChange={handleChange}
          />

          <div>
            <label htmlFor="description" className="sr-only">
              Descrição do serviço
            </label>
            <div className="flex items-center bg-neutral-500/30 h-20 px-4 py-2 rounded-3xl w-full">
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descrição do que está incluso."
                className="text-pistache-solar outline-none bg-transparent w-full resize-none"
              />
            </div>
          </div>

          <LineDivision />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="hourlyCost"
                className="text-neutral-50 text-sm"
              >
                Custo/hora base
              </label>
              <div className="flex items-center gap-2 bg-neutral-500/30 h-10 px-4 rounded-full w-full">
                <span
                  className="text-pistache-solar text-sm"
                  aria-hidden="true"
                >
                  R$
                </span>
                <input
                  id="hourlyCost"
                  name="hourlyCost"
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  value={formData.hourlyCost || ""}
                  onChange={handleChange}
                  aria-describedby="baseCostHint"
                  className="text-pistache-solar outline-none bg-transparent w-full"
                />
              </div>
            </div>
            <div>
              <label htmlFor="profitMargin" className="text-neutral-50 text-sm">
                Margem de lucro
              </label>
              <div className="flex items-center gap-2 bg-neutral-500/30 h-10 px-4 rounded-full w-full">
                <input
                  id="profitMargin"
                  name="profitMargin"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  inputMode="decimal"
                  value={formData.profitMargin || ""}
                  onChange={handleChange}
                  className="text-pistache-solar outline-none bg-transparent w-full"
                />
                <span
                  className="text-pistache-solar text-sm"
                  aria-hidden="true"
                >
                  %
                </span>
              </div>
            </div>
          </div>

          <p id="baseCostHint" className="text-neutral-400">
            <small>
              Base: R$ 1.500,00/mês ÷ 140h produtivas. Ajuste isso na tela de
              custos fixos.
            </small>
          </p>

          <LineDivision />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="estimatedHours"
                className="text-neutral-50 text-sm"
              >
                Horas estimadas
              </label>
              <div className="flex items-center gap-2 bg-neutral-500/30 h-10 px-4 rounded-full w-full">
                <input
                  id="estimatedHours"
                  name="estimatedHours"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  value={formData.estimatedHours || ""}
                  onChange={handleChange}
                  className="text-pistache-solar outline-none bg-transparent w-full"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="revisionsIncluded"
                className="text-neutral-50 text-sm"
              >
                Revisões incluídas
              </label>
              <div className="flex items-center gap-2 bg-neutral-500/30 h-10 px-4 rounded-full w-full">
                <input
                  id="revisionsIncluded"
                  name="revisionsIncluded"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  value={formData.revisionsIncluded}
                  onChange={handleChange}
                  className="text-pistache-solar outline-none bg-transparent w-full"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label htmlFor="complexity" className="text-neutral-50 text-sm">
                Complexidade
              </label>
              <div className="flex items-center gap-2 bg-neutral-500/30 h-10 px-2 rounded-full w-full">
                <select
                  id="complexity"
                  name="complexity"
                  value={formData.complexity}
                  onChange={handleChange}
                  className="text-pistache-solar outline-none bg-transparent w-full"
                >
                  <option value="baixa" className="bg-neutral-800">
                    Baixa (1x)
                  </option>
                  <option value="média" className="bg-neutral-800">
                    Média (1.15x)
                  </option>
                  <option value="alta" className="bg-neutral-800">
                    Alta (1.35x)
                  </option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="urgency" className="text-neutral-50 text-sm">
                Urgência
              </label>
              <div className="flex items-center gap-2 bg-neutral-500/30 h-10 px-2 rounded-full w-full">
                <select
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="text-pistache-solar outline-none bg-transparent w-full"
                >
                  <option value="normal" className="bg-neutral-800">
                    Normal (1x)
                  </option>
                  <option value="urgente" className="bg-neutral-800">
                    Urgente (1.3x)
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div className="w-full">
            <label htmlFor="variableCost" className="text-neutral-50 text-sm">
              Custos variáveis (materiais, terceiros)
            </label>
            <div className="flex items-center gap-2 bg-neutral-500/30 h-10 px-4 rounded-full w-full">
              <span className="text-pistache-solar text-sm" aria-hidden="true">
                R$
              </span>
              <input
                id="variableCost"
                name="variableCost"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={formData.variableCost}
                onChange={handleChange}
                className="text-pistache-solar outline-none bg-transparent w-full"
              />
            </div>
          </div>

          <LineDivision />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label htmlFor="locality" className="text-neutral-50 text-sm">
                Localidade
              </label>
              <div className="flex items-center gap-2 bg-neutral-500/30 h-10 px-2 rounded-full w-full">
                <select
                  id="locality"
                  name="locality"
                  value={formData.locality}
                  onChange={handleChange}
                  className="text-pistache-solar outline-none bg-transparent w-full"
                >
                  <option value="São Paulo" className="bg-neutral-800">
                    São Paulo / Capital
                  </option>
                  <option value="Interior" className="bg-neutral-800">
                    Interior / Regional
                  </option>
                  <option value="Remoto Nacional" className="bg-neutral-800">
                    Remoto Nacional
                  </option>
                  <option value="Internacional" className="bg-neutral-800">
                    Internacional
                  </option>
                </select>
              </div>
            </div>
            <div>
              <label
                htmlFor="clientSegment"
                className="text-neutral-50 text-sm"
              >
                Segmento do cliente
              </label>
              <div className="flex items-center gap-2 bg-neutral-500/30 h-10 px-2 rounded-full w-full">
                <select
                  id="clientSegment"
                  name="clientSegment"
                  value={formData.clientSegment}
                  onChange={handleChange}
                  className="text-pistache-solar outline-none bg-transparent w-full"
                >
                  <option value="pessoa-física" className="bg-neutral-800">
                    Pessoa Física (1x)
                  </option>
                  <option value="pequena-empresa" className="bg-neutral-800">
                    Pequena Empresa (1.1x)
                  </option>
                  <option value="grande-empresa" className="bg-neutral-800">
                    Grande Empresa (1.25x)
                  </option>
                </select>
              </div>
            </div>
          </div>

          {errors.length > 0 && (
            <ul className="text-xs text-red-300 bg-red-950/60 border border-red-500/30 rounded-xl p-2 space-y-1">
              {errors.map((err) => (
                <li key={err} className="flex items-center gap-1.5">
                  <CircleAlert size={13} className="shrink-0" />
                  <span>{err}</span>
                </li>
              ))}
            </ul>
          )}

          <LineDivision />

          <div className="flex items-center justify-between px-2">
            <div>
              <span className="text-xs text-neutral-400 block">
                Valor sugerido
              </span>
              <strong className="text-lg text-pistache-solar font-sora">
                R${" "}
                {previewPrice.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
            </div>
            <SendButton aria-label="Enviar novo serviço" />
          </div>
        </fieldset>
      </form>
    </BaseCard>
  );
}

