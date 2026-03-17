import { useEffect, useState, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

function getToken(): string {
  return sessionStorage.getItem("token") || "";
}

export interface RolePermission {
  role_name: string;

  // USER
  can_edit_user: boolean;
  can_delete_user: boolean;
  can_settings_user: boolean;

  // CONTROL PERMISSIONS
  can_control_bess: boolean;
  can_control_service?: boolean;
  can_control_switchgear?: boolean;

  updated_at?: string;
}

export default function usePermissions() {
  const [permissions, setPermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ================= FETCH =================
  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/permissions`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch permissions");
      }

      const data = await res.json();

      const normalized = (data || []).map((p: any) => ({
        ...p,
        can_control_bess: !!p.can_control_bess,
        can_control_service: !!p.can_control_service,
        can_control_switchgear: !!p.can_control_switchgear,
      }));

      setPermissions(normalized);
    } catch (err: any) {
      setError(err.message || "Error loading permissions");
    } finally {
      setLoading(false);
    }
  }, []);

  // ================= UPDATE =================
  const updatePermissions = useCallback(
    async (payload: RolePermission[]) => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/api/permissions`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Update failed");
        }

        const normalized = (data || []).map((p: any) => ({
          ...p,
          can_control_bess: !!p.can_control_bess,
          can_control_service: !!p.can_control_service,
          can_control_switchgear: !!p.can_control_switchgear,
        }));

        setPermissions(normalized);
        return true;
      } catch (err: any) {
        setError(err.message || "Error updating permissions");
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return {
    permissions,
    loading,
    error,
    fetchPermissions,
    updatePermissions,
  };
}