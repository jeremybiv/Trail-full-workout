declare global {
  interface Window {
    storage?: {
      get(key: string, shared: boolean): Promise<{ value: string } | null>;
      set(key: string, value: string, shared: boolean): Promise<void>;
    };
  }
}

export async function sg<T>(key: string): Promise<T | null> {
  try {
    if (window.storage) {
      const r = await window.storage.get(key, false);
      return r ? (JSON.parse(r.value) as T) : null;
    }
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function ss(key: string, value: unknown): Promise<void> {
  try {
    const s = JSON.stringify(value);
    if (window.storage) {
      await window.storage.set(key, s, false);
    } else {
      localStorage.setItem(key, s);
    }
  } catch {
    // storage unavailable — silently ignore
  }
}
