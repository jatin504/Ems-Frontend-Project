import { useCallback } from "react";

const BASE = import.meta.env.VITE_API_BASE;

export default function useApi() {
  const getToken = () => sessionStorage.getItem("token") || "";

  const request = useCallback(
    async (path: string, opts: RequestInit = {}) => {
      const url = path.startsWith("http")
        ? path
        : `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;

      const token = getToken();

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(opts.headers as Record<string, string> | undefined),
      };

      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(url, {
        ...opts,
        headers,
      });

      const text = await res.text();

      let data: any = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }

      if (!res.ok) {
        const err: any = new Error(
          (data && data.message) || res.statusText || "API error"
        );
        err.status = res.status;
        err.data = data;
        throw err;
      }

      return data;
    },
    []
  );

  return {
    get: (path: string) => request(path, { method: "GET" }),
    post: (path: string, body?: any) =>
      request(path, {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
      }),
    put: (path: string, body?: any) =>
      request(path, {
        method: "PUT",
        body: body ? JSON.stringify(body) : undefined,
      }),
    patch: (path: string, body?: any) =>
      request(path, {
        method: "PATCH",
        body: body ? JSON.stringify(body) : undefined,
      }),
    del: (path: string) => request(path, { method: "DELETE" }),
  };
}