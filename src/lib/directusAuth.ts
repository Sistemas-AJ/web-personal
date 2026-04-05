const DIRECTUS_ORIGIN = 'https://noticiasback.systempiura.com';
const DIRECTUS_AUTH_URL = `${DIRECTUS_ORIGIN}/auth/login`;
const STORAGE_KEY = 'directus_admin_auth';

export interface DirectusAuthData {
  access_token: string;
  refresh_token?: string;
  expires?: number;
}

interface DirectusLoginResponse {
  data?: DirectusAuthData;
  errors?: Array<{ message?: string }>;
}

export async function loginToDirectus(email: string, password: string): Promise<DirectusAuthData> {
  const response = await fetch(DIRECTUS_AUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      mode: 'json',
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as DirectusLoginResponse;

  if (!response.ok || !payload.data?.access_token) {
    const message = payload.errors?.[0]?.message || 'No se pudo autenticar contra Directus.';
    throw new Error(message);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload.data));
  return payload.data;
}

export function getStoredDirectusAuth(): DirectusAuthData | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as DirectusAuthData;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function hasStoredDirectusAuth(): boolean {
  return Boolean(getStoredDirectusAuth()?.access_token);
}

export function clearStoredDirectusAuth() {
  localStorage.removeItem(STORAGE_KEY);
}
