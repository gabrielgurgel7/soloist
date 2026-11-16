import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import {
  getDataConnect,
  connectDataConnectEmulator,
  type DataConnect,
} from "firebase/data-connect";
import {
  connectorConfig,
  upsertMySettings,
  getMySettings,
  createCatalogService,
  createClient,
  createProject,
} from "@soloist/dataconnect";
import {
  getStoredSettings,
  saveStoredSettings,
  getStoredServices,
  getStoredClients,
  getStoredProjects,
} from "../services/crmStorage";

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
    storageBucket: cleanEnvValue(env.VITE_FIREBASE_STORAGE_BUCKET) || undefined,
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
 * Sincroniza os dados locais do usuário autenticado com o banco PostgreSQL (Firebase SQL Connect).
 */
export async function syncLocalCrmWithPostgres(
  userEmail: string,
): Promise<void> {
  const { dataConnect } = getSoloistFirebase();
  const settings = getStoredSettings();

  await upsertMySettings(dataConnect, {
    email: userEmail || settings.userEmail,
    userName: settings.userName,
    studioName: settings.studioName,
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

  const remoteSettings = await getMySettings(dataConnect);
  if (remoteSettings.data.user) {
    const u = remoteSettings.data.user;
    saveStoredSettings({
      ...settings,
      userName: u.userName,
      studioName: u.studioName,
      userEmail: u.email,
      defaultLocality: u.defaultLocality,
      proposalValidityDays: u.proposalValidityDays,
    });
  }

  // Envia serviços, clientes e projetos iniciais caso queira sincronizar lote
  const services = getStoredServices();
  for (const srv of services.slice(0, 4)) {
    await createCatalogService(dataConnect, {
      title: srv.title,
      description: srv.description,
      category: srv.category,
      price: srv.price,
      estimatedHours: srv.estimatedHours,
      revisionsIncluded: srv.revisionsIncluded,
      complexity: srv.complexity,
    }).catch(() => undefined);
  }

  const clients = getStoredClients();
  for (const cl of clients.slice(0, 4)) {
    await createClient(dataConnect, {
      name: cl.name,
      company: cl.company ?? null,
      email: cl.email,
      phone: cl.phone ?? null,
      ticket: cl.ticket,
      status: cl.status,
      lastContact: cl.lastContact ?? null,
    }).catch(() => undefined);
  }

  const projects = getStoredProjects();
  for (const pr of projects.slice(0, 4)) {
    await createProject(dataConnect, {
      name: pr.name,
      clientId: null,
      clientName: pr.client,
      status: pr.status,
      type: pr.type,
      value: pr.value,
      isPaid: Boolean(pr.isPaid),
    }).catch(() => undefined);
  }
}
