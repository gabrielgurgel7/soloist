import type {
  ClientCardProps,
  ClientStatus,
  Ticket,
} from "../components/cards/ClientCard";
import type { Project, ProjectStatus } from "../components/cards/ProjectCard";

export interface StoredClient extends ClientCardProps {
  id: string;
}

export interface CatalogService {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  estimatedHours: number;
  revisionsIncluded: number;
  complexity: "baixa" | "média" | "alta";
  timesRequested: number;
}

export interface ServiceComboHistory {
  id: string;
  comboName: string;
  serviceIds: string[];
  serviceTitles: string[];
  discountPercent: number;
  totalHours: number;
  totalRevisions: number;
  finalPrice: number;
  lastClientName: string;
  createdAt: string;
  timesReused: number;
}

export const STORAGE_KEYS = {
  PROJECTS: "soloist_projects_v1",
  CLIENTS: "soloist_clients_v1",
  SERVICES: "soloist_services_v1",
  COMBOS: "soloist_combos_history_v1",
  SETTINGS: "soloist_app_settings_v1",
  ACTIVITY_LOG: "soloist_activity_log_v1",
  READ_NOTIFICATIONS: "soloist_read_notifications_v1",
  EMAIL_TEMPLATES: "soloist_email_templates_v1",
  EMAIL_HISTORY: "soloist_email_history_v1",
} as const;

export type EmailCategory =
  | "Proposta"
  | "Cobrança"
  | "Onboarding"
  | "Follow-up"
  | "Entrega"
  | "Personalizado";

export type EmailVisualTheme = "soloist-dark" | "clean-light" | "editorial";

export interface SoloistEmailTemplate {
  id: string;
  name: string;
  category: EmailCategory;
  subject: string;
  greeting: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  signature: string;
  visualTheme: EmailVisualTheme;
  updatedAt: string;
}

export interface SoloistSentEmail {
  id: string;
  templateName: string;
  category: EmailCategory;
  recipientName: string;
  recipientEmail: string;
  projectName?: string;
  subject: string;
  renderedBody: string;
  status: "Enviado" | "Rascunho";
  sentAt: string;
}

export type NotificationCategory =
  | "payment"
  | "paused"
  | "prospect"
  | "pricing"
  | "vip"
  | "event";

export interface SoloistNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  actionLabel?: string;
  actionRoute?: "/projects" | "/clients" | "/services" | "/emails";
  projectId?: string;
  isRead: boolean;
}

export interface SoloistAppSettings {
  // Tema (Claro / Escuro)
  theme: "dark" | "light";

  // Perfil & Estúdio
  userName: string;
  studioName: string;
  userEmail: string;
  defaultLocality: string;
  proposalValidityDays: number;

  // Hora Técnica & Custos
  monthlyFixedCosts: number;
  desiredMonthlySalary: number;
  productiveHoursPerMonth: number;
  defaultProfitMargin: number;
  defaultComboDiscount: number;

  // Multiplicadores de Preço
  urgencyUrgentMultiplier: number;
  complexityMediumMultiplier: number;
  complexityHighMultiplier: number;
  segmentSmallBizMultiplier: number;
  segmentLargeBizMultiplier: number;
  extraRevisionRatePercent: number;

  // Kanban & CRM
  defaultProjectStatus: ProjectStatus;
  defaultRevisionsIncluded: number;
  autoClassifyClientTicket: boolean;
  premiumTicketThreshold: number;
}

export const DEFAULT_APP_SETTINGS: SoloistAppSettings = {
  theme: "dark",
  userName: "Gabriel Gurgel",
  studioName: "Soloist Studio",
  userEmail: "gabriel@soloist.app",
  defaultLocality: "São Paulo - SP",
  proposalValidityDays: 10,

  monthlyFixedCosts: 1500,
  desiredMonthlySalary: 4500,
  productiveHoursPerMonth: 140,
  defaultProfitMargin: 20,
  defaultComboDiscount: 10,

  urgencyUrgentMultiplier: 1.3,
  complexityMediumMultiplier: 1.15,
  complexityHighMultiplier: 1.35,
  segmentSmallBizMultiplier: 1.1,
  segmentLargeBizMultiplier: 1.25,
  extraRevisionRatePercent: 5,

  defaultProjectStatus: "Em andamento",
  defaultRevisionsIncluded: 2,
  autoClassifyClientTicket: true,
  premiumTicketThreshold: 5000,
};

export function applyAppTheme(theme: "dark" | "light"): void {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = theme;
  }
}

export function getStoredSettings(): SoloistAppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      applyAppTheme(DEFAULT_APP_SETTINGS.theme);
      return DEFAULT_APP_SETTINGS;
    }
    const merged = {
      ...DEFAULT_APP_SETTINGS,
      ...(JSON.parse(raw) as Partial<SoloistAppSettings>),
    };
    applyAppTheme(merged.theme);
    return merged;
  } catch {
    return DEFAULT_APP_SETTINGS;
  }
}

export function saveStoredSettings(settings: SoloistAppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    applyAppTheme(settings.theme);
    const hourly =
      settings.productiveHoursPerMonth > 0
        ? (settings.monthlyFixedCosts + settings.desiredMonthlySalary) /
          settings.productiveHoursPerMonth
        : 15;
    localStorage.setItem("soloist_reference_hourly_cost", hourly.toFixed(2));
    window.dispatchEvent(new Event("soloist-settings-updated"));
  } catch {
    // Ignore storage errors
  }
}

export function getCalculatedBaseHourlyCost(
  settings: SoloistAppSettings = getStoredSettings(),
): number {
  if (settings.productiveHoursPerMonth <= 0) return 15;
  return Number(
    (
      (settings.monthlyFixedCosts + settings.desiredMonthlySalary) /
      settings.productiveHoursPerMonth
    ).toFixed(2),
  );
}

export const INITIAL_SERVICES: CatalogService[] = [
  {
    id: "srv-1",
    title: "Identidade Visual Completa",
    description: "Logotipo, paleta de cores, tipografia e manual da marca.",
    category: "Design",
    price: 3500,
    estimatedHours: 35,
    revisionsIncluded: 3,
    complexity: "alta",
    timesRequested: 14,
  },
  {
    id: "srv-2",
    title: "Landing Page de Alta Conversão",
    description:
      "Design UI/UX exclusivo, protótipo no Figma e versão responsiva.",
    category: "Web / UI",
    price: 2800,
    estimatedHours: 24,
    revisionsIncluded: 2,
    complexity: "média",
    timesRequested: 11,
  },
  {
    id: "srv-3",
    title: "Pack Social Media (12 Posts)",
    description:
      "Direção de arte, templates editáveis e desdobramento para feed/stories.",
    category: "Social Media",
    price: 1600,
    estimatedHours: 16,
    revisionsIncluded: 2,
    complexity: "baixa",
    timesRequested: 9,
  },
  {
    id: "srv-4",
    title: "Projeto Arquitetônico Executivo",
    description:
      "Plantas técnicas detalhadas, cortes, paginação e compatibilização.",
    category: "Arquitetura",
    price: 4200,
    estimatedHours: 40,
    revisionsIncluded: 3,
    complexity: "alta",
    timesRequested: 7,
  },
  {
    id: "srv-5",
    title: "Consultoria de Posicionamento",
    description:
      "Diagnóstico de marca, plano de ação estratégico e mentoria 1:1.",
    category: "Consultoria",
    price: 1950,
    estimatedHours: 12,
    revisionsIncluded: 1,
    complexity: "média",
    timesRequested: 6,
  },
];

export const INITIAL_COMBOS: ServiceComboHistory[] = [
  {
    id: "combo-1",
    comboName: "Lançamento Digital (Marca + Landing Page)",
    serviceIds: ["srv-1", "srv-2"],
    serviceTitles: [
      "Identidade Visual Completa",
      "Landing Page de Alta Conversão",
    ],
    discountPercent: 10,
    totalHours: 59,
    totalRevisions: 5,
    finalPrice: 5670,
    lastClientName: "TechNova",
    createdAt: "10/11/2026",
    timesReused: 4,
  },
  {
    id: "combo-2",
    comboName: "Presença Completa (Marca + Social Media)",
    serviceIds: ["srv-1", "srv-3"],
    serviceTitles: [
      "Identidade Visual Completa",
      "Pack Social Media (12 Posts)",
    ],
    discountPercent: 5,
    totalHours: 51,
    totalRevisions: 5,
    finalPrice: 4845,
    lastClientName: "Fernando Correia",
    createdAt: "12/11/2026",
    timesReused: 3,
  },
];

export const INITIAL_CLIENTS: StoredClient[] = [
  {
    id: "client-1",
    name: "Eduardo Bezerra",
    company: "Bezerra Studio",
    email: "eduardo@bezerra.com",
    phone: "(11) 99876-5432",
    ticket: "Premium",
    status: "Ativo",
    lastContact: "10/11/2026",
  },
  {
    id: "client-2",
    name: "Barbara Costa",
    company: "BC Arquitetura",
    email: "barbara@bcarq.com.br",
    ticket: "Alto",
    status: "Ativo",
  },
  {
    id: "client-3",
    name: "Lucas Ferreira",
    company: "TechNova",
    email: "lucas@technova.io",
    ticket: "Médio",
    status: "Prospecto",
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Identidade Visual",
    client: "Fernando Correia",
    status: "Em andamento",
    type: "Design",
    value: 3500,
  },
  {
    id: "proj-2",
    name: "Projeto Arquitetônico",
    client: "Barbara Costa",
    status: "Concluído",
    type: "Arquitetura",
    value: 4000,
  },
  {
    id: "proj-3",
    name: "Social Media",
    client: "Carla Dantas",
    status: "Pausado",
    type: "Design",
    value: 2000,
  },
];

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("soloist-crm-updated"));
    }
  } catch {
    // Ignore storage write errors
  }
}

export function getStoredServices(): CatalogService[] {
  return readStorage(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
}

export function saveStoredServices(services: CatalogService[]): void {
  writeStorage(STORAGE_KEYS.SERVICES, services);
}

export function getStoredCombos(): ServiceComboHistory[] {
  return readStorage(STORAGE_KEYS.COMBOS, INITIAL_COMBOS);
}

export function saveStoredCombos(combos: ServiceComboHistory[]): void {
  writeStorage(STORAGE_KEYS.COMBOS, combos);
}

export function getStoredClients(): StoredClient[] {
  return readStorage(STORAGE_KEYS.CLIENTS, INITIAL_CLIENTS);
}

export function saveStoredClients(clients: StoredClient[]): void {
  writeStorage(STORAGE_KEYS.CLIENTS, clients);
}

export function getStoredProjects(): Project[] {
  return readStorage(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
}

export function saveStoredProjects(projects: Project[]): void {
  writeStorage(STORAGE_KEYS.PROJECTS, projects);
}

export interface CreateOrderPayload {
  projectName: string;
  projectType: string;
  projectStatus: ProjectStatus;
  finalPrice: number;
  ClientMode: "existing" | "new";
  existingClientId?: string;
  newClientData?: {
    name: string;
    company?: string;
    email: string;
    phone?: string;
    ticket: Ticket;
    status: ClientStatus;
  };
}

export function syncOrderWithClientsAndProjects(payload: CreateOrderPayload): {
  client: StoredClient;
  project: Project;
} {
  const clients = getStoredClients();
  const projects = getStoredProjects();
  const today = new Date().toLocaleDateString("pt-BR");

  let targetClient: StoredClient | undefined;

  if (payload.ClientMode === "existing" && payload.existingClientId) {
    targetClient = clients.find((c) => c.id === payload.existingClientId);
    if (targetClient) {
      const updatedClients = clients.map((c) =>
        c.id === targetClient!.id
          ? { ...c, lastContact: today, status: "Ativo" as ClientStatus }
          : c,
      );
      saveStoredClients(updatedClients);
    }
  }

  if (!targetClient && payload.newClientData) {
    const appSettings = getStoredSettings();
    let effectiveTicket = payload.newClientData.ticket;
    let upgradedToPremium = false;

    if (appSettings.autoClassifyClientTicket) {
      if (payload.finalPrice >= appSettings.premiumTicketThreshold) {
        if (effectiveTicket !== "Premium") upgradedToPremium = true;
        effectiveTicket = "Premium";
      } else if (
        payload.finalPrice >=
        appSettings.premiumTicketThreshold * 0.65
      ) {
        effectiveTicket = "Alto";
      }
    }

    targetClient = {
      id: crypto.randomUUID(),
      name: payload.newClientData.name.trim(),
      company: payload.newClientData.company?.trim() || undefined,
      email: payload.newClientData.email.trim(),
      phone: payload.newClientData.phone?.trim() || undefined,
      ticket: effectiveTicket,
      status: payload.newClientData.status,
      lastContact: today,
    };
    saveStoredClients([targetClient, ...clients]);

    if (upgradedToPremium) {
      pushActivityNotification({
        category: "vip",
        title: "Upgrade Automático para Ticket Premium",
        message: `O cliente "${targetClient.name}" foi promovido para Ticket Premium pelo orçamento de R$ ${payload.finalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}.`,
        actionLabel: "Ver Cliente",
        actionRoute: "/clients",
      });
    }
  }

  const fallbackClient: StoredClient = targetClient ?? {
    id: crypto.randomUUID(),
    name: "Cliente Avulso",
    email: "contato@cliente.com",
    ticket: "Médio",
    status: "Ativo",
    lastContact: today,
  };

  const createdProject: Project = {
    id: crypto.randomUUID(),
    name: payload.projectName,
    client: fallbackClient.name,
    status: payload.projectStatus,
    type: payload.projectType,
    value: payload.finalPrice,
    isPaid: false,
  };

  saveStoredProjects([createdProject, ...projects]);

  pushActivityNotification({
    category: "event",
    title: "Novo Orçamento Sincronizado",
    message: `Projeto "${createdProject.name}" (${fallbackClient.name}) enviado para a coluna "${createdProject.status}" no valor de R$ ${createdProject.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}.`,
    actionLabel: "Abrir Kanban",
    actionRoute: "/projects",
  });

  return { client: fallbackClient, project: createdProject };
}

export function getReadNotificationIds(): string[] {
  return readStorage<string[]>(STORAGE_KEYS.READ_NOTIFICATIONS, []);
}

export function markNotificationAsRead(notificationId: string): void {
  const current = getReadNotificationIds();
  if (!current.includes(notificationId)) {
    writeStorage(STORAGE_KEYS.READ_NOTIFICATIONS, [...current, notificationId]);
  }
}

export function markAllNotificationsAsRead(ids: string[]): void {
  const current = getReadNotificationIds();
  const merged = Array.from(new Set([...current, ...ids]));
  writeStorage(STORAGE_KEYS.READ_NOTIFICATIONS, merged);
}

export function pushActivityNotification(input: {
  category: NotificationCategory;
  title: string;
  message: string;
  actionLabel?: string;
  actionRoute?: "/projects" | "/clients" | "/services" | "/emails";
}): void {
  const current = readStorage<SoloistNotification[]>(
    STORAGE_KEYS.ACTIVITY_LOG,
    [],
  );
  const now = new Date();
  const timeStr = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const newEntry: SoloistNotification = {
    id: `act-${crypto.randomUUID()}`,
    category: input.category,
    title: input.title,
    message: input.message,
    timestamp: `Hoje às ${timeStr}`,
    actionLabel: input.actionLabel,
    actionRoute: input.actionRoute,
    isRead: false,
  };

  writeStorage(STORAGE_KEYS.ACTIVITY_LOG, [newEntry, ...current].slice(0, 15));
}

export function markProjectPaidStatus(
  projectId: string,
  isPaid: boolean,
): void {
  const projects = getStoredProjects();
  const updated = projects.map((proj) =>
    proj.id === projectId ? { ...proj, isPaid } : proj,
  );
  saveStoredProjects(updated);
}

export function getAllNotifications(): SoloistNotification[] {
  const projects = getStoredProjects();
  const clients = getStoredClients();
  const services = getStoredServices();
  const settings = getStoredSettings();
  const baseHourlyCost = getCalculatedBaseHourlyCost(settings);
  const readIds = new Set(getReadNotificationIds());
  const smartAlerts: SoloistNotification[] = [];

  // 1. Projetos Concluídos com Pagamento Pendente (!isPaid)
  const unpaidCompleted = projects.filter(
    (p) => p.status === "Concluído" && !p.isPaid,
  );
  for (const proj of unpaidCompleted) {
    const id = `smart-payment-${proj.id}`;
    smartAlerts.push({
      id,
      category: "payment",
      title: `Cobrança Pendente: ${proj.name}`,
      message: `O projeto de ${proj.client} está na coluna "Concluído", mas o pagamento de R$ ${proj.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ainda não foi marcado como recebido.`,
      timestamp: "Ação financeira",
      actionLabel: "Ver Projeto",
      actionRoute: "/projects",
      projectId: proj.id,
      isRead: readIds.has(id),
    });
  }

  // 2. Projetos Pausados (Receita Travada)
  const pausedProjects = projects.filter((p) => p.status === "Pausado");
  if (pausedProjects.length > 0) {
    const pausedTotal = pausedProjects.reduce((sum, p) => sum + p.value, 0);
    const names = pausedProjects.map((p) => p.name).join(", ");
    const id = `smart-paused-${pausedProjects.length}-${pausedTotal}`;
    smartAlerts.push({
      id,
      category: "paused",
      title: `${pausedProjects.length} ${pausedProjects.length === 1 ? "Projeto Pausado" : "Projetos Pausados"} (R$ ${pausedTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })})`,
      message: `Receita aguardando retomada em: ${names}. Faça contato com o cliente para destravar a aprovação ou o sinal.`,
      timestamp: "Alerta de fluxo",
      actionLabel: "Destravar no Kanban",
      actionRoute: "/projects",
      isRead: readIds.has(id),
    });
  }

  // 3. Follow-up de Prospectos e Validade de Proposta
  const prospects = clients.filter((c) => c.status === "Prospecto");
  if (prospects.length > 0) {
    const prospectNames = prospects.map((c) => c.name).join(", ");
    const id = `smart-prospects-${prospects.map((p) => p.id).join("-")}`;
    smartAlerts.push({
      id,
      category: "prospect",
      title: `Follow-up Comercial (${prospects.length} ${prospects.length === 1 ? "Prospecto" : "Prospectos"})`,
      message: `${prospectNames} ${prospects.length === 1 ? "está" : "estão"} na coluna Prospectos. Lembre-se: seus orçamentos têm validade de ${settings.proposalValidityDays} dias.`,
      timestamp: "Oportunidade de venda",
      actionLabel: "Montar Combo",
      actionRoute: "/services",
      isRead: readIds.has(id),
    });
  }

  // 4. Alerta de Defasagem de Preço nos Presets vs. Hora Técnica Atual
  const minRecommendedHourly =
    baseHourlyCost * (1 + settings.defaultProfitMargin / 100);
  const underpricedServices = services.filter((srv) => {
    const effectiveRate =
      srv.estimatedHours > 0 ? srv.price / srv.estimatedHours : srv.price;
    return effectiveRate < minRecommendedHourly;
  });

  if (underpricedServices.length > 0) {
    const firstUnder = underpricedServices[0];
    const effectiveRate = (
      firstUnder.price / Math.max(1, firstUnder.estimatedHours)
    ).toFixed(2);
    const id = `smart-pricing-${firstUnder.id}-${baseHourlyCost}`;
    smartAlerts.push({
      id,
      category: "pricing",
      title: `Defasagem de Hora Técnica (${underpricedServices.length} ${underpricedServices.length === 1 ? "Preset" : "Presets"})`,
      message: `O preset "${firstUnder.title}" rende R$ ${effectiveRate}/h, abaixo da sua meta recomendada de R$ ${minRecommendedHourly.toFixed(2)}/h (Hora base R$ ${baseHourlyCost.toFixed(2)} + ${settings.defaultProfitMargin}% margem).`,
      timestamp: "Saúde financeira",
      actionLabel: "Revisar Presets",
      actionRoute: "/services",
      isRead: readIds.has(id),
    });
  }

  // 5. Relacionamento & Recompra de Clientes VIP (Ticket Premium)
  const vipClients = clients.filter(
    (c) => c.status === "Ativo" && c.ticket === "Premium",
  );
  if (vipClients.length > 0) {
    const vipNames = vipClients.map((c) => c.name).join(", ");
    const id = `smart-vip-${vipClients.length}`;
    smartAlerts.push({
      id,
      category: "vip",
      title: `Carteira VIP (${vipClients.length} ${vipClients.length === 1 ? "Cliente Premium" : "Clientes Premium"})`,
      message: `Mantenha relacionamento próximo com ${vipNames}. Oferecer um combo complementar para clientes ativos tem alta taxa de conversão.`,
      timestamp: "Retenção & LTV",
      actionLabel: "Ver Carteira",
      actionRoute: "/clients",
      isRead: readIds.has(id),
    });
  }

  // Eventos recentes registrados
  const activityEvents = readStorage<SoloistNotification[]>(
    STORAGE_KEYS.ACTIVITY_LOG,
    [],
  ).map((ev) => ({
    ...ev,
    isRead: readIds.has(ev.id),
  }));

  return [...smartAlerts, ...activityEvents];
}

export const INITIAL_EMAIL_TEMPLATES: SoloistEmailTemplate[] = [
  {
    id: "tpl-proposta-comercial",
    name: "Proposta Comercial & Escopo",
    category: "Proposta",
    subject: "Proposta Comercial: {{projeto_nome}} — {{estudio_nome}}",
    greeting: "Olá, {{cliente_nome}}! Tudo bem?",
    body: "Preparei com muito cuidado o orçamento personalizado para o projeto **{{projeto_nome}}** da **{{cliente_empresa}}**.\n\nO investimento total para este escopo é de **{{projeto_valor}}**, contemplando planejamento estratégico, execução dedicada e revisões alinhadas ao seu objetivo.\n\nEsta proposta tem validade de **{{validade_dias}} dias corridos** (gerada em {{localidade}}). Caso esteja de acordo, basta clicar no botão abaixo para iniciarmos o cronograma imediatamente!",
    ctaLabel: "Aprovar Proposta Comercial",
    ctaUrl: "https://soloist.app/proposta",
    signature: "{{usuario_nome}} • {{estudio_nome}}",
    visualTheme: "soloist-dark",
    updatedAt: "15/11/2026",
  },
  {
    id: "tpl-cobranca-conclusao",
    name: "Faturamento de Projeto Concluído",
    category: "Cobrança",
    subject: "Conclusão & Faturamento: {{projeto_nome}} ({{cliente_empresa}})",
    greeting: "Oi, {{cliente_nome}}!",
    body: "Finalizamos todas as entregas previstas para o projeto **{{projeto_nome}}**! Foi excelente construir esse resultado junto com a **{{cliente_empresa}}**.\n\nPara concluirmos o fechamento financeiro referente ao valor acordado de **{{projeto_valor}}**, seguem os dados para confirmação do pagamento.\n\nAssim que o comprovante for enviado, liberamos o pacote final de arquivos editáveis e ativos de alta resolução.",
    ctaLabel: "Confirmar Pagamento / Ver Fatura",
    ctaUrl: "https://soloist.app/fatura",
    signature: "Financeiro • {{estudio_nome}} ({{usuario_email}})",
    visualTheme: "soloist-dark",
    updatedAt: "14/11/2026",
  },
  {
    id: "tpl-followup-prospecto",
    name: "Follow-up de Orçamento em Aberto",
    category: "Follow-up",
    subject: "Podemos avançar com o projeto {{projeto_nome}}?",
    greeting: "Olá, {{cliente_nome}}, como estão as coisas na {{cliente_empresa}}?",
    body: "Estou passando para saber se você conseguiu avaliar a proposta do **{{projeto_nome}}** no valor de **{{projeto_valor}}**.\n\nNossa agenda de produção para este mês ainda possui uma janela reservada para o seu projeto. Lembro que as condições comerciais especiais do combo têm validade de **{{validade_dias}} dias**.\n\nFicou alguma dúvida sobre o escopo ou prazos? Podemos ajustar qualquer detalhe rápido!",
    ctaLabel: "Agendar Alinhamento Rápido",
    ctaUrl: "https://soloist.app/agenda",
    signature: "{{usuario_nome}} • {{estudio_nome}}",
    visualTheme: "clean-light",
    updatedAt: "12/11/2026",
  },
  {
    id: "tpl-onboarding-boasvindas",
    name: "Boas-vindas & Kickoff do Projeto",
    category: "Onboarding",
    subject: "Bem-vindo(a) ao {{estudio_nome}}! Kickoff de {{projeto_nome}}",
    greeting: "Seja muito bem-vindo(a), {{cliente_nome}}!",
    body: "É uma alegria dar início oficial ao projeto **{{projeto_nome}}** para a **{{cliente_empresa}}**.\n\nSeu card já está ativo na coluna **{{projeto_status}}** do nosso fluxo de produção. Nos próximos dias compartilharemos a primeira prévia e os marcos de revisão.\n\nPara agilizar o briefing e envio de referências visuais, acesse seu painel exclusivo abaixo:",
    ctaLabel: "Acessar Briefing & Cronograma",
    ctaUrl: "https://soloist.app/onboarding",
    signature: "{{usuario_nome}} • Direção Criativa ({{estudio_nome}})",
    visualTheme: "editorial",
    updatedAt: "10/11/2026",
  },
  {
    id: "tpl-entrega-revisao",
    name: "Apresentação de Entrega & Rodada de Revisão",
    category: "Entrega",
    subject: "Prévia Pronta: {{projeto_nome}} disponível para aprovação",
    greeting: "Olá, {{cliente_nome}}!",
    body: "Temos novidades empolgantes: a nova versão do projeto **{{projeto_nome}}** acaba de sair do forno!\n\nOrganizamos todos os entregáveis e telas para que você e a equipe da **{{cliente_empresa}}** possam avaliar com calma e consolidar os comentários em um único link.\n\nClique no botão abaixo para visualizar a apresentação interativa:",
    ctaLabel: "Visualizar Entrega & Aprovar",
    ctaUrl: "https://soloist.app/entrega",
    signature: "{{usuario_nome}} • {{estudio_nome}}",
    visualTheme: "soloist-dark",
    updatedAt: "08/11/2026",
  },
];

export const INITIAL_SENT_EMAILS: SoloistSentEmail[] = [
  {
    id: "sent-1",
    templateName: "Proposta Comercial & Escopo",
    category: "Proposta",
    recipientName: "Camila Rocha",
    recipientEmail: "camila@rocha.com",
    projectName: "E-commerce Completo",
    subject: "Proposta Comercial: E-commerce Completo — Soloist Studio",
    renderedBody:
      "Proposta enviada com detalhamento do E-commerce Completo (R$ 4.000,00) e validade de 10 dias.",
    status: "Enviado",
    sentAt: "14/11/2026 às 16:40",
  },
  {
    id: "sent-2",
    templateName: "Faturamento de Projeto Concluído",
    category: "Cobrança",
    recipientName: "Ana Beatriz",
    recipientEmail: "ana@aurora.com",
    projectName: "Landing Page",
    subject: "Conclusão & Faturamento: Landing Page (Estúdio Aurora)",
    renderedBody:
      "Aviso de conclusão da Landing Page e solicitação de faturamento final de R$ 2.500,00.",
    status: "Enviado",
    sentAt: "12/11/2026 às 11:15",
  },
];

export function getStoredEmailTemplates(): SoloistEmailTemplate[] {
  return readStorage(STORAGE_KEYS.EMAIL_TEMPLATES, INITIAL_EMAIL_TEMPLATES);
}

export function saveStoredEmailTemplates(
  templates: SoloistEmailTemplate[],
): void {
  writeStorage(STORAGE_KEYS.EMAIL_TEMPLATES, templates);
}

export function getStoredEmailHistory(): SoloistSentEmail[] {
  return readStorage(STORAGE_KEYS.EMAIL_HISTORY, INITIAL_SENT_EMAILS);
}

export function saveStoredEmailHistory(history: SoloistSentEmail[]): void {
  writeStorage(STORAGE_KEYS.EMAIL_HISTORY, history);
}

export function clearActivityNotifications(): void {
  writeStorage(STORAGE_KEYS.ACTIVITY_LOG, []);
}

export function resetAllCrmData(): void {
  saveStoredServices(INITIAL_SERVICES);
  saveStoredCombos(INITIAL_COMBOS);
  saveStoredClients(INITIAL_CLIENTS);
  saveStoredProjects(INITIAL_PROJECTS);
  saveStoredSettings(DEFAULT_APP_SETTINGS);
  saveStoredEmailTemplates(INITIAL_EMAIL_TEMPLATES);
  saveStoredEmailHistory(INITIAL_SENT_EMAILS);
  writeStorage(STORAGE_KEYS.ACTIVITY_LOG, []);
  writeStorage(STORAGE_KEYS.READ_NOTIFICATIONS, []);
}
