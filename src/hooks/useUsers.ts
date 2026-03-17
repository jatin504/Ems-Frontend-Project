import { useCallback, useState } from "react";
import useApi from "./useApi";
import type { User } from "../User/User";

type BackendUser = any;

const normalize = (u: BackendUser): User => {
  const username = u.username || "";
  const fromUsername = username.split("_") || [""];
  return {
    id: u.id,
    firstName: u.first_name || (fromUsername[0] ? String(fromUsername[0]).charAt(0).toUpperCase() + String(fromUsername[0]).slice(1) : ""),
    lastName: u.last_name || "",
    email: u.email || "",
    phone: u.phone ?? "",
    role: (u.role || "viewer").toLowerCase(),
    is_blocked: u.is_blocked ?? false,
  } as User;
};

export default function useUsers() {
  const api = useApi();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get("/api/users");
      setUsers(((data || []) as BackendUser[]).map(normalize));
      setLoading(false);
      return data;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, [api]);

  const createUser = useCallback(async (payload: any) => {
    setLoading(true);
    try {
      const res = await api.post("/api/users", payload);
      const u = normalize(res || payload);
      setUsers((p) => [...p, u]);
      setLoading(false);
      return u;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, [api]);

  const updateUser = useCallback(async (id: number, payload: any) => {
    setLoading(true);
    try {
      const res = await api.put(`/api/users/${id}`, payload);
      await fetchUsers();
      setLoading(false);
      return res;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, [api, fetchUsers]);

  const deleteUser = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await api.del(`/api/users/${id}`);
      setUsers((p) => p.filter((u) => u.id !== id));
      setLoading(false);
      return true;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, [api]);

  const blockUser = useCallback(async (id: number, is_blocked: boolean) => {
    setLoading(true);
    try {
      const res = await api.patch(`/api/users/${id}/block`, { is_blocked: !is_blocked });
      await fetchUsers();
      setLoading(false);
      return res;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, [api, fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    blockUser,
  };
}
