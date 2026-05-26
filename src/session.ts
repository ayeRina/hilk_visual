import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_SESSION_KEY = 'hilk_visual:user';

export type SessionUser = {
  id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  profile_photo_path?: string | null;
  role?: string;
  created_at?: string;
};

// In-memory fallback when no persistent storage is available
const memoryStore: Record<string, string> = {};

function hasLocalStorage(): boolean {
  try {
    return typeof localStorage !== 'undefined' && localStorage != null;
  } catch {
    return false;
  }
}

async function writeRaw(key: string, value: string): Promise<void> {
  // Prefer native AsyncStorage, but it may be unavailable in Expo Go without
  // the proper native module. Fall back to localStorage (web) or memory.
  try {
    if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
      await AsyncStorage.setItem(key, value);
      return;
    }
  } catch (e: any) {
    console.warn('AsyncStorage unavailable, falling back to alternative storage:', e?.message || e);
  }

  if (hasLocalStorage()) {
    try {
      localStorage.setItem(key, value);
      return;
    } catch (e: any) {
      console.warn('localStorage write failed, using memory fallback:', e?.message || e);
    }
  }

  memoryStore[key] = value;
}

async function readRaw(key: string): Promise<string | null> {
  try {
    if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
      const v = await AsyncStorage.getItem(key);
      if (v !== null) return v;
    }
  } catch (e: any) {
    console.warn('AsyncStorage read failed, falling back:', e?.message || e);
  }

  if (hasLocalStorage()) {
    try {
      const v = localStorage.getItem(key);
      if (v !== null) return v;
    } catch (e: any) {
      console.warn('localStorage read failed, using memory fallback:', e?.message || e);
    }
  }

  return memoryStore[key] ?? null;
}

async function removeRaw(key: string): Promise<void> {
  try {
    if (AsyncStorage && typeof AsyncStorage.removeItem === 'function') {
      await AsyncStorage.removeItem(key);
      return;
    }
  } catch (e: any) {
    console.warn('AsyncStorage remove failed, falling back:', e?.message || e);
  }

  if (hasLocalStorage()) {
    try {
      localStorage.removeItem(key);
      return;
    } catch (e: any) {
      console.warn('localStorage remove failed, using memory fallback:', e?.message || e);
    }
  }

  delete memoryStore[key];
}

export async function saveSessionUser(user: SessionUser): Promise<void> {
  await writeRaw(USER_SESSION_KEY, JSON.stringify(user));
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const raw = await readRaw(USER_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export async function clearSessionUser(): Promise<void> {
  await removeRaw(USER_SESSION_KEY);
}
