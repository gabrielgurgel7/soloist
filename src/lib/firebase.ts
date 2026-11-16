import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  onAuthStateChanged,
  type Auth,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  getDataConnect,
  connectDataConnectEmulator,
  type DataConnect,
} from "firebase/data-connect";
import {
  connectorConfig,
  upsertMySettings,
  getMySettings,
  listMyCatalogServices,
  listMyServiceCombos,
  listMyClients,
  listMyProjects,
  listMyEmailTemplates,
  listMySentEmails,
  createCatalogService,
  createClient,
  createProject,
  updateClientStatus,
  updateProjectKanban,
  closeComboOrderTransaction,
  saveEmailTemplate,
  recordSentEmail,
} from "@soloist/dataconnect";
import {
  type SoloistAppSettings,
  type CatalogService,
  type StoredClient,
  type ServiceComboHistory,
  type SoloistEmailTemplate,
  type SoloistSentEmail,
  setActiveSessionUser,
  getStoredSettings,
  saveStoredSettings,
  saveStoredServices,
  saveStoredCombos,
  saveStoredClients,
  saveStoredProjects,
  saveStoredEmailTemplates,
  saveStoredEmailHistory,
} from "../services/crmStorage";
import type { Ticket, ClientStatus } from "../components/cards/ClientCard";
import type { Project, ProjectStatus } from "../components/cards/ProjectCard";

export interface SoloistFirebaseEnvConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  useEmulator: boolean;
}

export const SOLOIST_DATACONNECT_CONFIG = {
  serviceId: "soloist-crm-16aa4-service",
  location: "southamerica-east1",
  connectorId: "soloist-connector",
  emulatorHost: "localhost",
  emulatorPort: 9399,
  authEmulatorPort: 9099,
} as const;

function cleanEnvValue(val: string | undefined, fallback = ""): string {
  if (!val) return fallback;
  return val
    .trim()
    .replace(/[,;]+$/, "")
    .trim()
    .replace(/^["']+|["']+$/g, "")
    .trim();
}

export function getFirebaseEnvConfig(): SoloistFirebaseEnvConfig {
  const env = import.meta.env;
  return {
    apiKey: cleanEnvValue(env.VITE_FIREBASE_API_KEY, "demo-soloist-api-key"),
    authDomain: cleanEnvValue(
      env.VITE_FIREBASE_AUTH_DOMAIN,
      "soloist-crm-16aa4.firebaseapp.com",
    ),
    projectId: cleanEnvValue(
      env.VITE_FIREBASE_PROJECT_ID,
      "soloist-crm-16aa4",
    ),
    storageBucket:
      cleanEnvValue(env.VITE_FIREBASE_STORAGE_BUCKET) || undefined,
    messagingSenderId:
      cleanEnvValue(env.VITE_FIREBASE_MESSAGING_SENDER_ID) || undefined,
    appId: cleanEnvValue(env.VITE_FIREBASE_APP_ID) || undefined,
    useEmulator: cleanEnvValue(env.VITE_USE_FIREBASE_EMULATOR) === "true",
  };
}

let firebaseAppInstance: FirebaseApp | null = null;
let firebaseAuthInstance: Auth | null = null;
let dataConnectInstance: DataConnect | null = null;
let emulatorsConnected = false;
let initializedApiKey = "";
let authListenerInitialized = false;

export function getSoloistFirebase(): {
  app: FirebaseApp;
  auth: Auth;
  dataConnect: DataConnect;
} {
  const cfg = getFirebaseEnvConfig();

  if (!firebaseAppInstance || initializedApiKey !== cfg.apiKey) {
    const appName = `soloist-${cfg.apiKey.slice(-6) || "default"}`;
    const existing = getApps().find((a) => a.name === appName);
    firebaseAppInstance =
      existing ??
      initializeApp(
        {
          apiKey: cfg.apiKey,
          authDomain: cfg.authDomain,
          projectId: cfg.projectId,
          storageBucket: cfg.storageBucket,
          messagingSenderId: cfg.messagingSenderId,
          appId: cfg.appId,
        },
        appName,
      );
    firebaseAuthInstance = getAuth(firebaseAppInstance);
    dataConnectInstance = getDataConnect(firebaseAppInstance, connectorConfig);
    initializedApiKey = cfg.apiKey;
  }

  if (!firebaseAuthInstance) {
    firebaseAuthInstance = getAuth(firebaseAppInstance);
  }

  if (!dataConnectInstance) {
    dataConnectInstance = getDataConnect(firebaseAppInstance, connectorConfig);
  }

  if (cfg.useEmulator && !emulatorsConnected) {
    try {
      connectAuthEmulator(
        firebaseAuthInstance,
        `http://${SOLOIST_DATACONNECT_CONFIG.emulatorHost}:${SOLOIST_DATACONNECT_CONFIG.authEmulatorPort}`,
        { disableWarnings: true },
      );
      connectDataConnectEmulator(
        dataConnectInstance,
        SOLOIST_DATACONNECT_CONFIG.emulatorHost,
        SOLOIST_DATACONNECT_CONFIG.emulatorPort,
      );
      emulatorsConnected = true;
    } catch {
      // Emulador já conectado
    }
  }

  return {
    app: firebaseAppInstance,
    auth: firebaseAuthInstance,
    dataConnect: dataConnectInstance,
  };
}

/**
 * Inicializa o listener global de autenticação e carrega automaticamente
 * os dados exclusivos da conta logada a partir do PostgreSQL.
 */
export function initSoloistAuthListener(): () => void {
  try {
    const { auth } = getSoloistFirebase();
    authListenerInitialized = true;
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const derivedName =
          user.displayName?.trim() ||
          user.email?.split("@")[0] ||
          "Usuário";
        setActiveSessionUser({
          uid: user.uid,
          email: user.email || "",
          displayName: derivedName,
        });
        await pullUserAccountFromPostgres(user).catch(() => undefined);
      } else {
        setActiveSessionUser(null);
      }
    });
  } catch {
    authListenerInitialized = false;
    return () => {};
  }
}

export function isAuthListenerReady(): boolean {
  return authListenerInitialized;
}

/**
 * Carrega todos os dados da conta autenticada direto do PostgreSQL (SQL Connect).
 * Se o usuário acabou de criar a conta e ainda não tem linha em `users`,
 * cria o registro inicial no PostgreSQL com os dados zerados.
 */
export async function pullUserAccountFromPostgres(
  user: FirebaseUser,
): Promise<void> {
  const { dataConnect } = getSoloistFirebase();
  const localSettings = getStoredSettings();
  const effectiveName =
    user.displayName?.trim() ||
    localSettings.userName?.trim() ||
    user.email?.split("@")[0] ||
    "Usuário";
  const effectiveEmail = user.email || localSettings.userEmail;

  // 1. Configurações e Perfil do Usuário
  const settingsRes = await getMySettings(dataConnect);
  if (settingsRes.data.user) {
    const u = settingsRes.data.user;
    saveStoredSettings({
      theme: u.theme === "light" ? "light" : "dark",
      userName: u.userName || effectiveName,
      studioName: u.studioName || "Meu Estúdio",
      userEmail: u.email || effectiveEmail,
      defaultLocality: u.defaultLocality || "São Paulo - SP",
      proposalValidityDays: u.proposalValidityDays,
      monthlyFixedCosts: u.monthlyFixedCosts,
      desiredMonthlySalary: u.desiredMonthlySalary,
      productiveHoursPerMonth: u.productiveHoursPerMonth,
      defaultProfitMargin: u.defaultProfitMargin,
      defaultComboDiscount: u.defaultComboDiscount,
      urgencyUrgentMultiplier: u.urgencyUrgentMultiplier,
      complexityMediumMultiplier: u.complexityMediumMultiplier,
      complexityHighMultiplier: u.complexityHighMultiplier,
      segmentSmallBizMultiplier: u.segmentSmallBizMultiplier,
      segmentLargeBizMultiplier: u.segmentLargeBizMultiplier,
      extraRevisionRatePercent: u.extraRevisionRatePercent,
      defaultProjectStatus: (u.defaultProjectStatus as ProjectStatus) || "Em andamento",
      defaultRevisionsIncluded: u.defaultRevisionsIncluded,
      autoClassifyClientTicket: u.autoClassifyClientTicket,
      premiumTicketThreshold: u.premiumTicketThreshold,
    });
  } else {
    // Primeiro login dessa conta no PostgreSQL: cria registro de perfil limpo
    const initialSettings: SoloistAppSettings = {
      ...localSettings,
      userName: effectiveName,
      userEmail: effectiveEmail,
      studioName: localSettings.studioName || "Meu Estúdio",
    };
    saveStoredSettings(initialSettings);
    await pushSettingsToPostgres(initialSettings).catch(() => undefined);
  }

  // 2. Presets de Serviços da conta
  const srvRes = await listMyCatalogServices(dataConnect);
  const remoteServices: CatalogService[] = srvRes.data.catalogServices.map(
    (s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      category: s.category,
      price: s.price,
      estimatedHours: s.estimatedHours,
      revisionsIncluded: s.revisionsIncluded,
      complexity:
        s.complexity === "baixa" || s.complexity === "alta"
          ? s.complexity
          : "média",
      timesRequested: s.timesRequested,
    }),
  );
  saveStoredServices(remoteServices);

  // 3. Histórico de Combos da conta
  const combosRes = await listMyServiceCombos(dataConnect);
  const remoteCombos: ServiceComboHistory[] = combosRes.data.serviceCombos.map(
    (c) => ({
      id: c.id,
      comboName: c.comboName,
      serviceIds: c.services.map((srv) => srv.id),
      serviceTitles: c.serviceTitles,
      discountPercent: c.discountPercent,
      totalHours: c.totalHours,
      totalRevisions: c.totalRevisions,
      finalPrice: c.finalPrice,
      lastClientName: c.lastClientName,
      createdAt: new Date(c.createdAt).toLocaleDateString("pt-BR"),
      timesReused: c.timesReused,
    }),
  );
  saveStoredCombos(remoteCombos);

  // 4. Carteira de Clientes da conta
  const clientsRes = await listMyClients(dataConnect);
  const remoteClients: StoredClient[] = clientsRes.data.clients.map((c) => ({
    id: c.id,
    name: c.name,
    company: c.company ?? undefined,
    email: c.email,
    phone: c.phone ?? undefined,
    birthDate: c.birthDate ?? undefined,
    ticket: (c.ticket as Ticket) || "Médio",
    status: (c.status as ClientStatus) || "Ativo",
    lastContact: c.lastContact ?? undefined,
  }));
  saveStoredClients(remoteClients);

  // 5. Projetos do Kanban da conta
  const projectsRes = await listMyProjects(dataConnect);
  const remoteProjects: Project[] = projectsRes.data.projects.map((p) => ({
    id: p.id,
    name: p.name,
    client: p.clientName,
    status: (p.status as ProjectStatus) || "Em andamento",
    type: p.type,
    value: p.value,
    isPaid: p.isPaid,
    startDate: p.startDate ?? undefined,
    deadline: p.deadline ?? undefined,
  }));
  saveStoredProjects(remoteProjects);

  // 6. Templates de E-mail da conta
  const tplRes = await listMyEmailTemplates(dataConnect);
  const remoteTemplates: SoloistEmailTemplate[] = tplRes.data.emailTemplates.map(
    (t) => ({
      id: t.id,
      name: t.name,
      category: (t.category as SoloistEmailTemplate["category"]) || "Proposta",
      subject: t.subject,
      greeting: t.greeting,
      body: t.body,
      ctaLabel: t.ctaLabel,
      ctaUrl: t.ctaUrl,
      signature: t.signature,
      visualTheme:
        (t.visualTheme as SoloistEmailTemplate["visualTheme"]) ||
        "soloist-dark",
      updatedAt: new Date(t.updatedAt).toLocaleDateString("pt-BR"),
    }),
  );
  saveStoredEmailTemplates(remoteTemplates);

  // 7. Histórico de E-mails Enviados da conta
  const sentRes = await listMySentEmails(dataConnect);
  const remoteSent: SoloistSentEmail[] = sentRes.data.sentEmails.map((e) => ({
    id: e.id,
    templateName: e.templateName,
    category: (e.category as SoloistSentEmail["category"]) || "Proposta",
    recipientName: e.recipientName,
    recipientEmail: e.recipientEmail,
    projectName: e.projectName ?? undefined,
    subject: e.subject,
    renderedBody: e.renderedBody,
    status: e.status === "Rascunho" ? "Rascunho" : "Enviado",
    sentAt: new Date(e.sentAt).toLocaleDateString("pt-BR"),
  }));
  saveStoredEmailHistory(remoteSent);
}

export async function pushSettingsToPostgres(
  settings: SoloistAppSettings = getStoredSettings(),
): Promise<void> {
  const { auth, dataConnect } = getSoloistFirebase();
  if (!auth.currentUser) return;

  await upsertMySettings(dataConnect, {
    email: settings.userEmail || auth.currentUser.email || "",
    userName:
      settings.userName ||
      auth.currentUser.displayName ||
      auth.currentUser.email?.split("@")[0] ||
      "Usuário",
    studioName: settings.studioName || "Meu Estúdio",
    theme: settings.theme,
    defaultLocality: settings.defaultLocality,
    proposalValidityDays: settings.proposalValidityDays,
    monthlyFixedCosts: settings.monthlyFixedCosts,
    desiredMonthlySalary: settings.desiredMonthlySalary,
    productiveHoursPerMonth: settings.productiveHoursPerMonth,
    defaultProfitMargin: settings.defaultProfitMargin,
    defaultComboDiscount: settings.defaultComboDiscount,
    urgencyUrgentMultiplier: settings.urgencyUrgentMultiplier,
    complexityMediumMultiplier: settings.complexityMediumMultiplier,
    complexityHighMultiplier: settings.complexityHighMultiplier,
    segmentSmallBizMultiplier: settings.segmentSmallBizMultiplier,
    segmentLargeBizMultiplier: settings.segmentLargeBizMultiplier,
    extraRevisionRatePercent: settings.extraRevisionRatePercent,
    defaultProjectStatus: settings.defaultProjectStatus,
    defaultRevisionsIncluded: settings.defaultRevisionsIncluded,
    autoClassifyClientTicket: settings.autoClassifyClientTicket,
    premiumTicketThreshold: settings.premiumTicketThreshold,
  });
}

export async function pushNewServiceToPostgres(
  srv: CatalogService,
): Promise<string | null> {
  const { auth, dataConnect } = getSoloistFirebase();
  if (!auth.currentUser) return null;
  const res = await createCatalogService(dataConnect, {
    title: srv.title,
    description: srv.description,
    category: srv.category,
    price: srv.price,
    estimatedHours: srv.estimatedHours,
    revisionsIncluded: srv.revisionsIncluded,
    complexity: srv.complexity,
  });
  return res.data.catalogService_insert.id;
}

export async function pushNewClientToPostgres(
  cl: StoredClient,
): Promise<string | null> {
  const { auth, dataConnect } = getSoloistFirebase();
  if (!auth.currentUser) return null;
  const res = await createClient(dataConnect, {
    name: cl.name,
    company: cl.company ?? null,
    email: cl.email,
    phone: cl.phone ?? null,
    ticket: cl.ticket,
    status: cl.status,
    lastContact: cl.lastContact ?? null,
  });
  return res.data.client_insert.id;
}

export async function pushClientStatusToPostgres(
  id: string,
  status: ClientStatus,
): Promise<void> {
  const { auth, dataConnect } = getSoloistFirebase();
  if (!auth.currentUser) return;
  await updateClientStatus(dataConnect, { id, status });
}

export async function pushNewProjectToPostgres(
  pr: Project,
): Promise<string | null> {
  const { auth, dataConnect } = getSoloistFirebase();
  if (!auth.currentUser) return null;
  const res = await createProject(dataConnect, {
    name: pr.name,
    clientId: null,
    clientName: pr.client,
    status: pr.status,
    type: pr.type,
    value: pr.value,
    isPaid: Boolean(pr.isPaid),
  });
  return res.data.project_insert.id;
}

export async function pushProjectKanbanToPostgres(
  id: string,
  updates: { status?: ProjectStatus; isPaid?: boolean },
): Promise<void> {
  const { auth, dataConnect } = getSoloistFirebase();
  if (!auth.currentUser) return;
  await updateProjectKanban(dataConnect, {
    id,
    status: updates.status ?? null,
    isPaid: updates.isPaid ?? null,
  });
}

export async function pushComboOrderTransactionToPostgres(vars: {
  clientName: string;
  clientCompany?: string;
  clientEmail: string;
  clientPhone?: string;
  clientTicket: string;
  clientStatus: string;
  lastContact: string;
  projectName: string;
  projectType: string;
  projectStatus: string;
  finalPrice: number;
  serviceTitles: string[];
  discountPercent: number;
  totalHours: number;
  totalRevisions: number;
}): Promise<void> {
  const { auth, dataConnect } = getSoloistFirebase();
  if (!auth.currentUser) return;
  await closeComboOrderTransaction(dataConnect, {
    ...vars,
    clientCompany: vars.clientCompany ?? null,
    clientPhone: vars.clientPhone ?? null,
  });
}

export async function pushEmailTemplateToPostgres(
  tpl: SoloistEmailTemplate,
): Promise<void> {
  const { auth, dataConnect } = getSoloistFirebase();
  if (!auth.currentUser) return;
  await saveEmailTemplate(dataConnect, {
    name: tpl.name,
    category: tpl.category,
    subject: tpl.subject,
    greeting: tpl.greeting,
    body: tpl.body,
    ctaLabel: tpl.ctaLabel,
    ctaUrl: tpl.ctaUrl,
    signature: tpl.signature,
    visualTheme: tpl.visualTheme,
  });
}

export async function pushSentEmailToPostgres(
  sent: SoloistSentEmail,
): Promise<void> {
  const { auth, dataConnect } = getSoloistFirebase();
  if (!auth.currentUser) return;
  await recordSentEmail(dataConnect, {
    clientId: null,
    projectId: null,
    templateName: sent.templateName,
    category: sent.category,
    recipientName: sent.recipientName,
    recipientEmail: sent.recipientEmail,
    projectName: sent.projectName ?? null,
    subject: sent.subject,
    renderedBody: sent.renderedBody,
    status: sent.status,
  });
}

export async function syncLocalCrmWithPostgres(
  userEmail: string,
): Promise<void> {
  const { auth } = getSoloistFirebase();
  if (!auth.currentUser) return;
  await pushSettingsToPostgres({
    ...getStoredSettings(),
    userEmail: userEmail || auth.currentUser.email || "",
  });
  await pullUserAccountFromPostgres(auth.currentUser);
}
