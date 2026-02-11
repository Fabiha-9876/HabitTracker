import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, Auth } from 'firebase/auth';
// @ts-ignore — getReactNativePersistence exists at runtime in RN Firebase bundle
import { getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCo4pfSsx1qJQSXZtPP4NCssM_-t8b4FhM',
  authDomain: 'habittracker-bb6fa.firebaseapp.com',
  projectId: 'habittracker-bb6fa',
  storageBucket: 'habittracker-bb6fa.firebasestorage.app',
  messagingSenderId: '520356614335',
  appId: '1:520356614335:web:77f38268d116997d12f60a',
  measurementId: 'G-Y20VHDSTF3',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };
