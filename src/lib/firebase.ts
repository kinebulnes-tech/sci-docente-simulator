import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const cfg = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            as string | undefined,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        as string | undefined,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         as string | undefined,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             as string | undefined,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
};

/** True when all required Firebase env vars are present. */
export const isFirebaseConfigured: boolean = Boolean(
  cfg.apiKey && cfg.projectId && cfg.appId
);

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;

if (isFirebaseConfigured) {
  _app  = getApps().length ? getApps()[0] : initializeApp(cfg as Required<typeof cfg>);
  _auth = getAuth(_app);
  _db   = getFirestore(_app);
}

export const firebaseApp:  FirebaseApp | null = _app;
export const firebaseAuth: Auth        | null = _auth;
export const firebaseDb:   Firestore   | null = _db;
