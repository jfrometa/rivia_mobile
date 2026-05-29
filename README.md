# rivia_mobile

A React Native / Expo mobile app for Rivia Tasaciones.

## Tech Stack
- **Framework**: React Native (via Expo SDK 51)
- **Navigation**: Expo Router
- **State Management**: Zustand
- **UI**: Custom components with React Native StyleSheet
- **Icons**: Lucide React Native
- **Package Manager**: Bun
- **Linting**: ESLint with eslint-config-expo
- **Type Checking**: TypeScript

## Getting Started

### Prerequisites
- [Bun](https://bun.sh) (for package management)
- [Expo Go app](https://expo.dev/go) (for running on your physical device)
- Xcode (for iOS simulator) or Android Studio (for Android emulator) (optional)

### Installation
1. Clone the repo:
   ```bash
   git clone git@github.com:jfrometa/rivia_mobile.git
   cd rivia_mobile
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

### Running the App

1. Start the Expo dev server:
   ```bash
   bun start
   ```

2. Follow the instructions in the terminal to run on:
   - iOS simulator (press `i`)
   - Android emulator (press `a`)
   - Physical device (scan QR code with Expo Go app)

3. Run the linter:
   ```bash
   bun run lint
   ```

4. Type check:
   ```bash
   bunx tsc --noEmit
   ```

## Database Connection (TODO)
Add your database connection details here! For example:
- Which database are you using? (PostgreSQL, Firebase, Supabase, etc.)
- Connection instructions
- Environment variables needed (create a `.env` file and add to `.gitignore`)

### Example Environment Variables
Create a `.env` file in the project root:
```env
# .env
EXPO_PUBLIC_API_URL=https://your-api-url.com
EXPO_PUBLIC_DATABASE_URL=your-db-connection-string
```
(Remember, Expo environment variables need to start with `EXPO_PUBLIC_` to be accessible in the app!)

## Project Structure
```
.
├── app/                      # Expo Router files (screens)
│   ├── _layout.tsx          # Root layout
│   ├── index.tsx            # Home screen
│   └── valuation/           # Valuation flow screens
│       ├── step3-photos.tsx
│       └── step4-review.tsx
├── src/
│   ├── components/ui/       # Reusable UI components
│   │   └── Button.tsx
│   └── features/
│       └── appraisal/       # Appraisal feature
│           └── store/
│               └── useAppraisalWizardStore.ts
├── .eslintignore
├── .eslintrc.json
├── .gitignore
├── app.json                 # Expo config
├── babel.config.js
├── bun.lockb
├── package.json
└── tsconfig.json
```
