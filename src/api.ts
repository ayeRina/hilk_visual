// Mobile API helper for hilk_visual
// Change BASE to the correct address for your dev environment
import Constants from 'expo-constants';

function extractHost(value: unknown): string | undefined {
  if (typeof value !== 'string' || value.trim() === '') {
    return undefined;
  }

  const trimmed = value.trim();
  try {
    const withProtocol = trimmed.includes('://') ? trimmed : `http://${trimmed}`;
    return new URL(withProtocol).hostname;
  } catch {
    return trimmed.split(':')[0];
  }
}

function getExpoHosts(): string[] {
  const hostCandidates = [
    Constants.expoConfig?.hostUri,
    (Constants.manifest2 as any)?.extra?.expoGo?.debuggerHost,
    (Constants.manifest as any)?.debuggerHost,
    Constants.linkingUri,
  ];

  const hosts = hostCandidates
    .map(extractHost)
    .filter((host): host is string => Boolean(host));

  return Array.from(new Set(hosts));
}

function buildCandidates(): string[] {
  const envBase = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  const candidates = new Set<string>();

  if (envBase) {
    candidates.add(envBase);
  }

  const expoHosts = getExpoHosts();
  expoHosts.forEach((host) => {
    candidates.add(`http://${host}/admin_hilkvisual/api/index.php`);
  });

  candidates.add('http://10.0.2.2/admin_hilkvisual/api/index.php');
  candidates.add('http://localhost/admin_hilkvisual/api/index.php');

  return Array.from(candidates);
}

const BASE_CANDIDATES = buildCandidates();
let workingBase: string | null = null;

export const BASE = BASE_CANDIDATES[0];

export function getApiBaseUrl(): string {
  return workingBase || BASE;
}

export function resolveAssetUrl(assetPath?: string | null): string | null {
  if (!assetPath) {
    return null;
  }

  const normalizedPath = String(assetPath).replace(/\\/g, '/').trim();
  if (/^https?:\/\//i.test(normalizedPath)) {
    return normalizedPath;
  }

  const base = getApiBaseUrl().replace(/\/api\/index\.php$/, '').replace(/\/+$/, '');
  const trimmedPath = normalizedPath.replace(/^\/+/, '');
  return encodeURI(`${base}/${trimmedPath}`);
}

export type ApiResp<T> = { success: boolean; data?: T; message?: string };

async function parseApiResponse<T = any>(res: Response): Promise<ApiResp<T>> {
  const raw = await res.text();

  try {
    return JSON.parse(raw) as ApiResp<T>;
  } catch {
    const snippet = raw.slice(0, 120).replace(/\s+/g, ' ');
    return {
      success: false,
      message: `Server returned non-JSON (${res.status}). Check BASE URL and PHP API. Response starts with: ${snippet}`,
    };
  }
}

async function requestWithFallback<T = any>(
  path: string,
  init: RequestInit,
): Promise<ApiResp<T>> {
  const candidates = workingBase ? [workingBase, ...BASE_CANDIDATES.filter((base) => base !== workingBase)] : BASE_CANDIDATES;
  let lastErrorMessage = '';

  for (const base of candidates) {
    try {
      const res = await fetch(`${base}${path}`, init);
      const parsed = await parseApiResponse<T>(res);
      const contentType = res.headers.get('content-type') || '';
      const looksLikeJson = contentType.toLowerCase().includes('application/json');
      // If this response doesn't look like JSON, it is likely an HTML page
      // (e.g. the wrong host). Continue probing other candidates instead
      // of caching this base as working.
      if (!looksLikeJson) {
        lastErrorMessage = parsed.message || `Non-JSON response from ${base}`;
        continue;
      }

      // At this point we have JSON from the server. Treat this base as working
      // and return the parsed payload (whether success or API error).
      workingBase = base;
      return parsed;
    } catch (error: any) {
      lastErrorMessage = `Could not reach API at ${base}. ${error?.message || ''}`.trim();
    }
  }

  return {
    success: false,
    message: lastErrorMessage || 'Unable to reach backend API.',
  };
}

async function get<T = any>(params: Record<string, any>) {
  const q = new URLSearchParams(params as any).toString();
  return requestWithFallback<T>(`?${q}`, { method: 'GET' });
}

async function postJson<T = any>(action: string, payload: any) {
  return requestWithFallback<T>(`?action=${encodeURIComponent(action)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function health() { return get<{ message: string }>({ action: 'health' }); }
export async function dashboard() { return get({ action: 'dashboard' }); }
export async function bookings() { return get({ action: 'bookings' }); }
export async function photoshoots() { return get({ action: 'photoshoots' }); }
export async function reports() { return get({ action: 'reports' }); }
export async function uploads(userId?: number) {
  if (userId && userId > 0) {
    return get({ action: 'uploads', user_id: userId });
  }
  return get({ action: 'uploads' });
}
export async function registerUser(payload: { full_name: string; email: string; password: string; phone?: string }) {
  return postJson('users', payload);
}
export async function loginUser(payload: { email: string; password: string }) {
  return postJson('login', payload);
}

export async function updateUserProfile(payload: {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  profile_photo_path?: string | null;
  password?: string;
}) {
  return requestWithFallback<any>('?action=users', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function createBooking(payload: any) { return postJson('bookings', payload); }

// Upload image via multipart/form-data (FormData). Accepts local uri from ImagePicker or camera.
export async function uploadFile({ uri, fileName, type, user_id, booking_id }: { uri: string; fileName?: string; type?: string; user_id?: number | null; booking_id?: number | null }) {
  const form = new FormData();
  // @ts-ignore - React Native FormData accepts { uri, name, type }
  form.append('file', { uri, name: fileName || 'photo.jpg', type: type || 'image/jpeg' });
  if (user_id) form.append('user_id', String(user_id));
  if (booking_id) form.append('booking_id', String(booking_id));

  return requestWithFallback<any>('?action=uploads', {
    method: 'POST',
    body: form,
    headers: {
      // Note: do NOT set Content-Type header here; fetch will set the correct boundary for multipart
    } as any,
  });
}
