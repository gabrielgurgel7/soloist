const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'soloist-connector',
  service: 'soloist-crm-16aa4-service',
  location: 'southamerica-east1'
};
exports.connectorConfig = connectorConfig;

const upsertMySettingsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertMySettings', inputVars);
}
upsertMySettingsRef.operationName = 'UpsertMySettings';
exports.upsertMySettingsRef = upsertMySettingsRef;

exports.upsertMySettings = function upsertMySettings(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertMySettingsRef(dcInstance, inputVars));
}
;

const createCatalogServiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCatalogService', inputVars);
}
createCatalogServiceRef.operationName = 'CreateCatalogService';
exports.createCatalogServiceRef = createCatalogServiceRef;

exports.createCatalogService = function createCatalogService(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createCatalogServiceRef(dcInstance, inputVars));
}
;

const incrementServiceDemandRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'IncrementServiceDemand', inputVars);
}
incrementServiceDemandRef.operationName = 'IncrementServiceDemand';
exports.incrementServiceDemandRef = incrementServiceDemandRef;

exports.incrementServiceDemand = function incrementServiceDemand(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(incrementServiceDemandRef(dcInstance, inputVars));
}
;

const createClientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateClient', inputVars);
}
createClientRef.operationName = 'CreateClient';
exports.createClientRef = createClientRef;

exports.createClient = function createClient(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createClientRef(dcInstance, inputVars));
}
;

const updateClientStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateClientStatus', inputVars);
}
updateClientStatusRef.operationName = 'UpdateClientStatus';
exports.updateClientStatusRef = updateClientStatusRef;

exports.updateClientStatus = function updateClientStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateClientStatusRef(dcInstance, inputVars));
}
;

const createProjectRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateProject', inputVars);
}
createProjectRef.operationName = 'CreateProject';
exports.createProjectRef = createProjectRef;

exports.createProject = function createProject(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createProjectRef(dcInstance, inputVars));
}
;

const updateProjectKanbanRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateProjectKanban', inputVars);
}
updateProjectKanbanRef.operationName = 'UpdateProjectKanban';
exports.updateProjectKanbanRef = updateProjectKanbanRef;

exports.updateProjectKanban = function updateProjectKanban(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateProjectKanbanRef(dcInstance, inputVars));
}
;

const closeComboOrderTransactionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CloseComboOrderTransaction', inputVars);
}
closeComboOrderTransactionRef.operationName = 'CloseComboOrderTransaction';
exports.closeComboOrderTransactionRef = closeComboOrderTransactionRef;

exports.closeComboOrderTransaction = function closeComboOrderTransaction(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(closeComboOrderTransactionRef(dcInstance, inputVars));
}
;

const deleteServiceComboRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteServiceCombo', inputVars);
}
deleteServiceComboRef.operationName = 'DeleteServiceCombo';
exports.deleteServiceComboRef = deleteServiceComboRef;

exports.deleteServiceCombo = function deleteServiceCombo(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteServiceComboRef(dcInstance, inputVars));
}
;

const saveEmailTemplateRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SaveEmailTemplate', inputVars);
}
saveEmailTemplateRef.operationName = 'SaveEmailTemplate';
exports.saveEmailTemplateRef = saveEmailTemplateRef;

exports.saveEmailTemplate = function saveEmailTemplate(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(saveEmailTemplateRef(dcInstance, inputVars));
}
;

const recordSentEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RecordSentEmail', inputVars);
}
recordSentEmailRef.operationName = 'RecordSentEmail';
exports.recordSentEmailRef = recordSentEmailRef;

exports.recordSentEmail = function recordSentEmail(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(recordSentEmailRef(dcInstance, inputVars));
}
;

const deleteAllMyDataRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteAllMyData');
}
deleteAllMyDataRef.operationName = 'DeleteAllMyData';
exports.deleteAllMyDataRef = deleteAllMyDataRef;

exports.deleteAllMyData = function deleteAllMyData(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(deleteAllMyDataRef(dcInstance, inputVars));
}
;

const getMySettingsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMySettings');
}
getMySettingsRef.operationName = 'GetMySettings';
exports.getMySettingsRef = getMySettingsRef;

exports.getMySettings = function getMySettings(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getMySettingsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listMyCatalogServicesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyCatalogServices');
}
listMyCatalogServicesRef.operationName = 'ListMyCatalogServices';
exports.listMyCatalogServicesRef = listMyCatalogServicesRef;

exports.listMyCatalogServices = function listMyCatalogServices(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listMyCatalogServicesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listMyServiceCombosRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyServiceCombos');
}
listMyServiceCombosRef.operationName = 'ListMyServiceCombos';
exports.listMyServiceCombosRef = listMyServiceCombosRef;

exports.listMyServiceCombos = function listMyServiceCombos(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listMyServiceCombosRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listMyClientsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyClients', inputVars);
}
listMyClientsRef.operationName = 'ListMyClients';
exports.listMyClientsRef = listMyClientsRef;

exports.listMyClients = function listMyClients(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listMyClientsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listMyProjectsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyProjects', inputVars);
}
listMyProjectsRef.operationName = 'ListMyProjects';
exports.listMyProjectsRef = listMyProjectsRef;

exports.listMyProjects = function listMyProjects(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listMyProjectsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listMyEmailTemplatesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyEmailTemplates', inputVars);
}
listMyEmailTemplatesRef.operationName = 'ListMyEmailTemplates';
exports.listMyEmailTemplatesRef = listMyEmailTemplatesRef;

exports.listMyEmailTemplates = function listMyEmailTemplates(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listMyEmailTemplatesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listMySentEmailsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMySentEmails');
}
listMySentEmailsRef.operationName = 'ListMySentEmails';
exports.listMySentEmailsRef = listMySentEmailsRef;

exports.listMySentEmails = function listMySentEmails(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listMySentEmailsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;
