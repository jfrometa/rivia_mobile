# Rivia Tasaciones Mobile

A standalone Expo React Native mobile app for Rivia Tasaciones, designed to integrate with the existing Next.js backend.

## Project Purpose

This is a separate mobile initiative. It reuses as much as possible from the existing web implementation at the integration and architecture level:
- Same backend APIs whenever possible
- Same auth concepts (token-based)
- Same feature-first folder philosophy
- Same TanStack Query mental model
- Same Zod + React Hook Form mental model
- Same domain naming
- Same business flows
- Same team conventions

## Goals

- Minimize new libraries
- Minimize retraining for the team
- Maintain a clean, modern, production-ready Expo React Native codebase
- Reuse existing backend APIs instead of reimplementing server logic

## Tech Stack

**Core**:
- Expo SDK 52
- React Native
- TypeScript (strict mode)
- Expo Router (file-based navigation)

**Data & Forms**:
- TanStack Query v5 (server state)
- Zod (validation)
- React Hook Form (form management)
- @hookform/resolvers

**Native/Platform**:
- expo-secure-store (secure auth token storage)
- @react-native-community/netinfo (network status)
- expo-sqlite (foundation for future local persistence)
- react-native-safe-area-context
- react-native-screens
- react-native-gesture-handler
- Lucide React Native (icons)

**Dev Tools**:
- ESLint with eslint-config-expo
- TypeScript

**Package Manager**:
- Bun (never use npm/pnpm)

## Project Structure

```
src/
├── app/                          # Expo Router routes
│   ├── _layout.tsx              # Root layout (QueryClient, AuthProvider)
│   ├── index.tsx                # Initial route (auth check)
│   ├── (auth)/                  # Auth group
│   │   ├── _layout.tsx
│   │   └── login.tsx            # Login screen
│   └── (tabs)/                  # Tab navigator group
│       ├── _layout.tsx
│       ├── dashboard.tsx        # Dashboard
│       ├── appraisal/
│       │   ├── index.tsx        # Appraisals list
│       │   └── [id].tsx         # Appraisal detail
│       ├── clients/
│       │   └── index.tsx        # Clients list
│       ├── comparison/
│       │   └── index.tsx        # Comparables list
│       ├── users/
│       │   └── index.tsx        # Users list
│       └── roles/
│           └── index.tsx        # Roles list
├── features/                     # Feature-first modules
│   ├── appraisal/
│   │   ├── components/
│   │   ├── queries/
│   │   ├── mutations/
│   │   ├── hooks/
│   │   ├── helpers/
│   │   ├── utils/
│   │   ├── schema.ts
│   │   ├── types.ts
│   │   └── mobile-mappers.ts
│   ├── client/
│   │   └── (same structure as appraisal)
│   ├── dashboard/
│   ├── review/
│   ├── role/
│   └── user/
├── components/
│   ├── ui/                      # Reusable UI primitives
│   │   ├── Screen.tsx
│   │   ├── AppText.tsx
│   │   ├── AppButton.tsx
│   │   ├── AppInput.tsx
│   │   ├── Card.tsx
│   │   ├── LoadingState.tsx
│   │   └── ErrorState.tsx
│   └── layout/
├── services/
│   ├── api/                     # API client & endpoints
│   │   ├── client.ts            # Fetch-based API client
│   │   ├── config.ts            # API config (env vars)
│   │   ├── errors.ts            # ApiError class
│   │   ├── appraisal.ts
│   │   ├── clientFeature.ts
│   │   ├── comparison.ts
│   │   ├── dashboard.ts
│   │   ├── role.ts
│   │   ├── user.ts
│   │   └── auth.ts
│   ├── auth/                    # Auth logic
│   │   ├── AuthProvider.tsx
│   │   ├── auth-storage.ts
│   │   └── session.ts
│   ├── storage/
│   │   └── secure-storage.ts
│   ├── network/
│   │   ├── netinfo.ts
│   │   └── react-query-online-manager.ts
│   └── db/
│       └── sqlite.ts            # expo-sqlite wrapper
├── hooks/
│   └── useAppState.ts
├── lib/
│   ├── query-client.ts          # TanStack Query config
│   ├── env.ts                   # Environment config & validation
│   └── constants.ts
└── theme/
    ├── tokens.ts                # Design tokens (colors, spacing, etc.)
    └── index.ts
```

## Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```env
# Backend API URL
# For physical devices, use your computer's LAN IP instead of localhost
# Example: EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:3000/api
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

**Important**:
- Expo environment variables must start with `EXPO_PUBLIC_` to be accessible in the app
- For physical devices, `localhost` won't work - use your computer's LAN IP address

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

This app requires the existing Next.js backend/API to be running and accessible. Make sure:
- The backend server is running
- The API endpoints are accessible
- CORS is configured for mobile requests (if needed)

### Auth Limitations

The existing web app uses NextAuth.js. If the current implementation depends on browser cookies only, the mobile app may require backend adaptation for token-based authentication.

**TODO items for auth**:
- Verify backend login endpoint returns access/refresh tokens
- Test token refresh flow
- Ensure API endpoints accept Bearer tokens in Authorization header

### Running the App

1. Start the Expo dev server:
   ```bash
   bun dev
   # or
   bun start
   ```

2. Follow terminal instructions to run on:
   - iOS simulator: Press `i`
   - Android emulator: Press `a`
   - Physical device: Scan QR code with Expo Go app

### Available Scripts

```bash
bun dev          # Start Expo dev server
bun start        # Same as bun dev
bun ios          # Start iOS simulator
bun android      # Start Android emulator
bun web          # Start web version
bun lint         # Run ESLint
bun type-check   # Run TypeScript type checking
```

## Architecture Notes

### What's Reused

- API contracts (endpoints, request/response shapes)
- Domain types and naming
- Zod validation schemas
- TanStack Query usage patterns
- Feature-first folder structure
- Business logic flow

### What's Not Reused Directly

- Next.js app router files
- Prisma/backend service files
- Radix UI components
- PandaCSS runtime (we use design tokens + StyleSheet instead)

## Next Steps

1. **Finalize auth integration**: Work with backend team to ensure token-based auth is working
2. **Align exact API endpoints**: Replace placeholder endpoints in `src/services/api/*.ts`
3. **Extract shared schemas**: Manually copy/align Zod schemas from web app if useful
4. **Add uploads/documents**: Implement file uploads if needed
5. **Offline drafts**: Build out expo-sqlite implementation for offline functionality later
6. **Add Sentry**: Set up error monitoring when ready
7. **Write tests**: Add unit tests for business logic, integration tests for critical paths

## Acceptance Criteria Met

✅ Standalone Expo project  
✅ No monorepo dependency  
✅ Expo Router for navigation  
✅ TanStack Query for server state  
✅ React Hook Form + Zod for forms  
✅ expo-secure-store for auth tokens  
✅ NetInfo + TanStack Query online integration  
✅ Requested folder structure  
✅ Screens: login, dashboard, appraisal list, appraisal detail, clients, comparison, users, roles  
✅ API client using `EXPO_PUBLIC_API_BASE_URL`  
✅ README with setup/run instructions  
✅ Designed to reuse existing backend APIs
