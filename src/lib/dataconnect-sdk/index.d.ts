import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CatalogService_Key {
  id: UUIDString;
  __typename?: 'CatalogService_Key';
}

export interface Client_Key {
  id: UUIDString;
  __typename?: 'Client_Key';
}

export interface CloseComboOrderTransactionData {
  client_insert: Client_Key;
  project_insert: Project_Key;
  serviceCombo_insert: ServiceCombo_Key;
}

export interface CloseComboOrderTransactionVariables {
  clientName: string;
  clientCompany?: string | null;
  clientEmail: string;
  clientPhone?: string | null;
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
}

export interface CreateCatalogServiceData {
  catalogService_insert: CatalogService_Key;
}

export interface CreateCatalogServiceVariables {
  title: string;
  description: string;
  category: string;
  price: number;
  estimatedHours: number;
  revisionsIncluded: number;
  complexity: string;
}

export interface CreateClientData {
  client_insert: Client_Key;
}

export interface CreateClientVariables {
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  ticket: string;
  status: string;
  lastContact?: string | null;
}

export interface CreateProjectData {
  project_insert: Project_Key;
}

export interface CreateProjectVariables {
  name: string;
  clientId?: UUIDString | null;
  clientName: string;
  status: string;
  type: string;
  value: number;
  isPaid?: boolean | null;
}

export interface DeleteServiceComboData {
  serviceCombo_delete?: ServiceCombo_Key | null;
}

export interface DeleteServiceComboVariables {
  id: UUIDString;
}

export interface EmailTemplate_Key {
  id: UUIDString;
  __typename?: 'EmailTemplate_Key';
}

export interface GetMySettingsData {
  user?: {
    uid: string;
    email: string;
    userName: string;
    studioName: string;
    theme: string;
    defaultLocality: string;
    proposalValidityDays: number;
    monthlyFixedCosts: number;
    desiredMonthlySalary: number;
    productiveHoursPerMonth: number;
    defaultProfitMargin: number;
    defaultComboDiscount: number;
    urgencyUrgentMultiplier: number;
    complexityMediumMultiplier: number;
    complexityHighMultiplier: number;
    segmentSmallBizMultiplier: number;
    segmentLargeBizMultiplier: number;
    extraRevisionRatePercent: number;
    defaultProjectStatus: string;
    defaultRevisionsIncluded: number;
    autoClassifyClientTicket: boolean;
    premiumTicketThreshold: number;
    updatedAt: TimestampString;
  } & User_Key;
}

export interface IncrementServiceDemandData {
  catalogService_update?: CatalogService_Key | null;
}

export interface IncrementServiceDemandVariables {
  id: UUIDString;
}

export interface ListMyCatalogServicesData {
  catalogServices: ({
    id: UUIDString;
    title: string;
    description: string;
    category: string;
    price: number;
    estimatedHours: number;
    revisionsIncluded: number;
    complexity: string;
    timesRequested: number;
    createdAt: TimestampString;
  } & CatalogService_Key)[];
}

export interface ListMyClientsData {
  clients: ({
    id: UUIDString;
    name: string;
    company?: string | null;
    email: string;
    phone?: string | null;
    birthDate?: string | null;
    ticket: string;
    status: string;
    lastContact?: string | null;
    createdAt: TimestampString;
    projects: ({
      id: UUIDString;
      name: string;
      status: string;
      value: number;
      isPaid: boolean;
    } & Project_Key)[];
  } & Client_Key)[];
}

export interface ListMyClientsVariables {
  status?: string | null;
}

export interface ListMyEmailTemplatesData {
  emailTemplates: ({
    id: UUIDString;
    name: string;
    category: string;
    subject: string;
    greeting: string;
    body: string;
    ctaLabel: string;
    ctaUrl: string;
    signature: string;
    visualTheme: string;
    updatedAt: TimestampString;
  } & EmailTemplate_Key)[];
}

export interface ListMyEmailTemplatesVariables {
  category?: string | null;
}

export interface ListMyProjectsData {
  projects: ({
    id: UUIDString;
    name: string;
    clientName: string;
    status: string;
    type: string;
    value: number;
    isPaid: boolean;
    startDate?: string | null;
    deadline?: string | null;
    createdAt: TimestampString;
    client?: {
      id: UUIDString;
      name: string;
      email: string;
      ticket: string;
    } & Client_Key;
  } & Project_Key)[];
}

export interface ListMyProjectsVariables {
  status?: string | null;
}

export interface ListMySentEmailsData {
  sentEmails: ({
    id: UUIDString;
    templateName: string;
    category: string;
    recipientName: string;
    recipientEmail: string;
    projectName?: string | null;
    subject: string;
    renderedBody: string;
    status: string;
    sentAt: TimestampString;
  } & SentEmail_Key)[];
}

export interface ListMyServiceCombosData {
  serviceCombos: ({
    id: UUIDString;
    comboName: string;
    serviceTitles: string[];
    discountPercent: number;
    totalHours: number;
    totalRevisions: number;
    finalPrice: number;
    lastClientName: string;
    timesReused: number;
    createdAt: TimestampString;
    services: ({
      id: UUIDString;
      title: string;
      price: number;
    } & CatalogService_Key)[];
  } & ServiceCombo_Key)[];
}

export interface Project_Key {
  id: UUIDString;
  __typename?: 'Project_Key';
}

export interface RecordSentEmailData {
  sentEmail_insert: SentEmail_Key;
}

export interface RecordSentEmailVariables {
  clientId?: UUIDString | null;
  projectId?: UUIDString | null;
  templateName: string;
  category: string;
  recipientName: string;
  recipientEmail: string;
  projectName?: string | null;
  subject: string;
  renderedBody: string;
  status: string;
}

export interface SaveEmailTemplateData {
  emailTemplate_insert: EmailTemplate_Key;
}

export interface SaveEmailTemplateVariables {
  name: string;
  category: string;
  subject: string;
  greeting: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  signature: string;
  visualTheme: string;
}

export interface SentEmail_Key {
  id: UUIDString;
  __typename?: 'SentEmail_Key';
}

export interface ServiceComboItem_Key {
  comboId: UUIDString;
  serviceId: UUIDString;
  __typename?: 'ServiceComboItem_Key';
}

export interface ServiceCombo_Key {
  id: UUIDString;
  __typename?: 'ServiceCombo_Key';
}

export interface UpdateClientStatusData {
  client_update?: Client_Key | null;
}

export interface UpdateClientStatusVariables {
  id: UUIDString;
  status: string;
  ticket?: string | null;
  lastContact?: string | null;
}

export interface UpdateProjectKanbanData {
  project_update?: Project_Key | null;
}

export interface UpdateProjectKanbanVariables {
  id: UUIDString;
  status?: string | null;
  isPaid?: boolean | null;
}

export interface UpsertMySettingsData {
  user_upsert: User_Key;
}

export interface UpsertMySettingsVariables {
  email: string;
  userName: string;
  studioName: string;
  theme: string;
  defaultLocality: string;
  proposalValidityDays: number;
  monthlyFixedCosts: number;
  desiredMonthlySalary: number;
  productiveHoursPerMonth: number;
  defaultProfitMargin: number;
  defaultComboDiscount: number;
  urgencyUrgentMultiplier: number;
  complexityMediumMultiplier: number;
  complexityHighMultiplier: number;
  segmentSmallBizMultiplier: number;
  segmentLargeBizMultiplier: number;
  extraRevisionRatePercent: number;
  defaultProjectStatus: string;
  defaultRevisionsIncluded: number;
  autoClassifyClientTicket: boolean;
  premiumTicketThreshold: number;
}

export interface User_Key {
  uid: string;
  __typename?: 'User_Key';
}

interface UpsertMySettingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertMySettingsVariables): MutationRef<UpsertMySettingsData, UpsertMySettingsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertMySettingsVariables): MutationRef<UpsertMySettingsData, UpsertMySettingsVariables>;
  operationName: string;
}
export const upsertMySettingsRef: UpsertMySettingsRef;

export function upsertMySettings(vars: UpsertMySettingsVariables): MutationPromise<UpsertMySettingsData, UpsertMySettingsVariables>;
export function upsertMySettings(dc: DataConnect, vars: UpsertMySettingsVariables): MutationPromise<UpsertMySettingsData, UpsertMySettingsVariables>;

interface CreateCatalogServiceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCatalogServiceVariables): MutationRef<CreateCatalogServiceData, CreateCatalogServiceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCatalogServiceVariables): MutationRef<CreateCatalogServiceData, CreateCatalogServiceVariables>;
  operationName: string;
}
export const createCatalogServiceRef: CreateCatalogServiceRef;

export function createCatalogService(vars: CreateCatalogServiceVariables): MutationPromise<CreateCatalogServiceData, CreateCatalogServiceVariables>;
export function createCatalogService(dc: DataConnect, vars: CreateCatalogServiceVariables): MutationPromise<CreateCatalogServiceData, CreateCatalogServiceVariables>;

interface IncrementServiceDemandRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: IncrementServiceDemandVariables): MutationRef<IncrementServiceDemandData, IncrementServiceDemandVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: IncrementServiceDemandVariables): MutationRef<IncrementServiceDemandData, IncrementServiceDemandVariables>;
  operationName: string;
}
export const incrementServiceDemandRef: IncrementServiceDemandRef;

export function incrementServiceDemand(vars: IncrementServiceDemandVariables): MutationPromise<IncrementServiceDemandData, IncrementServiceDemandVariables>;
export function incrementServiceDemand(dc: DataConnect, vars: IncrementServiceDemandVariables): MutationPromise<IncrementServiceDemandData, IncrementServiceDemandVariables>;

interface CreateClientRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateClientVariables): MutationRef<CreateClientData, CreateClientVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateClientVariables): MutationRef<CreateClientData, CreateClientVariables>;
  operationName: string;
}
export const createClientRef: CreateClientRef;

export function createClient(vars: CreateClientVariables): MutationPromise<CreateClientData, CreateClientVariables>;
export function createClient(dc: DataConnect, vars: CreateClientVariables): MutationPromise<CreateClientData, CreateClientVariables>;

interface UpdateClientStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateClientStatusVariables): MutationRef<UpdateClientStatusData, UpdateClientStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateClientStatusVariables): MutationRef<UpdateClientStatusData, UpdateClientStatusVariables>;
  operationName: string;
}
export const updateClientStatusRef: UpdateClientStatusRef;

export function updateClientStatus(vars: UpdateClientStatusVariables): MutationPromise<UpdateClientStatusData, UpdateClientStatusVariables>;
export function updateClientStatus(dc: DataConnect, vars: UpdateClientStatusVariables): MutationPromise<UpdateClientStatusData, UpdateClientStatusVariables>;

interface CreateProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProjectVariables): MutationRef<CreateProjectData, CreateProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateProjectVariables): MutationRef<CreateProjectData, CreateProjectVariables>;
  operationName: string;
}
export const createProjectRef: CreateProjectRef;

export function createProject(vars: CreateProjectVariables): MutationPromise<CreateProjectData, CreateProjectVariables>;
export function createProject(dc: DataConnect, vars: CreateProjectVariables): MutationPromise<CreateProjectData, CreateProjectVariables>;

interface UpdateProjectKanbanRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProjectKanbanVariables): MutationRef<UpdateProjectKanbanData, UpdateProjectKanbanVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProjectKanbanVariables): MutationRef<UpdateProjectKanbanData, UpdateProjectKanbanVariables>;
  operationName: string;
}
export const updateProjectKanbanRef: UpdateProjectKanbanRef;

export function updateProjectKanban(vars: UpdateProjectKanbanVariables): MutationPromise<UpdateProjectKanbanData, UpdateProjectKanbanVariables>;
export function updateProjectKanban(dc: DataConnect, vars: UpdateProjectKanbanVariables): MutationPromise<UpdateProjectKanbanData, UpdateProjectKanbanVariables>;

interface CloseComboOrderTransactionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CloseComboOrderTransactionVariables): MutationRef<CloseComboOrderTransactionData, CloseComboOrderTransactionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CloseComboOrderTransactionVariables): MutationRef<CloseComboOrderTransactionData, CloseComboOrderTransactionVariables>;
  operationName: string;
}
export const closeComboOrderTransactionRef: CloseComboOrderTransactionRef;

export function closeComboOrderTransaction(vars: CloseComboOrderTransactionVariables): MutationPromise<CloseComboOrderTransactionData, CloseComboOrderTransactionVariables>;
export function closeComboOrderTransaction(dc: DataConnect, vars: CloseComboOrderTransactionVariables): MutationPromise<CloseComboOrderTransactionData, CloseComboOrderTransactionVariables>;

interface DeleteServiceComboRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteServiceComboVariables): MutationRef<DeleteServiceComboData, DeleteServiceComboVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteServiceComboVariables): MutationRef<DeleteServiceComboData, DeleteServiceComboVariables>;
  operationName: string;
}
export const deleteServiceComboRef: DeleteServiceComboRef;

export function deleteServiceCombo(vars: DeleteServiceComboVariables): MutationPromise<DeleteServiceComboData, DeleteServiceComboVariables>;
export function deleteServiceCombo(dc: DataConnect, vars: DeleteServiceComboVariables): MutationPromise<DeleteServiceComboData, DeleteServiceComboVariables>;

interface SaveEmailTemplateRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SaveEmailTemplateVariables): MutationRef<SaveEmailTemplateData, SaveEmailTemplateVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SaveEmailTemplateVariables): MutationRef<SaveEmailTemplateData, SaveEmailTemplateVariables>;
  operationName: string;
}
export const saveEmailTemplateRef: SaveEmailTemplateRef;

export function saveEmailTemplate(vars: SaveEmailTemplateVariables): MutationPromise<SaveEmailTemplateData, SaveEmailTemplateVariables>;
export function saveEmailTemplate(dc: DataConnect, vars: SaveEmailTemplateVariables): MutationPromise<SaveEmailTemplateData, SaveEmailTemplateVariables>;

interface RecordSentEmailRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RecordSentEmailVariables): MutationRef<RecordSentEmailData, RecordSentEmailVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RecordSentEmailVariables): MutationRef<RecordSentEmailData, RecordSentEmailVariables>;
  operationName: string;
}
export const recordSentEmailRef: RecordSentEmailRef;

export function recordSentEmail(vars: RecordSentEmailVariables): MutationPromise<RecordSentEmailData, RecordSentEmailVariables>;
export function recordSentEmail(dc: DataConnect, vars: RecordSentEmailVariables): MutationPromise<RecordSentEmailData, RecordSentEmailVariables>;

interface GetMySettingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMySettingsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMySettingsData, undefined>;
  operationName: string;
}
export const getMySettingsRef: GetMySettingsRef;

export function getMySettings(options?: ExecuteQueryOptions): QueryPromise<GetMySettingsData, undefined>;
export function getMySettings(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMySettingsData, undefined>;

interface ListMyCatalogServicesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyCatalogServicesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyCatalogServicesData, undefined>;
  operationName: string;
}
export const listMyCatalogServicesRef: ListMyCatalogServicesRef;

export function listMyCatalogServices(options?: ExecuteQueryOptions): QueryPromise<ListMyCatalogServicesData, undefined>;
export function listMyCatalogServices(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyCatalogServicesData, undefined>;

interface ListMyServiceCombosRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyServiceCombosData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyServiceCombosData, undefined>;
  operationName: string;
}
export const listMyServiceCombosRef: ListMyServiceCombosRef;

export function listMyServiceCombos(options?: ExecuteQueryOptions): QueryPromise<ListMyServiceCombosData, undefined>;
export function listMyServiceCombos(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyServiceCombosData, undefined>;

interface ListMyClientsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListMyClientsVariables): QueryRef<ListMyClientsData, ListMyClientsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: ListMyClientsVariables): QueryRef<ListMyClientsData, ListMyClientsVariables>;
  operationName: string;
}
export const listMyClientsRef: ListMyClientsRef;

export function listMyClients(vars?: ListMyClientsVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyClientsData, ListMyClientsVariables>;
export function listMyClients(dc: DataConnect, vars?: ListMyClientsVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyClientsData, ListMyClientsVariables>;

interface ListMyProjectsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListMyProjectsVariables): QueryRef<ListMyProjectsData, ListMyProjectsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: ListMyProjectsVariables): QueryRef<ListMyProjectsData, ListMyProjectsVariables>;
  operationName: string;
}
export const listMyProjectsRef: ListMyProjectsRef;

export function listMyProjects(vars?: ListMyProjectsVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyProjectsData, ListMyProjectsVariables>;
export function listMyProjects(dc: DataConnect, vars?: ListMyProjectsVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyProjectsData, ListMyProjectsVariables>;

interface ListMyEmailTemplatesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListMyEmailTemplatesVariables): QueryRef<ListMyEmailTemplatesData, ListMyEmailTemplatesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: ListMyEmailTemplatesVariables): QueryRef<ListMyEmailTemplatesData, ListMyEmailTemplatesVariables>;
  operationName: string;
}
export const listMyEmailTemplatesRef: ListMyEmailTemplatesRef;

export function listMyEmailTemplates(vars?: ListMyEmailTemplatesVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyEmailTemplatesData, ListMyEmailTemplatesVariables>;
export function listMyEmailTemplates(dc: DataConnect, vars?: ListMyEmailTemplatesVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyEmailTemplatesData, ListMyEmailTemplatesVariables>;

interface ListMySentEmailsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMySentEmailsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMySentEmailsData, undefined>;
  operationName: string;
}
export const listMySentEmailsRef: ListMySentEmailsRef;

export function listMySentEmails(options?: ExecuteQueryOptions): QueryPromise<ListMySentEmailsData, undefined>;
export function listMySentEmails(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMySentEmailsData, undefined>;

