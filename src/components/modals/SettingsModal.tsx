import { useState, type ReactNode } from "react";
import {
  Search,
  UserRound,
  Clock,
  Calculator,
  Kanban,
  HardDrive,
  Building2,
  Mail,
  MapPin,
  CalendarClock,
  Wallet,
  Percent,
  Zap,
  Layers,
  RefreshCw,
  Award,
  Download,
  RotateCcw,
  Sun,
  Moon,
  Sparkles,
  Check,
  type LucideIcon,
} from "lucide-react";
import { BaseCard } from "../cards/BaseCard";
import { LineDivision } from "../division/LineDivision";
import { CloseButton, SendButton } from "../buttons/Buttons";
import type { ProjectStatus } from "../cards/ProjectCard";
import {
  type SoloistAppSettings,
  getStoredSettings,
  saveStoredSettings,
  getCalculatedBaseHourlyCost,
  getStoredServices,
  getStoredCombos,
  getStoredClients,
  getStoredProjects,
  resetAllCrmData,
} from "../../services/crmStorage";
import { useBrazilCities } from "../../services/brazilCities";

interface SettingsModalProps {
  onClose: () => void;
}

type SettingsTabId =
  | "geral"
  | "custos"
  | "multiplicadores"
  | "crm"
  | "dados";

interface SettingsCategory {
  id: SettingsTabId;
  label: string;
  title: string;
  description: string;
  keywords: string[];
  icon: LucideIcon;
}

const CATEGORIES: SettingsCategory[] = [
  {
    id: "geral",
    label: "Geral & Tema",
    title: "Geral, Tema & Perfil",
    description:
      "Escolha entre o tema Claro ou Escuro e configure seus dados principais exibidos na tela inicial e nos orçamentos.",
    keywords: [
      "tema",
      "claro",
      "escuro",
      "aparência",
      "nome",
      "estúdio",
      "email",
      "localidade",
      "geral",
    ],
    icon: UserRound,
  },
  {
    id: "custos",
    label: "Hora Técnica",
    title: "Hora Técnica & Custos",
    description:
      "Defina seus custos fixos mensais, meta salarial e horas produtivas para calcular automaticamente seu custo/hora base.",
    keywords: [
      "custo",
      "hora",
      "salário",
      "fixo",
      "margem",
      "lucro",
      "desconto",
      "combo",
    ],
    icon: Clock,
  },
  {
    id: "multiplicadores",
    label: "Multiplicadores",
    title: "Multiplicadores de Orçamento",
    description:
      "Ajuste os fatores de urgência, complexidade, porte do cliente e revisões extras aplicados no cálculo de preço.",
    keywords: [
      "urgência",
      "complexidade",
      "porte",
      "segmento",
      "empresa",
      "revisão",
      "multiplicador",
    ],
    icon: Calculator,
  },
  {
    id: "crm",
    label: "Kanban & CRM",
    title: "Kanban & Automação de Clientes",
    description:
      "Configure o status padrão de novos projetos e a classificação automática de Ticket ao aprovar orçamentos.",
    keywords: ["kanban", "projeto", "status", "cliente", "ticket", "premium"],
    icon: Kanban,
  },
  {
    id: "dados",
    label: "Armazenamento",
    title: "Backup & Dados do Sistema",
    description:
      "Exporte seus dados salvos em formato JSON ou restaure o sistema para os valores iniciais de demonstração.",
    keywords: ["backup", "exportar", "resetar", "armazenamento", "dados"],
    icon: HardDrive,
  },
];

interface SettingPillRowProps {
  icon: LucideIcon;
  label: string;
  hint?: string;
  children: ReactNode;
}

/**
 * Linha de ajuste que segue exatamente a identidade de InputEmail / InputPassword do LoginForm:
 * círculo `bg-neutral-300 h-10 w-10 rounded-full` à esquerda dentro da barra `bg-neutral-500/30 rounded-full`
 */
function SettingPillRow({ icon: Icon, label, hint, children }: SettingPillRowProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5 px-2">
        <span className="text-neutral-50 text-xs font-medium">{label}</span>
        {hint && <small className="text-neutral-400 text-[11px]">{hint}</small>}
      </div>
      <div className="flex items-center gap-2 bg-neutral-500/30 h-10 pr-3 rounded-full w-full">
        <div className="flex items-center justify-center bg-neutral-300 text-neutral-900 h-10 w-10 rounded-full shrink-0">
          <Icon size={18} />
        </div>
        <div className="flex items-center justify-between flex-1 min-w-0 gap-2">
          {children}
        </div>
      </div>
    </div>
  );
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [settings, setSettings] = useState<SoloistAppSettings>(() =>
    getStoredSettings(),
  );
  const [activeTab, setActiveTab] = useState<SettingsTabId>("geral");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);
  const { cities, states, specialLocalities, isLoading: isLoadingCities } =
    useBrazilCities();
  const [selectedUfFilter, setSelectedUfFilter] = useState<string>(() => {
    const current = getStoredSettings().defaultLocality;
    const parts = current.split(" - ");
    if (parts.length === 2 && parts[1].length === 2) {
      return parts[1];
    }
    return "SP";
  });
  const [citySearchFilter, setCitySearchFilter] = useState<string>("");

  const filteredCitiesForSelect = cities.filter((city) => {
    const matchesUf =
      selectedUfFilter === "TODAS" ? true : city.uf === selectedUfFilter;
    const matchesQuery = citySearchFilter.trim()
      ? city.label.toLowerCase().includes(citySearchFilter.trim().toLowerCase())
      : true;
    return matchesUf && matchesQuery;
  });

  const activeCategory =
    CATEGORIES.find((cat) => cat.id === activeTab) ?? CATEGORIES[0];
  const ActiveIcon = activeCategory.icon;
  const calculatedHourly = getCalculatedBaseHourlyCost(settings);

  const servicesCount = getStoredServices().length;
  const combosCount = getStoredCombos().length;
  const clientsCount = getStoredClients().length;
  const projectsCount = getStoredProjects().length;

  function updateSetting<K extends keyof SoloistAppSettings>(
    key: K,
    value: SoloistAppSettings[K],
  ) {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    saveStoredSettings(updated);
  }

  function handleSaveForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveStoredSettings(settings);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  }

  function handleExportBackup() {
    const backup = {
      exportedAt: new Date().toISOString(),
      settings: getStoredSettings(),
      services: getStoredServices(),
      combos: getStoredCombos(),
      clients: getStoredClients(),
      projects: getStoredProjects(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "soloist-backup.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleResetDemoData() {
    resetAllCrmData();
    setSettings(getStoredSettings());
    window.location.reload();
  }

  const filteredCategories = searchQuery.trim()
    ? CATEGORIES.filter((cat) => {
        const q = searchQuery.toLowerCase();
        return (
          cat.label.toLowerCase().includes(q) ||
          cat.title.toLowerCase().includes(q) ||
          cat.keywords.some((k) => k.toLowerCase().includes(q))
        );
      })
    : CATEGORIES;

  const initials = settings.userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <BaseCard
      className="max-w-3xl w-full"
      title="Ajustes"
      headerBg="bg-neutral-700"
      headerText="text-pistache-solar"
      minHeight="h-auto"
      rightAction={<CloseButton onClose={onClose} />}
    >
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-1.5 sm:p-2 sm:min-h-120 max-h-[82vh] overflow-hidden">
        {/* BARRA LATERAL ESQUERDA (COM A MESMA IDENTIDADE DO LOGIN FORM) */}
        <aside className="w-full sm:w-56 flex flex-col gap-2 sm:gap-3 sm:border-r border-white/10 sm:pr-4 shrink-0">
          {/* Busca estilo InputEmail */}
          <div className="flex items-center gap-2 bg-neutral-500/30 h-9 sm:h-10 pr-3 rounded-full w-full">
            <div className="flex items-center justify-center bg-neutral-300 text-neutral-900 h-9 w-9 sm:h-10 sm:w-10 rounded-full shrink-0">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                const match = CATEGORIES.find((c) =>
                  c.keywords.some((k) =>
                    k.toLowerCase().includes(e.target.value.toLowerCase()),
                  ),
                );
                if (match && e.target.value.trim()) {
                  setActiveTab(match.id);
                }
              }}
              placeholder="Buscar nos ajustes..."
              className="text-pistache-solar outline-none bg-transparent w-full text-xs"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
            {/* Perfil do Usuário na Barra Lateral */}
            <button
              type="button"
              onClick={() => setActiveTab("geral")}
              className="flex items-center gap-2 bg-neutral-500/30 hover:bg-neutral-500/45 h-10 sm:h-12 pr-2.5 sm:pr-3 rounded-full w-full text-left transition-colors cursor-pointer min-w-0"
            >
              <div className="flex items-center justify-center bg-pistache-solar text-neutral-900 font-sora font-bold text-xs h-10 w-10 sm:h-12 sm:w-12 rounded-full shrink-0">
                {initials || "G"}
              </div>
              <div className="min-w-0">
                <p className="text-neutral-50 text-xs font-bold truncate">
                  {settings.userName || "Gabriel Gurgel"}
                </p>
                <small className="text-neutral-400 text-[10px] sm:text-[11px] block truncate">
                  {settings.studioName || "Conta Soloist"}
                </small>
              </div>
            </button>

            <div className="hidden sm:block">
              <LineDivision />
            </div>

            {/* Chave Toggle de Modo (Claro / Escuro) na Barra Lateral */}
            <div className="flex items-center justify-between bg-neutral-500/30 h-10 px-2.5 sm:px-3 rounded-full w-full">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                {settings.theme === "light" ? (
                  <Sun size={14} className="text-pistache-solar shrink-0" />
                ) : (
                  <Moon size={14} className="text-pistache-solar shrink-0" />
                )}
                <span className="text-neutral-50 text-[11px] sm:text-xs font-medium truncate">
                  {settings.theme === "light" ? "Claro" : "Escuro"}
                </span>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={settings.theme === "light"}
                aria-label="Alternar entre modo claro e escuro"
                onClick={() =>
                  updateSetting(
                    "theme",
                    settings.theme === "light" ? "dark" : "light",
                  )
                }
                className={[
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-300",
                  settings.theme === "light"
                    ? "bg-pistache-solar"
                    : "bg-neutral-700 border border-white/15",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-5 w-5 items-center justify-center rounded-full shadow-md transition-transform duration-300",
                    settings.theme === "light"
                      ? "translate-x-5 bg-neutral-900 text-pistache-solar"
                      : "translate-x-0 bg-pistache-solar text-neutral-900",
                  ].join(" ")}
                >
                  {settings.theme === "light" ? (
                    <Sun size={11} />
                  ) : (
                    <Moon size={11} />
                  )}
                </span>
              </button>
            </div>
          </div>

          <LineDivision />

          {/* Menu de Categorias (Pílulas horizontais no Mobile / Lista Vertical no Desktop) */}
          <nav className="flex sm:flex-col gap-1.5 overflow-x-auto sm:overflow-y-auto pb-1 sm:pb-0">
            {filteredCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveTab(cat.id)}
                  className={[
                    "flex items-center gap-2 sm:gap-2.5 h-9 pr-3 rounded-full w-auto sm:w-full text-xs transition-colors cursor-pointer shrink-0",
                    isActive
                      ? "bg-neutral-500 text-pistache-solar font-bold"
                      : "text-neutral-50 border border-neutral-500/60 hover:bg-neutral-500/40",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "flex items-center justify-center h-9 w-9 rounded-full shrink-0",
                      isActive
                        ? "bg-pistache-solar text-neutral-900"
                        : "bg-neutral-300 text-neutral-900",
                    ].join(" ")}
                  >
                    <Icon size={15} />
                  </div>
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* PAINEL PRINCIPAL DIREITO (FLUXO VERTICAL ÚNICO, SEM COLUNAS) */}
        <form
          onSubmit={handleSaveForm}
          className="flex-1 flex flex-col justify-between gap-4 overflow-y-auto pr-1 solo-card-scroll max-h-none"
        >
          <fieldset className="flex flex-col gap-3">
            {/* Cabeçalho Central da Categoria Ativa (Inspirado no Ajuste da Apple com visual LoginForm) */}
            <div className="flex flex-col items-center text-center gap-1.5 bg-neutral-500/20 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-center bg-neutral-300 text-neutral-900 h-11 w-11 rounded-full shadow-sm">
                <ActiveIcon size={22} />
              </div>
              <h4 className="text-base font-bold text-pistache-solar font-sora">
                {activeCategory.title}
              </h4>
              <small className="text-neutral-300 max-w-md leading-relaxed">
                {activeCategory.description}
              </small>
            </div>

            <LineDivision />

            {/* ABA 1: GERAL, TEMA & PERFIL */}
            {activeTab === "geral" && (
              <div className="flex flex-col gap-3">
                {/* Aparência / Tema do Programa com Chave Toggle */}
                <SettingPillRow
                  icon={settings.theme === "light" ? Sun : Moon}
                  label="Tema do Programa"
                  hint="Alternar entre modo Escuro e Claro"
                >
                  <span className="text-pistache-solar text-sm font-medium">
                    {settings.theme === "light"
                      ? "Tema Claro Ativo"
                      : "Tema Escuro Ativo"}
                  </span>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.theme === "light"}
                    aria-label="Chave seletora de tema claro ou escuro"
                    onClick={() =>
                      updateSetting(
                        "theme",
                        settings.theme === "light" ? "dark" : "light",
                      )
                    }
                    className={[
                      "relative inline-flex h-7 w-13 shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors duration-300",
                      settings.theme === "light"
                        ? "bg-pistache-solar"
                        : "bg-neutral-700 border border-white/15",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex h-5 w-5 items-center justify-center rounded-full shadow-md transition-transform duration-300",
                        settings.theme === "light"
                          ? "translate-x-6 bg-neutral-900 text-pistache-solar"
                          : "translate-x-0 bg-pistache-solar text-neutral-900",
                      ].join(" ")}
                    >
                      {settings.theme === "light" ? (
                        <Sun size={12} />
                      ) : (
                        <Moon size={12} />
                      )}
                    </span>
                  </button>
                </SettingPillRow>

                <LineDivision />

                <SettingPillRow
                  icon={UserRound}
                  label="Seu Nome"
                  hint="Exibido na boas-vindas"
                >
                  <input
                    type="text"
                    value={settings.userName}
                    onChange={(e) => updateSetting("userName", e.target.value)}
                    placeholder="Seu nome"
                    className="text-pistache-solar outline-none bg-transparent w-full text-sm"
                  />
                </SettingPillRow>

                <SettingPillRow
                  icon={Building2}
                  label="Estúdio / Empresa"
                  hint="Identificação comercial"
                >
                  <input
                    type="text"
                    value={settings.studioName}
                    onChange={(e) =>
                      updateSetting("studioName", e.target.value)
                    }
                    placeholder="Nome do estúdio"
                    className="text-pistache-solar outline-none bg-transparent w-full text-sm"
                  />
                </SettingPillRow>

                <SettingPillRow
                  icon={Mail}
                  label="Seu E-mail"
                  hint="Contato principal"
                >
                  <input
                    type="email"
                    value={settings.userEmail}
                    onChange={(e) => updateSetting("userEmail", e.target.value)}
                    placeholder="Seu e-mail"
                    className="text-pistache-solar outline-none bg-transparent w-full text-sm"
                  />
                </SettingPillRow>

                <SettingPillRow
                  icon={MapPin}
                  label="Localidade Padrão (Cidades do Brasil - IBGE)"
                  hint={
                    isLoadingCities
                      ? "Carregando municípios do IBGE..."
                      : `${cities.length.toLocaleString("pt-BR")} cidades disponíveis`
                  }
                >
                  <select
                    aria-label="Filtrar estado (UF)"
                    value={selectedUfFilter}
                    onChange={(e) => {
                      const nextUf = e.target.value;
                      setSelectedUfFilter(nextUf);
                      if (nextUf !== "TODAS") {
                        const firstInState = cities.find(
                          (c) => c.uf === nextUf,
                        );
                        if (firstInState) {
                          updateSetting("defaultLocality", firstInState.label);
                        }
                      }
                    }}
                    className="text-neutral-900 bg-pistache-solar font-bold text-xs px-2 py-1 rounded-full outline-none cursor-pointer shrink-0"
                  >
                    <option value="TODAS" className="bg-neutral-800 text-amber-50">
                      Todas UFs
                    </option>
                    {states.map((st) => (
                      <option
                        key={st.uf}
                        value={st.uf}
                        className="bg-neutral-800 text-amber-50"
                      >
                        {st.uf} - {st.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={citySearchFilter}
                    onChange={(e) => setCitySearchFilter(e.target.value)}
                    placeholder="Filtrar cidade..."
                    aria-label="Filtrar cidade pelo nome"
                    className="hidden sm:block text-neutral-200 outline-none bg-neutral-900/40 border border-white/10 px-2.5 py-1 rounded-full w-32 text-xs shrink-0"
                  />

                  <select
                    aria-label="Selecionar cidade padrão"
                    value={settings.defaultLocality}
                    onChange={(e) =>
                      updateSetting("defaultLocality", e.target.value)
                    }
                    className="text-pistache-solar outline-none bg-transparent w-full text-sm truncate cursor-pointer"
                  >
                    {!filteredCitiesForSelect.some(
                      (c) => c.label === settings.defaultLocality,
                    ) &&
                      !specialLocalities.some(
                        (s) =>
                          s.label === settings.defaultLocality ||
                          s.name === settings.defaultLocality,
                      ) && (
                        <option
                          value={settings.defaultLocality}
                          className="bg-neutral-800"
                        >
                          {settings.defaultLocality}
                        </option>
                      )}

                    <optgroup
                      label={
                        selectedUfFilter === "TODAS"
                          ? "Municípios do Brasil (IBGE)"
                          : `Municípios de ${selectedUfFilter} (${filteredCitiesForSelect.length})`
                      }
                      className="bg-neutral-800 text-pistache-solar"
                    >
                      {(selectedUfFilter === "TODAS" && !citySearchFilter.trim()
                        ? filteredCitiesForSelect.slice(0, 400)
                        : filteredCitiesForSelect
                      ).map((city) => (
                        <option
                          key={city.label}
                          value={city.label}
                          className="bg-neutral-800 text-neutral-100"
                        >
                          {city.label}
                        </option>
                      ))}
                    </optgroup>

                    <optgroup
                      label="Modalidades Globais"
                      className="bg-neutral-800 text-pistache-solar"
                    >
                      {specialLocalities.map((spec) => (
                        <option
                          key={spec.label}
                          value={spec.name}
                          className="bg-neutral-800 text-neutral-100"
                        >
                          {spec.label}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </SettingPillRow>

                <SettingPillRow
                  icon={CalendarClock}
                  label="Validade dos Orçamentos"
                  hint="Em dias corridos"
                >
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={settings.proposalValidityDays}
                    onChange={(e) =>
                      updateSetting(
                        "proposalValidityDays",
                        Number(e.target.value) || 1,
                      )
                    }
                    className="text-pistache-solar outline-none bg-transparent w-full text-sm"
                  />
                  <span className="text-pistache-solar text-xs shrink-0">
                    dias
                  </span>
                </SettingPillRow>
              </div>
            )}

            {/* ABA 2: HORA TÉCNICA & CUSTOS */}
            {activeTab === "custos" && (
              <div className="flex flex-col gap-3">
                <SettingPillRow
                  icon={Wallet}
                  label="Custos Fixos Mensais (R$)"
                  hint="Internet, luz, softwares, contador"
                >
                  <span className="text-pistache-solar text-xs">R$</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={settings.monthlyFixedCosts}
                    onChange={(e) =>
                      updateSetting(
                        "monthlyFixedCosts",
                        Number(e.target.value) || 0,
                      )
                    }
                    className="text-pistache-solar outline-none bg-transparent w-full text-sm"
                  />
                </SettingPillRow>

                <SettingPillRow
                  icon={Sparkles}
                  label="Meta Salarial / Pró-labore (R$)"
                  hint="Ganho mensal desejado"
                >
                  <span className="text-pistache-solar text-xs">R$</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={settings.desiredMonthlySalary}
                    onChange={(e) =>
                      updateSetting(
                        "desiredMonthlySalary",
                        Number(e.target.value) || 0,
                      )
                    }
                    className="text-pistache-solar outline-none bg-transparent w-full text-sm"
                  />
                </SettingPillRow>

                <SettingPillRow
                  icon={Clock}
                  label="Horas Produtivas por Mês"
                  hint="Ex: 7h/dia × 20 dias = 140h"
                >
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={settings.productiveHoursPerMonth}
                    onChange={(e) =>
                      updateSetting(
                        "productiveHoursPerMonth",
                        Math.max(1, Number(e.target.value) || 1),
                      )
                    }
                    className="text-pistache-solar outline-none bg-transparent w-full text-sm"
                  />
                  <span className="text-pistache-solar text-xs shrink-0">
                    horas/mês
                  </span>
                </SettingPillRow>

                <SettingPillRow
                  icon={Percent}
                  label="Margem de Lucro Padrão (%)"
                  hint="Pré-preenchida em Novo Serviço"
                >
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.defaultProfitMargin}
                    onChange={(e) =>
                      updateSetting(
                        "defaultProfitMargin",
                        Number(e.target.value) || 0,
                      )
                    }
                    className="text-pistache-solar outline-none bg-transparent w-full text-sm"
                  />
                  <span className="text-pistache-solar text-xs shrink-0">
                    %
                  </span>
                </SettingPillRow>

                <SettingPillRow
                  icon={Layers}
                  label="Desconto Padrão para Combos (%)"
                  hint="Aplicado no Carrinho de Orçamento"
                >
                  <input
                    type="number"
                    min="0"
                    max="80"
                    value={settings.defaultComboDiscount}
                    onChange={(e) =>
                      updateSetting(
                        "defaultComboDiscount",
                        Number(e.target.value) || 0,
                      )
                    }
                    className="text-pistache-solar outline-none bg-transparent w-full text-sm"
                  />
                  <span className="text-pistache-solar text-xs shrink-0">
                    %
                  </span>
                </SettingPillRow>
              </div>
            )}

            {/* ABA 3: MULTIPLICADORES DE PREÇO */}
            {activeTab === "multiplicadores" && (
              <div className="flex flex-col gap-3">
                <SettingPillRow
                  icon={Zap}
                  label="Multiplicador de Urgência"
                  hint="Para demandas urgentes (ex: 1.3x)"
                >
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.05"
                    value={settings.urgencyUrgentMultiplier}
                    onChange={(e) =>
                      updateSetting(
                        "urgencyUrgentMultiplier",
                        Number(e.target.value) || 1,
                      )
                    }
                    className="text-pistache-solar outline-none bg-transparent w-full text-sm"
                  />
                  <span className="text-pistache-solar text-xs shrink-0">
                    x
                  </span>
                </SettingPillRow>

                <SettingPillRow
                  icon={Calculator}
                  label="Complexidade Média"
                  hint="Projetos intermediários (ex: 1.15x)"
                >
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.05"
                    value={settings.complexityMediumMultiplier}
                    onChange={(e) =>
                      updateSetting(
                        "complexityMediumMultiplier",
                        Number(e.target.value) || 1,
                      )
                    }
                    className="text-pistache-solar outline-none bg-transparent w-full text-sm"
                  />
                  <span className="text-pistache-solar text-xs shrink-0">
                    x
                  </span>
                </SettingPillRow>

                <SettingPillRow
                  icon={Calculator}
                  label="Complexidade Alta"
                  hint="Projetos avançados (ex: 1.35x)"
                >
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.05"
                    value={settings.complexityHighMultiplier}
                    onChange={(e) =>
                      updateSetting(
                        "complexityHighMultiplier",
                        Number(e.target.value) || 1,
                      )
                    }
                    className="text-pistache-solar outline-none bg-transparent w-full text-sm"
                  />
                  <span className="text-pistache-solar text-xs shrink-0">
                    x
                  </span>
                </SettingPillRow>

                <SettingPillRow
                  icon={Building2}
                  label="Porte: Pequena Empresa"
                  hint="Pessoa Física = 1.0x"
                >
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.05"
                    value={settings.segmentSmallBizMultiplier}
                    onChange={(e) =>
                      updateSetting(
                        "segmentSmallBizMultiplier",
                        Number(e.target.value) || 1,
                      )
                    }
                    className="text-pistache-solar outline-none bg-transparent w-full text-sm"
                  />
                  <span className="text-pistache-solar text-xs shrink-0">
                    x
                  </span>
                </SettingPillRow>

                <SettingPillRow
                  icon={Building2}
                  label="Porte: Grande Empresa"
                  hint="Corporativo (ex: 1.25x)"
                >
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.05"
                    value={settings.segmentLargeBizMultiplier}
                    onChange={(e) =>
                      updateSetting(
                        "segmentLargeBizMultiplier",
                        Number(e.target.value) || 1,
                      )
                    }
                    className="text-pistache-solar outline-none bg-transparent w-full text-sm"
                  />
                  <span className="text-pistache-solar text-xs shrink-0">
                    x
                  </span>
                </SettingPillRow>

                <SettingPillRow
                  icon={RefreshCw}
                  label="Taxa por Revisão Extra (%)"
                  hint="Acima da 1ª revisão"
                >
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="1"
                    value={settings.extraRevisionRatePercent}
                    onChange={(e) =>
                      updateSetting(
                        "extraRevisionRatePercent",
                        Number(e.target.value) || 0,
                      )
                    }
                    className="text-pistache-solar outline-none bg-transparent w-full text-sm"
                  />
                  <span className="text-pistache-solar text-xs shrink-0">
                    %
                  </span>
                </SettingPillRow>
              </div>
            )}

            {/* ABA 4: KANBAN & CRM */}
            {activeTab === "crm" && (
              <div className="flex flex-col gap-3">
                <SettingPillRow
                  icon={Kanban}
                  label="Status Inicial de Novos Projetos"
                  hint="Ao fechar orçamento"
                >
                  <select
                    value={settings.defaultProjectStatus}
                    onChange={(e) =>
                      updateSetting(
                        "defaultProjectStatus",
                        e.target.value as ProjectStatus,
                      )
                    }
                    className="text-pistache-solar outline-none bg-transparent w-full text-sm"
                  >
                    <option value="Em andamento" className="bg-neutral-800">
                      Em andamento
                    </option>
                    <option value="Pausado" className="bg-neutral-800">
                      Pausado (Aguardando Sinal)
                    </option>
                    <option value="Concluído" className="bg-neutral-800">
                      Concluído
                    </option>
                  </select>
                </SettingPillRow>

                <SettingPillRow
                  icon={RefreshCw}
                  label="Revisões Incluídas por Padrão"
                  hint="Sugerido em novos serviços"
                >
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={settings.defaultRevisionsIncluded}
                    onChange={(e) =>
                      updateSetting(
                        "defaultRevisionsIncluded",
                        Number(e.target.value) || 0,
                      )
                    }
                    className="text-pistache-solar outline-none bg-transparent w-full text-sm"
                  />
                  <span className="text-pistache-solar text-xs shrink-0">
                    revisões
                  </span>
                </SettingPillRow>

                <SettingPillRow
                  icon={Award}
                  label="Valor de Corte para Ticket Premium"
                  hint="Promove o cliente automaticamente"
                >
                  <span className="text-pistache-solar text-xs">R$</span>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    value={settings.premiumTicketThreshold}
                    onChange={(e) =>
                      updateSetting(
                        "premiumTicketThreshold",
                        Number(e.target.value) || 1000,
                      )
                    }
                    className="text-pistache-solar outline-none bg-transparent w-full text-sm"
                  />
                </SettingPillRow>

                <SettingPillRow
                  icon={Sparkles}
                  label="Classificação Automática de Ticket"
                  hint="Baseada no valor do orçamento fechado"
                >
                  <span className="text-pistache-solar text-sm font-medium">
                    {settings.autoClassifyClientTicket ? "Ativada" : "Desativada"}
                  </span>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.autoClassifyClientTicket}
                    onClick={() =>
                      updateSetting(
                        "autoClassifyClientTicket",
                        !settings.autoClassifyClientTicket,
                      )
                    }
                    className={[
                      "relative inline-flex h-7 w-13 shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors duration-300",
                      settings.autoClassifyClientTicket
                        ? "bg-pistache-solar"
                        : "bg-neutral-700 border border-white/15",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "block h-5 w-5 rounded-full shadow-md transition-transform duration-300",
                        settings.autoClassifyClientTicket
                          ? "translate-x-6 bg-neutral-900"
                          : "translate-x-0 bg-pistache-solar",
                      ].join(" ")}
                    />
                  </button>
                </SettingPillRow>
              </div>
            )}

            {/* ABA 5: ARMAZENAMENTO & BACKUP */}
            {activeTab === "dados" && (
              <div className="flex flex-col gap-3">
                <SettingPillRow
                  icon={HardDrive}
                  label="Itens Salvos no Navegador"
                  hint="Sincronização local"
                >
                  <span className="text-pistache-solar text-xs font-semibold truncate">
                    {servicesCount} serviços • {combosCount} combos •{" "}
                    {clientsCount} clientes • {projectsCount} projetos
                  </span>
                </SettingPillRow>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    className="flex items-center justify-center gap-2 text-neutral-50 bg-neutral-500 h-8 w-full rounded-full px-4 hover:bg-neutral-400 transition-colors cursor-pointer text-sm"
                  >
                    <Download size={15} />
                    Exportar Backup Completo (.json)
                  </button>

                  <button
                    type="button"
                    onClick={handleResetDemoData}
                    className="flex items-center justify-center gap-2 text-neutral-50 text-sm border border-neutral-500 h-8 w-full rounded-full px-4 hover:bg-neutral-400 transition-colors cursor-pointer"
                  >
                    <RotateCcw size={15} />
                    Restaurar Dados de Demonstração
                  </button>
                </div>
              </div>
            )}
          </fieldset>

          {/* RODAPÉ DO FORMULÁRIO (IDÊNTICO AO PADRÃO DO LOGIN FORM COM SEND BUTTON) */}
          <div className="flex flex-col gap-3 pt-2">
            <LineDivision />
            <div className="flex items-center justify-between gap-2">
              <small className="text-neutral-400">
                {savedFeedback ? (
                  <span className="inline-flex items-center gap-1 text-pistache-solar font-semibold">
                    <Check size={13} />
                    <span>Ajustes aplicados com sucesso!</span>
                  </span>
                ) : (
                  <>
                    Hora técnica calculada:{" "}
                    <strong className="text-pistache-solar">
                      R${" "}
                      {calculatedHourly.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                      /h
                    </strong>{" "}
                    • Tema:{" "}
                    <strong className="text-pistache-solar">
                      {settings.theme === "light" ? "Claro" : "Escuro"}
                    </strong>
                  </>
                )}
              </small>

              <SendButton />
            </div>
          </div>
        </form>
      </div>
    </BaseCard>
  );
}
