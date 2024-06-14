import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import firebaseConfig from 'src/assets/firebase-config.json';
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app)
export default app;