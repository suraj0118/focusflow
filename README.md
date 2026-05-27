# FocusFlow — AI-Powered Productivity Command Center

&gt; Phase 1 Complete | Backend Foundation + Auth + Socket.IO + Monorepo

## Monorepo Structure

## Quick Start

1. Install dependencies at the repo root:

```bash
npm install
```

2. Start both server and web in parallel (single command):

```bash
npm run dev
```

Alternatively run the server and web in separate terminals:

```bash
npm run dev:server
npm run dev:web
```

3. Open your browser at `http://localhost:3000` and use the demo credentials on the login screen. The app auto-loads demo data on first run.

Notes:
- This repo uses a workspace layout; run install from the repository root.
- If you prefer, run `npm run dev:web` to only run the frontend.

## Firebase Setup (optional)

1. Create a Firebase project at https://console.firebase.google.com and enable Email/Password Authentication and Firestore if desired.
2. In your project settings, find the Firebase config and set the following environment variables in a `.env` file at the repo root (Vite requires `VITE_` prefix):

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

3. Restart the dev server. The login screen will use Firebase auth when these variables are present.



## AI assistant

The AI assistant/chat feature has been removed from this repository. Ignore or remove any AI-related environment variables and configuration.

Security: rotate your key if it has been exposed and never paste keys into public chat or commit them to git.


