import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

let firebaseApp: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;
let isFirebaseActive = false;

// Check if credentials exist in localStorage or environment
const getStoredFirebaseConfig = () => {
  if (typeof window === 'undefined') return null;
  const custom = localStorage.getItem('watchnow_custom_firebase_config_v1');
  if (custom) {
    try {
      return JSON.parse(custom);
    } catch {
      return null;
    }
  }
  return null;
};

const config = getStoredFirebaseConfig();

if (config && config.apiKey && config.projectId) {
  try {
    if (!getApps().length) {
      firebaseApp = initializeApp(config);
      dbInstance = getFirestore(firebaseApp, config.firestoreDatabaseId || '(default)');
      authInstance = getAuth(firebaseApp);
      isFirebaseActive = true;
    }
  } catch (err) {
    console.warn('Firebase initialization error:', err);
  }
}

export const isFirebaseConfigured = (): boolean => isFirebaseActive;
export const db = dbInstance;
export const auth = authInstance;

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: authInstance?.currentUser?.uid,
      email: authInstance?.currentUser?.email,
      emailVerified: authInstance?.currentUser?.emailVerified,
      isAnonymous: authInstance?.currentUser?.isAnonymous,
      tenantId: authInstance?.currentUser?.tenantId,
      providerInfo:
        authInstance?.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testFirestoreConnection(): Promise<{ success: boolean; message: string }> {
  if (!dbInstance) {
    return { success: false, message: 'Firebase لم يتم تكوينه بعد. المنصة تعمل في وضع المعاينة المحلي (Local Preview Mode).' };
  }
  try {
    await getDocFromServer(doc(dbInstance, 'test', 'connection'));
    return { success: true, message: 'تم الاتصال بقاعدة بيانات Cloud Firestore بنجاح!' };
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      return { success: false, message: 'تعذر الاتصال بـ Firestore: العميل غير متصل بالإنترنت أو المفاتيح غير صحيحة.' };
    }
    return { success: false, message: error instanceof Error ? error.message : 'خطأ غير متوقع في الاتصال' };
  }
}
