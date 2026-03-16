import { useEffect, useRef } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

export function getToken(): string {
  return sessionStorage.getItem("token") || "";
}

export function getUsername(): string {
  return sessionStorage.getItem("username") || "";
}

export function setToken(token: string, username?: string): void {
  sessionStorage.setItem("token", token);
  if (username) sessionStorage.setItem("username", username);
}

export function clearAuth(): void {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("username");
}

function getJwtExpMs(t: string): number | null {
  try {
    const payload = JSON.parse(
      atob((t.split(".")[1] || "").replace(/-/g, "+").replace(/_/g, "/"))
    );
    return typeof payload?.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

async function forceLogout(): Promise<void> {
  const username = getUsername();

  try {
    await fetch(`${API_BASE}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ username }),
      keepalive: true,
    });

    await new Promise((res) => setTimeout(res, 300));
  } catch {
    // ignore
  }

  clearAuth();

  setTimeout(() => {
    window.location.href = "/login";
  }, 100);
}

export async function authFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const t = getToken();
  const headers = new Headers(init.headers || {});

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (t) {
    headers.set("Authorization", `Bearer ${t}`);
  }

  const res = await fetch(
    `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`,
    {
      ...init,
      headers,
    }
  );

  if (res.status === 401) {
    await forceLogout();
  }

  return res;
}

export default function useAuth() {
  const autoLogoutTimerRef = useRef<number | undefined>(undefined);

  const scheduleAutoLogout = () => {
    if (autoLogoutTimerRef.current) {
      window.clearTimeout(autoLogoutTimerRef.current);
      autoLogoutTimerRef.current = undefined;
    }

    const t = getToken();
    if (!t) return;

    const expMs = getJwtExpMs(t);
    if (!expMs) return;

    const msLeft = expMs - Date.now();

    if (msLeft <= 0) {
      forceLogout();
      return;
    }

    autoLogoutTimerRef.current = window.setTimeout(() => {
      forceLogout();
    }, msLeft);
  };

  useEffect(() => {
    scheduleAutoLogout();

    return () => {
      if (autoLogoutTimerRef.current) {
        window.clearTimeout(autoLogoutTimerRef.current);
      }
    };
  }, []);

  const logout = async () => {
    await forceLogout();
  };

  return {
    token: getToken(),
    username: getUsername(),
    setToken,
    clearAuth,
    logout,
    scheduleAutoLogout,
  };
}