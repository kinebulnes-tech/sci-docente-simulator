# Firebase Setup — SCI Docente Simulator

## Prerequisites

- A Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
- Firestore enabled (Native mode)
- Authentication enabled with the "Anonymous" provider

## 1. Create `.env.local`

Copy `.env.example` and fill in your Firebase project credentials:

```bash
cp .env.example .env.local
```

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:...:web:...
```

If these variables are absent or empty, the app automatically falls back to
**local mode** — identical to pre-Fase 8 behavior.

## 2. Deploy Firestore security rules

```bash
firebase deploy --only firestore:rules
```

The rules file is `firestore.rules` at the project root.

## 3. Required Firestore indexes

The following composite indexes are needed for subcollection ordering:

| Collection path | Fields | Direction |
|---|---|---|
| `sessions/{id}/studentDecisions` | `minute` | Ascending |
| `sessions/{id}/instructorEvents` | `timestamp` | Ascending |

Deploy via `firebase deploy --only firestore:indexes` (add a `firestore.indexes.json`),
or create them manually in the Firestore console when prompted by the SDK.

## 4. Session flow

```
Instructor                       Student
─────────────────────────────────────────
1. Creates session               1. Receives 6-char code
2. Gets join code                2. Enters code + name
3. Picks scenario                3. Joins → same scenario starts
4. Runs simulation               4. Runs simulation locally
5. Sees student decisions        5. Decisions sync to Firestore
   in real-time (onSnapshot)
6. Exports JSON v1.2             6. Exports JSON v1.2
```

## 5. Evaluation protection

Firebase security rules enforce that:
- `studentDecisions` can only be written by the `activeStudentUid`
- `instructorEvents` can only be written by the `instructorUid`
- The `evaluable` field on instructor events is constrained to `false`
- Student decisions shape is validated (required fields, correct `source`)

The app's own `filterEvaluableLogs()` provides a second layer of isolation —
evaluation score is always derived exclusively from student-sourced logs.

## 6. Running without Firebase (local mode)

Simply omit the `.env.local` file (or leave the keys blank).
The app behaves exactly as in Fase 7 — no Firebase calls are made,
sessions are stored in `localStorage`, and there is no real-time sync.
