# Rivia Tasaciones Mobile

A standalone Expo React Native mobile app for Rivia Tasaciones, designed to integrate with the existing Next.js backend.

---

## 📋 Table of Contents
1. [Project Purpose](#project-purpose)
2. [Tech Stack](#tech-stack)
3. [Architecture Overview](#architecture-overview)
4. [Feature-First Folder Structure](#feature-first-folder-structure)
5. [Data Flow Patterns](#data-flow-patterns)
6. [Appraisal Feature: Complete Example](#appraisal-feature-complete-example)
7. [Getting Started](#getting-started)
8. [Available Scripts](#available-scripts)

---

## Project Purpose

This is a separate mobile initiative. It reuses as much as possible from the existing web implementation at the integration and architecture level:
- Same backend APIs whenever possible
- Same auth concepts (token-based)
- Same feature-first folder philosophy
- Same domain naming
- Same business flows
- Same team conventions

---

## Tech Stack

### Core
- **Expo SDK 56** - Framework for React Native apps
- **React Native 0.85** - UI framework
- **TypeScript** - Strict type safety
- **Expo Router** - File-based navigation

### State Management & Data
- **Redux Toolkit + RTK Query** - Primary state management and API caching
- **TanStack Query v5** - Server state (alternative to RTK Query)
- **Zustand** - Lightweight client state for local UI state
- **Zod** - Schema validation
- **React Hook Form** - Form management
- **@hookform/resolvers** - Zod resolver for React Hook Form

### Native/Platform
- **expo-secure-store** - Secure auth token storage
- **@react-native-community/netinfo** - Network status
- **expo-sqlite** - Local SQLite database (foundation for offline support)

---

## Architecture Overview

### State Management Strategy

The project uses **multiple state management tools, each for a specific purpose**:

| Tool | Use Case | Example |
|------|----------|---------|
| **Redux Toolkit + RTK Query** | Global API state, caching, invalidation | Appraisals list, user data |
| **TanStack Query** | Server state (alternative/legacy) | Some queries may use this |
| **Zustand** | Local UI state, wizard flows | Appraisal wizard steps, photos |
| **SQLite** | Offline persistence | Draft appraisals, cached data |

### API Integration

Two approaches are available:
1. **RTK Query (Recommended)** - Built-in caching, auto-refetch, tag-based invalidation
2. **Traditional fetch client + TanStack Query** - More flexible, manual control

---

## Feature-First Folder Structure

```
src/
├── app/                          # Expo Router routes
│   ├── (auth)/                   # Auth screens
│   └── (tabs)/                   # Main tab navigator
│
├── features/                     # Feature modules (feature-first)
│   └── appraisal/                # Example: Appraisal feature
│       ├── components/           # Feature-specific components
│       ├── store/                # Zustand store for feature
│       │   └── useAppraisalWizardStore.ts
│       ├── queries.ts            # TanStack Query queries
│       ├── mutations.ts          # TanStack Query mutations
│       ├── schema.ts             # Zod validation schemas
│       ├── types.ts              # TypeScript types
│       └── mobile-mappers.ts     # Data mapping functions
│
├── components/ui/                # Reusable UI primitives
├── services/
│   ├── api/
│   │   ├── apiSlice.ts           # RTK Query API slice
│   │   ├── client.ts             # Traditional fetch client
│   │   └── appraisal.ts          # API functions for appraisals
│   ├── auth/                     # Auth logic
│   ├── db/                       # SQLite database
│   └── storage/                  # Secure storage
│
├── store/                        # Redux store configuration
│   └── index.ts
│
└── lib/                          # Utilities, constants, config
```

---

## Data Flow Patterns

### 1. RTK Query Pattern (Recommended)

**Why use this?** - Auto-caching, refetch on focus, tag-based invalidation, built-in loading/error states.

#### Step 1: Define your API slice

File: `src/services/api/apiSlice.ts`

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '../auth/auth-storage';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    const rawBaseQuery = fetchBaseQuery({
      baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
      prepareHeaders: async (headers) => {
        const token = await getAccessToken();
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
      }
    });
    return rawBaseQuery(args, api, extraOptions);
  },
  tagTypes: ['Appraisal'], // Define entity types
  endpoints: (builder) => ({
    // Define queries and mutations
    getAppraisals: builder.query<Appraisal[], void>({
      query: () => '/appraisal/list',
      providesTags: ['Appraisal'], // Tags this query provides
    }),
    getAppraisalById: builder.query<Appraisal, string>({
      query: (id) => `/appraisal/${id}`,
      providesTags: (result, error, id) => [{ type: 'Appraisal', id }],
    }),
    createAppraisal: builder.mutation<Appraisal, UpsertAppraisalSchemaType>({
      query: (appraisal) => ({
        url: '/appraisal',
        method: 'POST',
        body: appraisal,
      }),
      invalidatesTags: ['Appraisal'], // Invalidate tags on success
    }),
  }),
});

// Export auto-generated hooks
export const {
  useGetAppraisalsQuery,
  useGetAppraisalByIdQuery,
  useCreateAppraisalMutation,
} = apiSlice;
```

#### Step 2: Configure Redux store

File: `src/store/index.ts`

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { apiSlice } from '../services/api/apiSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### Step 3: Wrap your app with Provider

File: `src/app/_layout.tsx`

```typescript
import { Provider } from 'react-redux';
import { store } from '../store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Stack>
          {/* Screens */}
        </Stack>
      </AuthProvider>
    </Provider>
  );
}
```

#### Step 4: Use in components

```typescript
import { useGetAppraisalsQuery, useCreateAppraisalMutation } from '../../services/api/apiSlice';

export default function AppraisalsScreen() {
  // Query: Get appraisals
  const { data, isLoading, error, refetch } = useGetAppraisalsQuery();
  
  // Mutation: Create appraisal
  const [createAppraisal] = useCreateAppraisalMutation();

  const handleCreate = async (data) => {
    try {
      await createAppraisal(data).unwrap();
      // No need to refetch manually - invalidatesTags handles it!
    } catch (err) {
      console.error('Failed to create:', err);
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState onRetry={refetch} />;

  return <FlatList data={data} /* ... */ />;
}
```

---

### 2. TanStack Query Pattern (Alternative)

**Why use this?** - More flexibility, separate from Redux ecosystem.

#### Step 1: Define API functions

File: `src/services/api/appraisal.ts`

```typescript
import { api } from "./client";
import { Appraisal } from "../../features/appraisal/types";

export async function getAppraisals(): Promise<Appraisal[]> {
  const response = await api.get<{ data: { data: Appraisal[] } }>("/appraisal/list");
  return response.data.data;
}

export async function createAppraisal(data): Promise<Appraisal> {
  const response = await api.post<{ data: { data: Appraisal } }>("/appraisal", data);
  return response.data.data;
}
```

#### Step 2: Create query hooks

File: `src/features/appraisal/queries.ts`

```typescript
import { useQuery } from "@tanstack/react-query";
import { getAppraisals, getAppraisalById } from "../../services/api/appraisal";

export const appraisalQueryKeys = {
  all: ["appraisals"] as const,
  lists: () => [...appraisalQueryKeys.all, "list"] as const,
  details: (id: string) => [...appraisalQueryKeys.all, "detail", id] as const,
};

export function useAppraisalsQuery() {
  return useQuery({
    queryKey: appraisalQueryKeys.lists(),
    queryFn: getAppraisals,
  });
}

export function useAppraisalByIdQuery(id: string) {
  return useQuery({
    queryKey: appraisalQueryKeys.details(id),
    queryFn: () => getAppraisalById(id),
    enabled: !!id,
  });
}
```

#### Step 3: Create mutation hooks

File: `src/features/appraisal/mutations.ts`

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAppraisal } from "../../services/api/appraisal";
import { appraisalQueryKeys } from "./queries";

export function useCreateAppraisalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAppraisal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appraisalQueryKeys.lists() });
    },
  });
}
```

#### Step 4: Use in components

```typescript
import { useAppraisalsQuery } from '../../features/appraisal/queries';
import { useCreateAppraisalMutation } from '../../features/appraisal/mutations';

export default function AppraisalsScreen() {
  const { data, isLoading, error, refetch } = useAppraisalsQuery();
  const { mutate: createAppraisal } = useCreateAppraisalMutation();

  // Same usage pattern as RTK Query
}
```

---

### 3. Zustand Pattern (Local UI State)

**Why use this?** - Lightweight, no boilerplate, great for form wizards, UI flows.

#### Step 1: Create a store

File: `src/features/appraisal/store/useAppraisalWizardStore.ts`

```typescript
import { create } from 'zustand';

interface AppraisalWizardState {
  photos: string[];
  currentStepIndex: number;
  updateField: (field: string, value: any) => void;
  addPhoto: (uri: string) => void;
  nextStep: () => void;
  previousStep: () => void;
}

export const useAppraisalWizardStore = create<AppraisalWizardState>((set, get) => ({
  photos: [],
  currentStepIndex: 0,
  
  updateField: (field, value) => set((state) => ({ ...state, [field]: value })),
  
  addPhoto: (uri) => set((state) => ({ 
    photos: [...state.photos, uri] 
  })),
  
  nextStep: () => set((state) => ({ 
    currentStepIndex: Math.min(state.currentStepIndex + 1, 5) 
  })),
  
  previousStep: () => set((state) => ({ 
    currentStepIndex: Math.max(state.currentStepIndex - 1, 0) 
  })),
}));
```

#### Step 2: Use in components

```typescript
import { useAppraisalWizardStore } from '../store/useAppraisalWizardStore';

export default function AppraisalWizard() {
  const { 
    currentStepIndex, 
    photos, 
    addPhoto, 
    nextStep, 
    previousStep,
    updateField 
  } = useAppraisalWizardStore();

  return (
    <View>
      <StepIndicator current={currentStepIndex} />
      <Button title="Next" onPress={nextStep} />
      <Button title="Add Photo" onPress={() => addPhoto('uri')} />
    </View>
  );
}
```

---

### 4. SQLite Pattern (Offline Persistence)

**Why use this?** - Offline-first capabilities, caching, draft storage.

#### Step 1: Database setup

File: `src/services/db/sqlite.ts`

```typescript
import * as SQLite from "expo-sqlite";

const DB_NAME = "rivia.db";

export async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  return await SQLite.openDatabaseAsync(DB_NAME);
}

export async function initializeDatabase(): Promise<void> {
  const db = await openDatabase();
  
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS appraisal_drafts (
      id TEXT PRIMARY KEY NOT NULL,
      data TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

export async function saveAppraisalDraft(id: string, data: any): Promise<void> {
  const db = await openDatabase();
  const now = new Date().toISOString();
  
  await db.runAsync(
    `INSERT OR REPLACE INTO appraisal_drafts (id, data, created_at, updated_at)
     VALUES (?, ?, ?, ?)`,
    [id, JSON.stringify(data), now, now]
  );
}

export async function getAppraisalDraft(id: string): Promise<any | null> {
  const db = await openDatabase();
  const result = await db.getFirstAsync(
    `SELECT data FROM appraisal_drafts WHERE id = ?`,
    [id]
  );
  return result ? JSON.parse((result as any).data) : null;
}
```

---

## Appraisal Feature: Complete Example

Let's walk through the appraisal feature end-to-end.

### 1. Types & Schema

File: `src/features/appraisal/types.ts`

```typescript
import { z } from "zod";
import { AppraisalSchema, UpsertAppraisalSchema } from "./schema";

export type Appraisal = z.infer<typeof AppraisalSchema>;
export type UpsertAppraisalSchemaType = z.infer<typeof UpsertAppraisalSchema>;
```

File: `src/features/appraisal/schema.ts`

```typescript
import { z } from "zod";

export const AppraisalSchema = z.object({
  id: z.string(),
  status: z.string(),
  fields: z.any().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const UpsertAppraisalSchema = z.object({
  clientId: z.string(),
  propertyType: z.string(),
  address: z.string(),
  // Add more fields...
});
```

### 2. RTK Query Endpoints

(Already covered in apiSlice.ts above)

### 3. List Screen

File: `src/app/(tabs)/appraisal/index.tsx`

```typescript
import React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "../../../components/ui/Screen";
import { AppText } from "../../../components/ui/AppText";
import { AppButton } from "../../../components/ui/AppButton";
import { Card } from "../../../components/ui/Card";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { useGetAppraisalsQuery } from "../../../services/api/apiSlice";
import { tokens } from "../../../theme";

export default function AppraisalsScreen() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useGetAppraisalsQuery();

  if (isLoading) return <LoadingState />;
  if (error) {
    return <ErrorState message="Error loading appraisals" onRetry={refetch} />;
  }

  return (
    <Screen>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <AppText variant="2xl" weight="bold">Tasaciones</AppText>
        <AppButton
          title="Nueva"
          onPress={() => router.push("/(tabs)/appraisal/new")}
        />
      </View>

      <FlatList
        data={data || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/(tabs)/appraisal/${item.id}`)}
          >
            <Card>
              <AppText variant="lg" weight="600">ID: {item.id}</AppText>
              <AppText variant="sm">Estado: {item.status}</AppText>
              <AppText variant="xs">
                Creada: {new Date(item.createdAt).toLocaleDateString()}
              </AppText>
            </Card>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}
```

### 4. Detail Screen

File: `src/app/(tabs)/appraisal/[id].tsx`

```typescript
import React from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Screen } from "../../../components/ui/Screen";
import { AppText } from "../../../components/ui/AppText";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { useGetAppraisalByIdQuery } from "../../../services/api/apiSlice";

export default function AppraisalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: appraisal, isLoading, error, refetch } = useGetAppraisalByIdQuery(id);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState onRetry={refetch} />;
  if (!appraisal) return <AppText>No data</AppText>;

  return (
    <Screen>
      <AppText variant="2xl" weight="bold">Appraisal {appraisal.id}</AppText>
      <AppText>Status: {appraisal.status}</AppText>
      <AppText>Created: {new Date(appraisal.createdAt).toLocaleString()}</AppText>
    </Screen>
  );
}
```

### 5. Create Screen

File: `src/app/(tabs)/appraisal/new.tsx`

```typescript
import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Screen } from "../../../components/ui/Screen";
import { AppText } from "../../../components/ui/AppText";
import { AppInput } from "../../../components/ui/AppInput";
import { AppButton } from "../../../components/ui/AppButton";
import { LoadingState } from "../../../components/ui/LoadingState";
import { useCreateAppraisalMutation } from "../../../services/api/apiSlice";
import { UpsertAppraisalSchema } from "../../../features/appraisal/schema";
import { useAppraisalWizardStore } from "../../../features/appraisal/store/useAppraisalWizardStore";

export default function NewAppraisalScreen() {
  const router = useRouter();
  const { currentStepIndex, nextStep, previousStep } = useAppraisalWizardStore();
  const [createAppraisal, { isLoading }] = useCreateAppraisalMutation();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(UpsertAppraisalSchema),
    defaultValues: {
      clientId: "",
      propertyType: "",
      address: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await createAppraisal(data).unwrap();
      router.back();
    } catch (err) {
      console.error("Failed to create appraisal:", err);
    }
  };

  if (isLoading) return <LoadingState />;

  return (
    <Screen>
      <AppText variant="2xl" weight="bold">Nueva Tasación</AppText>
      
      <Controller
        control={control}
        name="address"
        render={({ field: { onChange, value } }) => (
          <AppInput
            label="Dirección"
            value={value}
            onChangeText={onChange}
            error={errors.address?.message}
          />
        )}
      />

      <AppButton title="Crear" onPress={handleSubmit(onSubmit)} />
    </Screen>
  );
}
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (package manager - do NOT use npm/pnpm)
- [Expo Go app](https://expo.dev/go) (for physical devices)
- Xcode (iOS simulator) or Android Studio (Android emulator) (optional)

### Installation

1. Install dependencies:
   ```bash
   bun install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your API URL
   ```

### Backend Dependency

This app requires the existing Next.js backend/API to be running and accessible.

### Running the App

```bash
# Start Expo dev server
bun start

# iOS simulator
bun ios

# Android emulator
bun android
```

---

## Available Scripts

```bash
bun start              # Start Expo dev server
bun start:local        # Use .env.local and start
bun start:dev          # Use .env.dev and start
bun android            # Run on Android
bun ios                # Run on iOS
bun web                # Run on web
bun ts:check           # TypeScript check
bun lint               # Run ESLint
bun lint:fix           # Fix lint issues
bun format             # Format with Prettier
bun prebuild           # Prebuild native code
```

---

## Key Conventions

1. **Feature-first**: All code related to a feature lives in `src/features/[feature-name]/`
2. **Type safety**: Use Zod for validation and infer types from schemas
3. **Use RTK Query by default**: For most API interactions
4. **Zustand for UI state**: Wizard flows, local form state
5. **SQLite for offline**: Drafts, persistent caching
6. **Never commit secrets**: Use environment variables

---

## Architecture Decisions

See table above for state management tool selection.

---

## Next Steps

1. Complete SQLite implementation for offline drafts
2. Add Sentry for error monitoring
3. Write unit tests for business logic
4. Add integration tests for critical flows
