# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertMySettings, createCatalogService, incrementServiceDemand, createClient, updateClientStatus, createProject, updateProjectKanban, closeComboOrderTransaction, deleteServiceCombo, saveEmailTemplate } from '@soloist/dataconnect';


// Operation UpsertMySettings:  For variables, look at type UpsertMySettingsVars in ../index.d.ts
const { data } = await UpsertMySettings(dataConnect, upsertMySettingsVars);

// Operation CreateCatalogService:  For variables, look at type CreateCatalogServiceVars in ../index.d.ts
const { data } = await CreateCatalogService(dataConnect, createCatalogServiceVars);

// Operation IncrementServiceDemand:  For variables, look at type IncrementServiceDemandVars in ../index.d.ts
const { data } = await IncrementServiceDemand(dataConnect, incrementServiceDemandVars);

// Operation CreateClient:  For variables, look at type CreateClientVars in ../index.d.ts
const { data } = await CreateClient(dataConnect, createClientVars);

// Operation UpdateClientStatus:  For variables, look at type UpdateClientStatusVars in ../index.d.ts
const { data } = await UpdateClientStatus(dataConnect, updateClientStatusVars);

// Operation CreateProject:  For variables, look at type CreateProjectVars in ../index.d.ts
const { data } = await CreateProject(dataConnect, createProjectVars);

// Operation UpdateProjectKanban:  For variables, look at type UpdateProjectKanbanVars in ../index.d.ts
const { data } = await UpdateProjectKanban(dataConnect, updateProjectKanbanVars);

// Operation CloseComboOrderTransaction:  For variables, look at type CloseComboOrderTransactionVars in ../index.d.ts
const { data } = await CloseComboOrderTransaction(dataConnect, closeComboOrderTransactionVars);

// Operation DeleteServiceCombo:  For variables, look at type DeleteServiceComboVars in ../index.d.ts
const { data } = await DeleteServiceCombo(dataConnect, deleteServiceComboVars);

// Operation SaveEmailTemplate:  For variables, look at type SaveEmailTemplateVars in ../index.d.ts
const { data } = await SaveEmailTemplate(dataConnect, saveEmailTemplateVars);


```