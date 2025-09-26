import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY || 'todo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH || 'todo.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT || 'todo-project',
};

export const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
