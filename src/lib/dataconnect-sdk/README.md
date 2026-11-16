# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `soloist-connector`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetMySettings*](#getmysettings)
  - [*ListMyCatalogServices*](#listmycatalogservices)
  - [*ListMyServiceCombos*](#listmyservicecombos)
  - [*ListMyClients*](#listmyclients)
  - [*ListMyProjects*](#listmyprojects)
  - [*ListMyEmailTemplates*](#listmyemailtemplates)
  - [*ListMySentEmails*](#listmysentemails)
- [**Mutations**](#mutations)
  - [*UpsertMySettings*](#upsertmysettings)
  - [*CreateCatalogService*](#createcatalogservice)
  - [*IncrementServiceDemand*](#incrementservicedemand)
  - [*CreateClient*](#createclient)
  - [*UpdateClientStatus*](#updateclientstatus)
  - [*CreateProject*](#createproject)
  - [*UpdateProjectKanban*](#updateprojectkanban)
  - [*CloseComboOrderTransaction*](#closecomboordertransaction)
  - [*DeleteServiceCombo*](#deleteservicecombo)
  - [*SaveEmailTemplate*](#saveemailtemplate)
  - [*RecordSentEmail*](#recordsentemail)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `soloist-connector`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@soloist/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@soloist/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@soloist/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `soloist-connector` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetMySettings
You can execute the `GetMySettings` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
getMySettings(options?: ExecuteQueryOptions): QueryPromise<GetMySettingsData, undefined>;

interface GetMySettingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMySettingsData, undefined>;
}
export const getMySettingsRef: GetMySettingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMySettings(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMySettingsData, undefined>;

interface GetMySettingsRef {
  ...
  (dc: DataConnect): QueryRef<GetMySettingsData, undefined>;
}
export const getMySettingsRef: GetMySettingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMySettingsRef:
```typescript
const name = getMySettingsRef.operationName;
console.log(name);
```

### Variables
The `GetMySettings` query has no variables.
### Return Type
Recall that executing the `GetMySettings` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMySettingsData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetMySettings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMySettings } from '@soloist/dataconnect';


// Call the `getMySettings()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMySettings();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMySettings(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getMySettings().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetMySettings`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMySettingsRef } from '@soloist/dataconnect';


// Call the `getMySettingsRef()` function to get a reference to the query.
const ref = getMySettingsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMySettingsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListMyCatalogServices
You can execute the `ListMyCatalogServices` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
listMyCatalogServices(options?: ExecuteQueryOptions): QueryPromise<ListMyCatalogServicesData, undefined>;

interface ListMyCatalogServicesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyCatalogServicesData, undefined>;
}
export const listMyCatalogServicesRef: ListMyCatalogServicesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyCatalogServices(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyCatalogServicesData, undefined>;

interface ListMyCatalogServicesRef {
  ...
  (dc: DataConnect): QueryRef<ListMyCatalogServicesData, undefined>;
}
export const listMyCatalogServicesRef: ListMyCatalogServicesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyCatalogServicesRef:
```typescript
const name = listMyCatalogServicesRef.operationName;
console.log(name);
```

### Variables
The `ListMyCatalogServices` query has no variables.
### Return Type
Recall that executing the `ListMyCatalogServices` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyCatalogServicesData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListMyCatalogServices`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyCatalogServices } from '@soloist/dataconnect';


// Call the `listMyCatalogServices()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyCatalogServices();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyCatalogServices(dataConnect);

console.log(data.catalogServices);

// Or, you can use the `Promise` API.
listMyCatalogServices().then((response) => {
  const data = response.data;
  console.log(data.catalogServices);
});
```

### Using `ListMyCatalogServices`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyCatalogServicesRef } from '@soloist/dataconnect';


// Call the `listMyCatalogServicesRef()` function to get a reference to the query.
const ref = listMyCatalogServicesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyCatalogServicesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.catalogServices);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.catalogServices);
});
```

## ListMyServiceCombos
You can execute the `ListMyServiceCombos` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
listMyServiceCombos(options?: ExecuteQueryOptions): QueryPromise<ListMyServiceCombosData, undefined>;

interface ListMyServiceCombosRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyServiceCombosData, undefined>;
}
export const listMyServiceCombosRef: ListMyServiceCombosRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyServiceCombos(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyServiceCombosData, undefined>;

interface ListMyServiceCombosRef {
  ...
  (dc: DataConnect): QueryRef<ListMyServiceCombosData, undefined>;
}
export const listMyServiceCombosRef: ListMyServiceCombosRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyServiceCombosRef:
```typescript
const name = listMyServiceCombosRef.operationName;
console.log(name);
```

### Variables
The `ListMyServiceCombos` query has no variables.
### Return Type
Recall that executing the `ListMyServiceCombos` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyServiceCombosData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListMyServiceCombos`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyServiceCombos } from '@soloist/dataconnect';


// Call the `listMyServiceCombos()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyServiceCombos();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyServiceCombos(dataConnect);

console.log(data.serviceCombos);

// Or, you can use the `Promise` API.
listMyServiceCombos().then((response) => {
  const data = response.data;
  console.log(data.serviceCombos);
});
```

### Using `ListMyServiceCombos`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyServiceCombosRef } from '@soloist/dataconnect';


// Call the `listMyServiceCombosRef()` function to get a reference to the query.
const ref = listMyServiceCombosRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyServiceCombosRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.serviceCombos);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceCombos);
});
```

## ListMyClients
You can execute the `ListMyClients` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
listMyClients(vars?: ListMyClientsVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyClientsData, ListMyClientsVariables>;

interface ListMyClientsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListMyClientsVariables): QueryRef<ListMyClientsData, ListMyClientsVariables>;
}
export const listMyClientsRef: ListMyClientsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyClients(dc: DataConnect, vars?: ListMyClientsVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyClientsData, ListMyClientsVariables>;

interface ListMyClientsRef {
  ...
  (dc: DataConnect, vars?: ListMyClientsVariables): QueryRef<ListMyClientsData, ListMyClientsVariables>;
}
export const listMyClientsRef: ListMyClientsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyClientsRef:
```typescript
const name = listMyClientsRef.operationName;
console.log(name);
```

### Variables
The `ListMyClients` query has an optional argument of type `ListMyClientsVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListMyClientsVariables {
  status?: string | null;
}
```
### Return Type
Recall that executing the `ListMyClients` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyClientsData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListMyClients`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyClients, ListMyClientsVariables } from '@soloist/dataconnect';

// The `ListMyClients` query has an optional argument of type `ListMyClientsVariables`:
const listMyClientsVars: ListMyClientsVariables = {
  status: ..., // optional
};

// Call the `listMyClients()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyClients(listMyClientsVars);
// Variables can be defined inline as well.
const { data } = await listMyClients({ status: ..., });
// Since all variables are optional for this query, you can omit the `ListMyClientsVariables` argument.
const { data } = await listMyClients();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyClients(dataConnect, listMyClientsVars);

console.log(data.clients);

// Or, you can use the `Promise` API.
listMyClients(listMyClientsVars).then((response) => {
  const data = response.data;
  console.log(data.clients);
});
```

### Using `ListMyClients`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyClientsRef, ListMyClientsVariables } from '@soloist/dataconnect';

// The `ListMyClients` query has an optional argument of type `ListMyClientsVariables`:
const listMyClientsVars: ListMyClientsVariables = {
  status: ..., // optional
};

// Call the `listMyClientsRef()` function to get a reference to the query.
const ref = listMyClientsRef(listMyClientsVars);
// Variables can be defined inline as well.
const ref = listMyClientsRef({ status: ..., });
// Since all variables are optional for this query, you can omit the `ListMyClientsVariables` argument.
const ref = listMyClientsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyClientsRef(dataConnect, listMyClientsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.clients);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.clients);
});
```

## ListMyProjects
You can execute the `ListMyProjects` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
listMyProjects(vars?: ListMyProjectsVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyProjectsData, ListMyProjectsVariables>;

interface ListMyProjectsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListMyProjectsVariables): QueryRef<ListMyProjectsData, ListMyProjectsVariables>;
}
export const listMyProjectsRef: ListMyProjectsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyProjects(dc: DataConnect, vars?: ListMyProjectsVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyProjectsData, ListMyProjectsVariables>;

interface ListMyProjectsRef {
  ...
  (dc: DataConnect, vars?: ListMyProjectsVariables): QueryRef<ListMyProjectsData, ListMyProjectsVariables>;
}
export const listMyProjectsRef: ListMyProjectsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyProjectsRef:
```typescript
const name = listMyProjectsRef.operationName;
console.log(name);
```

### Variables
The `ListMyProjects` query has an optional argument of type `ListMyProjectsVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListMyProjectsVariables {
  status?: string | null;
}
```
### Return Type
Recall that executing the `ListMyProjects` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyProjectsData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListMyProjects`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyProjects, ListMyProjectsVariables } from '@soloist/dataconnect';

// The `ListMyProjects` query has an optional argument of type `ListMyProjectsVariables`:
const listMyProjectsVars: ListMyProjectsVariables = {
  status: ..., // optional
};

// Call the `listMyProjects()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyProjects(listMyProjectsVars);
// Variables can be defined inline as well.
const { data } = await listMyProjects({ status: ..., });
// Since all variables are optional for this query, you can omit the `ListMyProjectsVariables` argument.
const { data } = await listMyProjects();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyProjects(dataConnect, listMyProjectsVars);

console.log(data.projects);

// Or, you can use the `Promise` API.
listMyProjects(listMyProjectsVars).then((response) => {
  const data = response.data;
  console.log(data.projects);
});
```

### Using `ListMyProjects`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyProjectsRef, ListMyProjectsVariables } from '@soloist/dataconnect';

// The `ListMyProjects` query has an optional argument of type `ListMyProjectsVariables`:
const listMyProjectsVars: ListMyProjectsVariables = {
  status: ..., // optional
};

// Call the `listMyProjectsRef()` function to get a reference to the query.
const ref = listMyProjectsRef(listMyProjectsVars);
// Variables can be defined inline as well.
const ref = listMyProjectsRef({ status: ..., });
// Since all variables are optional for this query, you can omit the `ListMyProjectsVariables` argument.
const ref = listMyProjectsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyProjectsRef(dataConnect, listMyProjectsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.projects);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.projects);
});
```

## ListMyEmailTemplates
You can execute the `ListMyEmailTemplates` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
listMyEmailTemplates(vars?: ListMyEmailTemplatesVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyEmailTemplatesData, ListMyEmailTemplatesVariables>;

interface ListMyEmailTemplatesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListMyEmailTemplatesVariables): QueryRef<ListMyEmailTemplatesData, ListMyEmailTemplatesVariables>;
}
export const listMyEmailTemplatesRef: ListMyEmailTemplatesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyEmailTemplates(dc: DataConnect, vars?: ListMyEmailTemplatesVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyEmailTemplatesData, ListMyEmailTemplatesVariables>;

interface ListMyEmailTemplatesRef {
  ...
  (dc: DataConnect, vars?: ListMyEmailTemplatesVariables): QueryRef<ListMyEmailTemplatesData, ListMyEmailTemplatesVariables>;
}
export const listMyEmailTemplatesRef: ListMyEmailTemplatesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyEmailTemplatesRef:
```typescript
const name = listMyEmailTemplatesRef.operationName;
console.log(name);
```

### Variables
The `ListMyEmailTemplates` query has an optional argument of type `ListMyEmailTemplatesVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListMyEmailTemplatesVariables {
  category?: string | null;
}
```
### Return Type
Recall that executing the `ListMyEmailTemplates` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyEmailTemplatesData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListMyEmailTemplates`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyEmailTemplates, ListMyEmailTemplatesVariables } from '@soloist/dataconnect';

// The `ListMyEmailTemplates` query has an optional argument of type `ListMyEmailTemplatesVariables`:
const listMyEmailTemplatesVars: ListMyEmailTemplatesVariables = {
  category: ..., // optional
};

// Call the `listMyEmailTemplates()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyEmailTemplates(listMyEmailTemplatesVars);
// Variables can be defined inline as well.
const { data } = await listMyEmailTemplates({ category: ..., });
// Since all variables are optional for this query, you can omit the `ListMyEmailTemplatesVariables` argument.
const { data } = await listMyEmailTemplates();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyEmailTemplates(dataConnect, listMyEmailTemplatesVars);

console.log(data.emailTemplates);

// Or, you can use the `Promise` API.
listMyEmailTemplates(listMyEmailTemplatesVars).then((response) => {
  const data = response.data;
  console.log(data.emailTemplates);
});
```

### Using `ListMyEmailTemplates`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyEmailTemplatesRef, ListMyEmailTemplatesVariables } from '@soloist/dataconnect';

// The `ListMyEmailTemplates` query has an optional argument of type `ListMyEmailTemplatesVariables`:
const listMyEmailTemplatesVars: ListMyEmailTemplatesVariables = {
  category: ..., // optional
};

// Call the `listMyEmailTemplatesRef()` function to get a reference to the query.
const ref = listMyEmailTemplatesRef(listMyEmailTemplatesVars);
// Variables can be defined inline as well.
const ref = listMyEmailTemplatesRef({ category: ..., });
// Since all variables are optional for this query, you can omit the `ListMyEmailTemplatesVariables` argument.
const ref = listMyEmailTemplatesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyEmailTemplatesRef(dataConnect, listMyEmailTemplatesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.emailTemplates);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.emailTemplates);
});
```

## ListMySentEmails
You can execute the `ListMySentEmails` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
listMySentEmails(options?: ExecuteQueryOptions): QueryPromise<ListMySentEmailsData, undefined>;

interface ListMySentEmailsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMySentEmailsData, undefined>;
}
export const listMySentEmailsRef: ListMySentEmailsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMySentEmails(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMySentEmailsData, undefined>;

interface ListMySentEmailsRef {
  ...
  (dc: DataConnect): QueryRef<ListMySentEmailsData, undefined>;
}
export const listMySentEmailsRef: ListMySentEmailsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMySentEmailsRef:
```typescript
const name = listMySentEmailsRef.operationName;
console.log(name);
```

### Variables
The `ListMySentEmails` query has no variables.
### Return Type
Recall that executing the `ListMySentEmails` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMySentEmailsData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListMySentEmails`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMySentEmails } from '@soloist/dataconnect';


// Call the `listMySentEmails()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMySentEmails();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMySentEmails(dataConnect);

console.log(data.sentEmails);

// Or, you can use the `Promise` API.
listMySentEmails().then((response) => {
  const data = response.data;
  console.log(data.sentEmails);
});
```

### Using `ListMySentEmails`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMySentEmailsRef } from '@soloist/dataconnect';


// Call the `listMySentEmailsRef()` function to get a reference to the query.
const ref = listMySentEmailsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMySentEmailsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.sentEmails);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.sentEmails);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `soloist-connector` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpsertMySettings
You can execute the `UpsertMySettings` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
upsertMySettings(vars: UpsertMySettingsVariables): MutationPromise<UpsertMySettingsData, UpsertMySettingsVariables>;

interface UpsertMySettingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertMySettingsVariables): MutationRef<UpsertMySettingsData, UpsertMySettingsVariables>;
}
export const upsertMySettingsRef: UpsertMySettingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertMySettings(dc: DataConnect, vars: UpsertMySettingsVariables): MutationPromise<UpsertMySettingsData, UpsertMySettingsVariables>;

interface UpsertMySettingsRef {
  ...
  (dc: DataConnect, vars: UpsertMySettingsVariables): MutationRef<UpsertMySettingsData, UpsertMySettingsVariables>;
}
export const upsertMySettingsRef: UpsertMySettingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertMySettingsRef:
```typescript
const name = upsertMySettingsRef.operationName;
console.log(name);
```

### Variables
The `UpsertMySettings` mutation requires an argument of type `UpsertMySettingsVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertMySettings` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertMySettingsData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertMySettingsData {
  user_upsert: User_Key;
}
```
### Using `UpsertMySettings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertMySettings, UpsertMySettingsVariables } from '@soloist/dataconnect';

// The `UpsertMySettings` mutation requires an argument of type `UpsertMySettingsVariables`:
const upsertMySettingsVars: UpsertMySettingsVariables = {
  email: ..., 
  userName: ..., 
  studioName: ..., 
  theme: ..., 
  defaultLocality: ..., 
  proposalValidityDays: ..., 
  monthlyFixedCosts: ..., 
  desiredMonthlySalary: ..., 
  productiveHoursPerMonth: ..., 
  defaultProfitMargin: ..., 
  defaultComboDiscount: ..., 
  urgencyUrgentMultiplier: ..., 
  complexityMediumMultiplier: ..., 
  complexityHighMultiplier: ..., 
  segmentSmallBizMultiplier: ..., 
  segmentLargeBizMultiplier: ..., 
  extraRevisionRatePercent: ..., 
  defaultProjectStatus: ..., 
  defaultRevisionsIncluded: ..., 
  autoClassifyClientTicket: ..., 
  premiumTicketThreshold: ..., 
};

// Call the `upsertMySettings()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertMySettings(upsertMySettingsVars);
// Variables can be defined inline as well.
const { data } = await upsertMySettings({ email: ..., userName: ..., studioName: ..., theme: ..., defaultLocality: ..., proposalValidityDays: ..., monthlyFixedCosts: ..., desiredMonthlySalary: ..., productiveHoursPerMonth: ..., defaultProfitMargin: ..., defaultComboDiscount: ..., urgencyUrgentMultiplier: ..., complexityMediumMultiplier: ..., complexityHighMultiplier: ..., segmentSmallBizMultiplier: ..., segmentLargeBizMultiplier: ..., extraRevisionRatePercent: ..., defaultProjectStatus: ..., defaultRevisionsIncluded: ..., autoClassifyClientTicket: ..., premiumTicketThreshold: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertMySettings(dataConnect, upsertMySettingsVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertMySettings(upsertMySettingsVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpsertMySettings`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertMySettingsRef, UpsertMySettingsVariables } from '@soloist/dataconnect';

// The `UpsertMySettings` mutation requires an argument of type `UpsertMySettingsVariables`:
const upsertMySettingsVars: UpsertMySettingsVariables = {
  email: ..., 
  userName: ..., 
  studioName: ..., 
  theme: ..., 
  defaultLocality: ..., 
  proposalValidityDays: ..., 
  monthlyFixedCosts: ..., 
  desiredMonthlySalary: ..., 
  productiveHoursPerMonth: ..., 
  defaultProfitMargin: ..., 
  defaultComboDiscount: ..., 
  urgencyUrgentMultiplier: ..., 
  complexityMediumMultiplier: ..., 
  complexityHighMultiplier: ..., 
  segmentSmallBizMultiplier: ..., 
  segmentLargeBizMultiplier: ..., 
  extraRevisionRatePercent: ..., 
  defaultProjectStatus: ..., 
  defaultRevisionsIncluded: ..., 
  autoClassifyClientTicket: ..., 
  premiumTicketThreshold: ..., 
};

// Call the `upsertMySettingsRef()` function to get a reference to the mutation.
const ref = upsertMySettingsRef(upsertMySettingsVars);
// Variables can be defined inline as well.
const ref = upsertMySettingsRef({ email: ..., userName: ..., studioName: ..., theme: ..., defaultLocality: ..., proposalValidityDays: ..., monthlyFixedCosts: ..., desiredMonthlySalary: ..., productiveHoursPerMonth: ..., defaultProfitMargin: ..., defaultComboDiscount: ..., urgencyUrgentMultiplier: ..., complexityMediumMultiplier: ..., complexityHighMultiplier: ..., segmentSmallBizMultiplier: ..., segmentLargeBizMultiplier: ..., extraRevisionRatePercent: ..., defaultProjectStatus: ..., defaultRevisionsIncluded: ..., autoClassifyClientTicket: ..., premiumTicketThreshold: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertMySettingsRef(dataConnect, upsertMySettingsVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## CreateCatalogService
You can execute the `CreateCatalogService` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
createCatalogService(vars: CreateCatalogServiceVariables): MutationPromise<CreateCatalogServiceData, CreateCatalogServiceVariables>;

interface CreateCatalogServiceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCatalogServiceVariables): MutationRef<CreateCatalogServiceData, CreateCatalogServiceVariables>;
}
export const createCatalogServiceRef: CreateCatalogServiceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCatalogService(dc: DataConnect, vars: CreateCatalogServiceVariables): MutationPromise<CreateCatalogServiceData, CreateCatalogServiceVariables>;

interface CreateCatalogServiceRef {
  ...
  (dc: DataConnect, vars: CreateCatalogServiceVariables): MutationRef<CreateCatalogServiceData, CreateCatalogServiceVariables>;
}
export const createCatalogServiceRef: CreateCatalogServiceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCatalogServiceRef:
```typescript
const name = createCatalogServiceRef.operationName;
console.log(name);
```

### Variables
The `CreateCatalogService` mutation requires an argument of type `CreateCatalogServiceVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCatalogServiceVariables {
  title: string;
  description: string;
  category: string;
  price: number;
  estimatedHours: number;
  revisionsIncluded: number;
  complexity: string;
}
```
### Return Type
Recall that executing the `CreateCatalogService` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCatalogServiceData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCatalogServiceData {
  catalogService_insert: CatalogService_Key;
}
```
### Using `CreateCatalogService`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCatalogService, CreateCatalogServiceVariables } from '@soloist/dataconnect';

// The `CreateCatalogService` mutation requires an argument of type `CreateCatalogServiceVariables`:
const createCatalogServiceVars: CreateCatalogServiceVariables = {
  title: ..., 
  description: ..., 
  category: ..., 
  price: ..., 
  estimatedHours: ..., 
  revisionsIncluded: ..., 
  complexity: ..., 
};

// Call the `createCatalogService()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCatalogService(createCatalogServiceVars);
// Variables can be defined inline as well.
const { data } = await createCatalogService({ title: ..., description: ..., category: ..., price: ..., estimatedHours: ..., revisionsIncluded: ..., complexity: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCatalogService(dataConnect, createCatalogServiceVars);

console.log(data.catalogService_insert);

// Or, you can use the `Promise` API.
createCatalogService(createCatalogServiceVars).then((response) => {
  const data = response.data;
  console.log(data.catalogService_insert);
});
```

### Using `CreateCatalogService`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCatalogServiceRef, CreateCatalogServiceVariables } from '@soloist/dataconnect';

// The `CreateCatalogService` mutation requires an argument of type `CreateCatalogServiceVariables`:
const createCatalogServiceVars: CreateCatalogServiceVariables = {
  title: ..., 
  description: ..., 
  category: ..., 
  price: ..., 
  estimatedHours: ..., 
  revisionsIncluded: ..., 
  complexity: ..., 
};

// Call the `createCatalogServiceRef()` function to get a reference to the mutation.
const ref = createCatalogServiceRef(createCatalogServiceVars);
// Variables can be defined inline as well.
const ref = createCatalogServiceRef({ title: ..., description: ..., category: ..., price: ..., estimatedHours: ..., revisionsIncluded: ..., complexity: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCatalogServiceRef(dataConnect, createCatalogServiceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.catalogService_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.catalogService_insert);
});
```

## IncrementServiceDemand
You can execute the `IncrementServiceDemand` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
incrementServiceDemand(vars: IncrementServiceDemandVariables): MutationPromise<IncrementServiceDemandData, IncrementServiceDemandVariables>;

interface IncrementServiceDemandRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: IncrementServiceDemandVariables): MutationRef<IncrementServiceDemandData, IncrementServiceDemandVariables>;
}
export const incrementServiceDemandRef: IncrementServiceDemandRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
incrementServiceDemand(dc: DataConnect, vars: IncrementServiceDemandVariables): MutationPromise<IncrementServiceDemandData, IncrementServiceDemandVariables>;

interface IncrementServiceDemandRef {
  ...
  (dc: DataConnect, vars: IncrementServiceDemandVariables): MutationRef<IncrementServiceDemandData, IncrementServiceDemandVariables>;
}
export const incrementServiceDemandRef: IncrementServiceDemandRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the incrementServiceDemandRef:
```typescript
const name = incrementServiceDemandRef.operationName;
console.log(name);
```

### Variables
The `IncrementServiceDemand` mutation requires an argument of type `IncrementServiceDemandVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface IncrementServiceDemandVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `IncrementServiceDemand` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `IncrementServiceDemandData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface IncrementServiceDemandData {
  catalogService_update?: CatalogService_Key | null;
}
```
### Using `IncrementServiceDemand`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, incrementServiceDemand, IncrementServiceDemandVariables } from '@soloist/dataconnect';

// The `IncrementServiceDemand` mutation requires an argument of type `IncrementServiceDemandVariables`:
const incrementServiceDemandVars: IncrementServiceDemandVariables = {
  id: ..., 
};

// Call the `incrementServiceDemand()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await incrementServiceDemand(incrementServiceDemandVars);
// Variables can be defined inline as well.
const { data } = await incrementServiceDemand({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await incrementServiceDemand(dataConnect, incrementServiceDemandVars);

console.log(data.catalogService_update);

// Or, you can use the `Promise` API.
incrementServiceDemand(incrementServiceDemandVars).then((response) => {
  const data = response.data;
  console.log(data.catalogService_update);
});
```

### Using `IncrementServiceDemand`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, incrementServiceDemandRef, IncrementServiceDemandVariables } from '@soloist/dataconnect';

// The `IncrementServiceDemand` mutation requires an argument of type `IncrementServiceDemandVariables`:
const incrementServiceDemandVars: IncrementServiceDemandVariables = {
  id: ..., 
};

// Call the `incrementServiceDemandRef()` function to get a reference to the mutation.
const ref = incrementServiceDemandRef(incrementServiceDemandVars);
// Variables can be defined inline as well.
const ref = incrementServiceDemandRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = incrementServiceDemandRef(dataConnect, incrementServiceDemandVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.catalogService_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.catalogService_update);
});
```

## CreateClient
You can execute the `CreateClient` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
createClient(vars: CreateClientVariables): MutationPromise<CreateClientData, CreateClientVariables>;

interface CreateClientRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateClientVariables): MutationRef<CreateClientData, CreateClientVariables>;
}
export const createClientRef: CreateClientRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createClient(dc: DataConnect, vars: CreateClientVariables): MutationPromise<CreateClientData, CreateClientVariables>;

interface CreateClientRef {
  ...
  (dc: DataConnect, vars: CreateClientVariables): MutationRef<CreateClientData, CreateClientVariables>;
}
export const createClientRef: CreateClientRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createClientRef:
```typescript
const name = createClientRef.operationName;
console.log(name);
```

### Variables
The `CreateClient` mutation requires an argument of type `CreateClientVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateClientVariables {
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  ticket: string;
  status: string;
  lastContact?: string | null;
}
```
### Return Type
Recall that executing the `CreateClient` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateClientData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateClientData {
  client_insert: Client_Key;
}
```
### Using `CreateClient`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createClient, CreateClientVariables } from '@soloist/dataconnect';

// The `CreateClient` mutation requires an argument of type `CreateClientVariables`:
const createClientVars: CreateClientVariables = {
  name: ..., 
  company: ..., // optional
  email: ..., 
  phone: ..., // optional
  ticket: ..., 
  status: ..., 
  lastContact: ..., // optional
};

// Call the `createClient()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createClient(createClientVars);
// Variables can be defined inline as well.
const { data } = await createClient({ name: ..., company: ..., email: ..., phone: ..., ticket: ..., status: ..., lastContact: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createClient(dataConnect, createClientVars);

console.log(data.client_insert);

// Or, you can use the `Promise` API.
createClient(createClientVars).then((response) => {
  const data = response.data;
  console.log(data.client_insert);
});
```

### Using `CreateClient`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createClientRef, CreateClientVariables } from '@soloist/dataconnect';

// The `CreateClient` mutation requires an argument of type `CreateClientVariables`:
const createClientVars: CreateClientVariables = {
  name: ..., 
  company: ..., // optional
  email: ..., 
  phone: ..., // optional
  ticket: ..., 
  status: ..., 
  lastContact: ..., // optional
};

// Call the `createClientRef()` function to get a reference to the mutation.
const ref = createClientRef(createClientVars);
// Variables can be defined inline as well.
const ref = createClientRef({ name: ..., company: ..., email: ..., phone: ..., ticket: ..., status: ..., lastContact: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createClientRef(dataConnect, createClientVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.client_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.client_insert);
});
```

## UpdateClientStatus
You can execute the `UpdateClientStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
updateClientStatus(vars: UpdateClientStatusVariables): MutationPromise<UpdateClientStatusData, UpdateClientStatusVariables>;

interface UpdateClientStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateClientStatusVariables): MutationRef<UpdateClientStatusData, UpdateClientStatusVariables>;
}
export const updateClientStatusRef: UpdateClientStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateClientStatus(dc: DataConnect, vars: UpdateClientStatusVariables): MutationPromise<UpdateClientStatusData, UpdateClientStatusVariables>;

interface UpdateClientStatusRef {
  ...
  (dc: DataConnect, vars: UpdateClientStatusVariables): MutationRef<UpdateClientStatusData, UpdateClientStatusVariables>;
}
export const updateClientStatusRef: UpdateClientStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateClientStatusRef:
```typescript
const name = updateClientStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateClientStatus` mutation requires an argument of type `UpdateClientStatusVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateClientStatusVariables {
  id: UUIDString;
  status: string;
  ticket?: string | null;
  lastContact?: string | null;
}
```
### Return Type
Recall that executing the `UpdateClientStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateClientStatusData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateClientStatusData {
  client_update?: Client_Key | null;
}
```
### Using `UpdateClientStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateClientStatus, UpdateClientStatusVariables } from '@soloist/dataconnect';

// The `UpdateClientStatus` mutation requires an argument of type `UpdateClientStatusVariables`:
const updateClientStatusVars: UpdateClientStatusVariables = {
  id: ..., 
  status: ..., 
  ticket: ..., // optional
  lastContact: ..., // optional
};

// Call the `updateClientStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateClientStatus(updateClientStatusVars);
// Variables can be defined inline as well.
const { data } = await updateClientStatus({ id: ..., status: ..., ticket: ..., lastContact: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateClientStatus(dataConnect, updateClientStatusVars);

console.log(data.client_update);

// Or, you can use the `Promise` API.
updateClientStatus(updateClientStatusVars).then((response) => {
  const data = response.data;
  console.log(data.client_update);
});
```

### Using `UpdateClientStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateClientStatusRef, UpdateClientStatusVariables } from '@soloist/dataconnect';

// The `UpdateClientStatus` mutation requires an argument of type `UpdateClientStatusVariables`:
const updateClientStatusVars: UpdateClientStatusVariables = {
  id: ..., 
  status: ..., 
  ticket: ..., // optional
  lastContact: ..., // optional
};

// Call the `updateClientStatusRef()` function to get a reference to the mutation.
const ref = updateClientStatusRef(updateClientStatusVars);
// Variables can be defined inline as well.
const ref = updateClientStatusRef({ id: ..., status: ..., ticket: ..., lastContact: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateClientStatusRef(dataConnect, updateClientStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.client_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.client_update);
});
```

## CreateProject
You can execute the `CreateProject` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
createProject(vars: CreateProjectVariables): MutationPromise<CreateProjectData, CreateProjectVariables>;

interface CreateProjectRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProjectVariables): MutationRef<CreateProjectData, CreateProjectVariables>;
}
export const createProjectRef: CreateProjectRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createProject(dc: DataConnect, vars: CreateProjectVariables): MutationPromise<CreateProjectData, CreateProjectVariables>;

interface CreateProjectRef {
  ...
  (dc: DataConnect, vars: CreateProjectVariables): MutationRef<CreateProjectData, CreateProjectVariables>;
}
export const createProjectRef: CreateProjectRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createProjectRef:
```typescript
const name = createProjectRef.operationName;
console.log(name);
```

### Variables
The `CreateProject` mutation requires an argument of type `CreateProjectVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateProjectVariables {
  name: string;
  clientId?: UUIDString | null;
  clientName: string;
  status: string;
  type: string;
  value: number;
  isPaid?: boolean | null;
}
```
### Return Type
Recall that executing the `CreateProject` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateProjectData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateProjectData {
  project_insert: Project_Key;
}
```
### Using `CreateProject`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createProject, CreateProjectVariables } from '@soloist/dataconnect';

// The `CreateProject` mutation requires an argument of type `CreateProjectVariables`:
const createProjectVars: CreateProjectVariables = {
  name: ..., 
  clientId: ..., // optional
  clientName: ..., 
  status: ..., 
  type: ..., 
  value: ..., 
  isPaid: ..., // optional
};

// Call the `createProject()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createProject(createProjectVars);
// Variables can be defined inline as well.
const { data } = await createProject({ name: ..., clientId: ..., clientName: ..., status: ..., type: ..., value: ..., isPaid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createProject(dataConnect, createProjectVars);

console.log(data.project_insert);

// Or, you can use the `Promise` API.
createProject(createProjectVars).then((response) => {
  const data = response.data;
  console.log(data.project_insert);
});
```

### Using `CreateProject`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createProjectRef, CreateProjectVariables } from '@soloist/dataconnect';

// The `CreateProject` mutation requires an argument of type `CreateProjectVariables`:
const createProjectVars: CreateProjectVariables = {
  name: ..., 
  clientId: ..., // optional
  clientName: ..., 
  status: ..., 
  type: ..., 
  value: ..., 
  isPaid: ..., // optional
};

// Call the `createProjectRef()` function to get a reference to the mutation.
const ref = createProjectRef(createProjectVars);
// Variables can be defined inline as well.
const ref = createProjectRef({ name: ..., clientId: ..., clientName: ..., status: ..., type: ..., value: ..., isPaid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createProjectRef(dataConnect, createProjectVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.project_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.project_insert);
});
```

## UpdateProjectKanban
You can execute the `UpdateProjectKanban` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
updateProjectKanban(vars: UpdateProjectKanbanVariables): MutationPromise<UpdateProjectKanbanData, UpdateProjectKanbanVariables>;

interface UpdateProjectKanbanRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProjectKanbanVariables): MutationRef<UpdateProjectKanbanData, UpdateProjectKanbanVariables>;
}
export const updateProjectKanbanRef: UpdateProjectKanbanRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateProjectKanban(dc: DataConnect, vars: UpdateProjectKanbanVariables): MutationPromise<UpdateProjectKanbanData, UpdateProjectKanbanVariables>;

interface UpdateProjectKanbanRef {
  ...
  (dc: DataConnect, vars: UpdateProjectKanbanVariables): MutationRef<UpdateProjectKanbanData, UpdateProjectKanbanVariables>;
}
export const updateProjectKanbanRef: UpdateProjectKanbanRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateProjectKanbanRef:
```typescript
const name = updateProjectKanbanRef.operationName;
console.log(name);
```

### Variables
The `UpdateProjectKanban` mutation requires an argument of type `UpdateProjectKanbanVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateProjectKanbanVariables {
  id: UUIDString;
  status?: string | null;
  isPaid?: boolean | null;
}
```
### Return Type
Recall that executing the `UpdateProjectKanban` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateProjectKanbanData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateProjectKanbanData {
  project_update?: Project_Key | null;
}
```
### Using `UpdateProjectKanban`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateProjectKanban, UpdateProjectKanbanVariables } from '@soloist/dataconnect';

// The `UpdateProjectKanban` mutation requires an argument of type `UpdateProjectKanbanVariables`:
const updateProjectKanbanVars: UpdateProjectKanbanVariables = {
  id: ..., 
  status: ..., // optional
  isPaid: ..., // optional
};

// Call the `updateProjectKanban()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateProjectKanban(updateProjectKanbanVars);
// Variables can be defined inline as well.
const { data } = await updateProjectKanban({ id: ..., status: ..., isPaid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateProjectKanban(dataConnect, updateProjectKanbanVars);

console.log(data.project_update);

// Or, you can use the `Promise` API.
updateProjectKanban(updateProjectKanbanVars).then((response) => {
  const data = response.data;
  console.log(data.project_update);
});
```

### Using `UpdateProjectKanban`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateProjectKanbanRef, UpdateProjectKanbanVariables } from '@soloist/dataconnect';

// The `UpdateProjectKanban` mutation requires an argument of type `UpdateProjectKanbanVariables`:
const updateProjectKanbanVars: UpdateProjectKanbanVariables = {
  id: ..., 
  status: ..., // optional
  isPaid: ..., // optional
};

// Call the `updateProjectKanbanRef()` function to get a reference to the mutation.
const ref = updateProjectKanbanRef(updateProjectKanbanVars);
// Variables can be defined inline as well.
const ref = updateProjectKanbanRef({ id: ..., status: ..., isPaid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateProjectKanbanRef(dataConnect, updateProjectKanbanVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.project_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.project_update);
});
```

## CloseComboOrderTransaction
You can execute the `CloseComboOrderTransaction` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
closeComboOrderTransaction(vars: CloseComboOrderTransactionVariables): MutationPromise<CloseComboOrderTransactionData, CloseComboOrderTransactionVariables>;

interface CloseComboOrderTransactionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CloseComboOrderTransactionVariables): MutationRef<CloseComboOrderTransactionData, CloseComboOrderTransactionVariables>;
}
export const closeComboOrderTransactionRef: CloseComboOrderTransactionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
closeComboOrderTransaction(dc: DataConnect, vars: CloseComboOrderTransactionVariables): MutationPromise<CloseComboOrderTransactionData, CloseComboOrderTransactionVariables>;

interface CloseComboOrderTransactionRef {
  ...
  (dc: DataConnect, vars: CloseComboOrderTransactionVariables): MutationRef<CloseComboOrderTransactionData, CloseComboOrderTransactionVariables>;
}
export const closeComboOrderTransactionRef: CloseComboOrderTransactionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the closeComboOrderTransactionRef:
```typescript
const name = closeComboOrderTransactionRef.operationName;
console.log(name);
```

### Variables
The `CloseComboOrderTransaction` mutation requires an argument of type `CloseComboOrderTransactionVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CloseComboOrderTransaction` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CloseComboOrderTransactionData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CloseComboOrderTransactionData {
  client_insert: Client_Key;
  project_insert: Project_Key;
  serviceCombo_insert: ServiceCombo_Key;
}
```
### Using `CloseComboOrderTransaction`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, closeComboOrderTransaction, CloseComboOrderTransactionVariables } from '@soloist/dataconnect';

// The `CloseComboOrderTransaction` mutation requires an argument of type `CloseComboOrderTransactionVariables`:
const closeComboOrderTransactionVars: CloseComboOrderTransactionVariables = {
  clientName: ..., 
  clientCompany: ..., // optional
  clientEmail: ..., 
  clientPhone: ..., // optional
  clientTicket: ..., 
  clientStatus: ..., 
  lastContact: ..., 
  projectName: ..., 
  projectType: ..., 
  projectStatus: ..., 
  finalPrice: ..., 
  serviceTitles: ..., 
  discountPercent: ..., 
  totalHours: ..., 
  totalRevisions: ..., 
};

// Call the `closeComboOrderTransaction()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await closeComboOrderTransaction(closeComboOrderTransactionVars);
// Variables can be defined inline as well.
const { data } = await closeComboOrderTransaction({ clientName: ..., clientCompany: ..., clientEmail: ..., clientPhone: ..., clientTicket: ..., clientStatus: ..., lastContact: ..., projectName: ..., projectType: ..., projectStatus: ..., finalPrice: ..., serviceTitles: ..., discountPercent: ..., totalHours: ..., totalRevisions: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await closeComboOrderTransaction(dataConnect, closeComboOrderTransactionVars);

console.log(data.client_insert);
console.log(data.project_insert);
console.log(data.serviceCombo_insert);

// Or, you can use the `Promise` API.
closeComboOrderTransaction(closeComboOrderTransactionVars).then((response) => {
  const data = response.data;
  console.log(data.client_insert);
  console.log(data.project_insert);
  console.log(data.serviceCombo_insert);
});
```

### Using `CloseComboOrderTransaction`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, closeComboOrderTransactionRef, CloseComboOrderTransactionVariables } from '@soloist/dataconnect';

// The `CloseComboOrderTransaction` mutation requires an argument of type `CloseComboOrderTransactionVariables`:
const closeComboOrderTransactionVars: CloseComboOrderTransactionVariables = {
  clientName: ..., 
  clientCompany: ..., // optional
  clientEmail: ..., 
  clientPhone: ..., // optional
  clientTicket: ..., 
  clientStatus: ..., 
  lastContact: ..., 
  projectName: ..., 
  projectType: ..., 
  projectStatus: ..., 
  finalPrice: ..., 
  serviceTitles: ..., 
  discountPercent: ..., 
  totalHours: ..., 
  totalRevisions: ..., 
};

// Call the `closeComboOrderTransactionRef()` function to get a reference to the mutation.
const ref = closeComboOrderTransactionRef(closeComboOrderTransactionVars);
// Variables can be defined inline as well.
const ref = closeComboOrderTransactionRef({ clientName: ..., clientCompany: ..., clientEmail: ..., clientPhone: ..., clientTicket: ..., clientStatus: ..., lastContact: ..., projectName: ..., projectType: ..., projectStatus: ..., finalPrice: ..., serviceTitles: ..., discountPercent: ..., totalHours: ..., totalRevisions: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = closeComboOrderTransactionRef(dataConnect, closeComboOrderTransactionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.client_insert);
console.log(data.project_insert);
console.log(data.serviceCombo_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.client_insert);
  console.log(data.project_insert);
  console.log(data.serviceCombo_insert);
});
```

## DeleteServiceCombo
You can execute the `DeleteServiceCombo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
deleteServiceCombo(vars: DeleteServiceComboVariables): MutationPromise<DeleteServiceComboData, DeleteServiceComboVariables>;

interface DeleteServiceComboRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteServiceComboVariables): MutationRef<DeleteServiceComboData, DeleteServiceComboVariables>;
}
export const deleteServiceComboRef: DeleteServiceComboRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteServiceCombo(dc: DataConnect, vars: DeleteServiceComboVariables): MutationPromise<DeleteServiceComboData, DeleteServiceComboVariables>;

interface DeleteServiceComboRef {
  ...
  (dc: DataConnect, vars: DeleteServiceComboVariables): MutationRef<DeleteServiceComboData, DeleteServiceComboVariables>;
}
export const deleteServiceComboRef: DeleteServiceComboRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteServiceComboRef:
```typescript
const name = deleteServiceComboRef.operationName;
console.log(name);
```

### Variables
The `DeleteServiceCombo` mutation requires an argument of type `DeleteServiceComboVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteServiceComboVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteServiceCombo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteServiceComboData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteServiceComboData {
  serviceCombo_delete?: ServiceCombo_Key | null;
}
```
### Using `DeleteServiceCombo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteServiceCombo, DeleteServiceComboVariables } from '@soloist/dataconnect';

// The `DeleteServiceCombo` mutation requires an argument of type `DeleteServiceComboVariables`:
const deleteServiceComboVars: DeleteServiceComboVariables = {
  id: ..., 
};

// Call the `deleteServiceCombo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteServiceCombo(deleteServiceComboVars);
// Variables can be defined inline as well.
const { data } = await deleteServiceCombo({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteServiceCombo(dataConnect, deleteServiceComboVars);

console.log(data.serviceCombo_delete);

// Or, you can use the `Promise` API.
deleteServiceCombo(deleteServiceComboVars).then((response) => {
  const data = response.data;
  console.log(data.serviceCombo_delete);
});
```

### Using `DeleteServiceCombo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteServiceComboRef, DeleteServiceComboVariables } from '@soloist/dataconnect';

// The `DeleteServiceCombo` mutation requires an argument of type `DeleteServiceComboVariables`:
const deleteServiceComboVars: DeleteServiceComboVariables = {
  id: ..., 
};

// Call the `deleteServiceComboRef()` function to get a reference to the mutation.
const ref = deleteServiceComboRef(deleteServiceComboVars);
// Variables can be defined inline as well.
const ref = deleteServiceComboRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteServiceComboRef(dataConnect, deleteServiceComboVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.serviceCombo_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceCombo_delete);
});
```

## SaveEmailTemplate
You can execute the `SaveEmailTemplate` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
saveEmailTemplate(vars: SaveEmailTemplateVariables): MutationPromise<SaveEmailTemplateData, SaveEmailTemplateVariables>;

interface SaveEmailTemplateRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SaveEmailTemplateVariables): MutationRef<SaveEmailTemplateData, SaveEmailTemplateVariables>;
}
export const saveEmailTemplateRef: SaveEmailTemplateRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
saveEmailTemplate(dc: DataConnect, vars: SaveEmailTemplateVariables): MutationPromise<SaveEmailTemplateData, SaveEmailTemplateVariables>;

interface SaveEmailTemplateRef {
  ...
  (dc: DataConnect, vars: SaveEmailTemplateVariables): MutationRef<SaveEmailTemplateData, SaveEmailTemplateVariables>;
}
export const saveEmailTemplateRef: SaveEmailTemplateRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the saveEmailTemplateRef:
```typescript
const name = saveEmailTemplateRef.operationName;
console.log(name);
```

### Variables
The `SaveEmailTemplate` mutation requires an argument of type `SaveEmailTemplateVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `SaveEmailTemplate` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SaveEmailTemplateData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SaveEmailTemplateData {
  emailTemplate_insert: EmailTemplate_Key;
}
```
### Using `SaveEmailTemplate`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, saveEmailTemplate, SaveEmailTemplateVariables } from '@soloist/dataconnect';

// The `SaveEmailTemplate` mutation requires an argument of type `SaveEmailTemplateVariables`:
const saveEmailTemplateVars: SaveEmailTemplateVariables = {
  name: ..., 
  category: ..., 
  subject: ..., 
  greeting: ..., 
  body: ..., 
  ctaLabel: ..., 
  ctaUrl: ..., 
  signature: ..., 
  visualTheme: ..., 
};

// Call the `saveEmailTemplate()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await saveEmailTemplate(saveEmailTemplateVars);
// Variables can be defined inline as well.
const { data } = await saveEmailTemplate({ name: ..., category: ..., subject: ..., greeting: ..., body: ..., ctaLabel: ..., ctaUrl: ..., signature: ..., visualTheme: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await saveEmailTemplate(dataConnect, saveEmailTemplateVars);

console.log(data.emailTemplate_insert);

// Or, you can use the `Promise` API.
saveEmailTemplate(saveEmailTemplateVars).then((response) => {
  const data = response.data;
  console.log(data.emailTemplate_insert);
});
```

### Using `SaveEmailTemplate`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, saveEmailTemplateRef, SaveEmailTemplateVariables } from '@soloist/dataconnect';

// The `SaveEmailTemplate` mutation requires an argument of type `SaveEmailTemplateVariables`:
const saveEmailTemplateVars: SaveEmailTemplateVariables = {
  name: ..., 
  category: ..., 
  subject: ..., 
  greeting: ..., 
  body: ..., 
  ctaLabel: ..., 
  ctaUrl: ..., 
  signature: ..., 
  visualTheme: ..., 
};

// Call the `saveEmailTemplateRef()` function to get a reference to the mutation.
const ref = saveEmailTemplateRef(saveEmailTemplateVars);
// Variables can be defined inline as well.
const ref = saveEmailTemplateRef({ name: ..., category: ..., subject: ..., greeting: ..., body: ..., ctaLabel: ..., ctaUrl: ..., signature: ..., visualTheme: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = saveEmailTemplateRef(dataConnect, saveEmailTemplateVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.emailTemplate_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.emailTemplate_insert);
});
```

## RecordSentEmail
You can execute the `RecordSentEmail` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
recordSentEmail(vars: RecordSentEmailVariables): MutationPromise<RecordSentEmailData, RecordSentEmailVariables>;

interface RecordSentEmailRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RecordSentEmailVariables): MutationRef<RecordSentEmailData, RecordSentEmailVariables>;
}
export const recordSentEmailRef: RecordSentEmailRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
recordSentEmail(dc: DataConnect, vars: RecordSentEmailVariables): MutationPromise<RecordSentEmailData, RecordSentEmailVariables>;

interface RecordSentEmailRef {
  ...
  (dc: DataConnect, vars: RecordSentEmailVariables): MutationRef<RecordSentEmailData, RecordSentEmailVariables>;
}
export const recordSentEmailRef: RecordSentEmailRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the recordSentEmailRef:
```typescript
const name = recordSentEmailRef.operationName;
console.log(name);
```

### Variables
The `RecordSentEmail` mutation requires an argument of type `RecordSentEmailVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `RecordSentEmail` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RecordSentEmailData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RecordSentEmailData {
  sentEmail_insert: SentEmail_Key;
}
```
### Using `RecordSentEmail`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, recordSentEmail, RecordSentEmailVariables } from '@soloist/dataconnect';

// The `RecordSentEmail` mutation requires an argument of type `RecordSentEmailVariables`:
const recordSentEmailVars: RecordSentEmailVariables = {
  clientId: ..., // optional
  projectId: ..., // optional
  templateName: ..., 
  category: ..., 
  recipientName: ..., 
  recipientEmail: ..., 
  projectName: ..., // optional
  subject: ..., 
  renderedBody: ..., 
  status: ..., 
};

// Call the `recordSentEmail()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await recordSentEmail(recordSentEmailVars);
// Variables can be defined inline as well.
const { data } = await recordSentEmail({ clientId: ..., projectId: ..., templateName: ..., category: ..., recipientName: ..., recipientEmail: ..., projectName: ..., subject: ..., renderedBody: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await recordSentEmail(dataConnect, recordSentEmailVars);

console.log(data.sentEmail_insert);

// Or, you can use the `Promise` API.
recordSentEmail(recordSentEmailVars).then((response) => {
  const data = response.data;
  console.log(data.sentEmail_insert);
});
```

### Using `RecordSentEmail`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, recordSentEmailRef, RecordSentEmailVariables } from '@soloist/dataconnect';

// The `RecordSentEmail` mutation requires an argument of type `RecordSentEmailVariables`:
const recordSentEmailVars: RecordSentEmailVariables = {
  clientId: ..., // optional
  projectId: ..., // optional
  templateName: ..., 
  category: ..., 
  recipientName: ..., 
  recipientEmail: ..., 
  projectName: ..., // optional
  subject: ..., 
  renderedBody: ..., 
  status: ..., 
};

// Call the `recordSentEmailRef()` function to get a reference to the mutation.
const ref = recordSentEmailRef(recordSentEmailVars);
// Variables can be defined inline as well.
const ref = recordSentEmailRef({ clientId: ..., projectId: ..., templateName: ..., category: ..., recipientName: ..., recipientEmail: ..., projectName: ..., subject: ..., renderedBody: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = recordSentEmailRef(dataConnect, recordSentEmailVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sentEmail_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sentEmail_insert);
});
```

