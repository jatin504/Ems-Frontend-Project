import { useEffect, useMemo, useState } from "react";
import {
  Box, Button, Flex, HStack, NumberInput, NumberInputField,
  NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  Stack, Text, useToast, Spinner
} from "@chakra-ui/react";

type Role = "admin" | "manager" | "supervisor" | "engineer" | "operator" | "guest";
type Policy = {
  role_name: Role;
  min_length: number;
  min_numeric: number;
  min_alpha: number;
  min_special: number;
  expiry_days: number;
  auto_logoff_minutes: number;
  lock_after_attempts: number;
  updated_at?: string;
};

const API_BASE = (import.meta as any).env?.VITE_API_URL ?? "http://75.119.146.115:5179/api";

/* ---------- tiny inline auth helpers (no new file) ---------- */
function _forceLogout() {
  sessionStorage.removeItem("token");
  window.location.href = "/login";
}
function token() { return sessionStorage.getItem("token") || ""; }
function _expMsFromJwt(t: string): number | null {
  try {
    const payload = JSON.parse(atob(t.split(".")[1] || ""));
    return typeof payload?.exp === "number" ? payload.exp * 1000 : null;
  } catch { return null; }
}
let _autoLogoutTimer: number | undefined;
function _scheduleAutoLogoutFromStoredToken() {
  if (_autoLogoutTimer) { window.clearTimeout(_autoLogoutTimer); _autoLogoutTimer = undefined; }
  const t = token(); if (!t) return;
  const expMs = _expMsFromJwt(t); if (!expMs) return;
  const msLeft = expMs - Date.now();
  if (msLeft <= 0) { _forceLogout(); return; }
  _autoLogoutTimer = window.setTimeout(_forceLogout, msLeft);
}
/* ---------- end tiny auth helpers ---------- */

/** Local-time display. If timezone missing, just show as-is. */
function _fmtUpdated(s?: string) {
  if (!s) return "";
  const hasTZ = /[zZ]|[+-]\d{2}:?\d{2}$/.test(s);
  const iso = hasTZ ? s : s.replace(" ", "T");
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleString();
}

async function authFetch(path: string, init: RequestInit = {}) {
  const t = token();
  const headers = new Headers(init.headers || {});
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (t) headers.set("Authorization", `Bearer ${t}`);
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (res.status === 401) { _forceLogout(); }
  return res;
}

export default function PolicyPanel() {
  const toast = useToast();
  const roles = useMemo(() => [
    { value: "admin" as Role, label: "Admin" },
    { value: "manager" as Role, label: "Manager" },
    { value: "supervisor" as Role, label: "Supervisor" },
    { value: "engineer" as Role, label: "Engineer" },
    { value: "operator" as Role, label: "Operator" },
    { value: "guest" as Role, label: "Guest" },
  ], []);
  const [role, setRole] = useState<Role>("admin");

  // IMPORTANT: koi defaults nahin — jab tak fetch na ho, policy null/blank
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => { _scheduleAutoLogoutFromStoredToken(); }, []);

  async function loadPolicy(r: Role) {
    setLoading(true);
    setNotFound(false);
    setPolicy(null);
    try {
      const res = await authFetch(`/policy?role=${r}`);
      if (res.status === 404) { setNotFound(true); return; }
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json() as Policy;
      setPolicy(data);
    } catch (err) {
      toast({ title: "Failed to load policy", status: "error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadPolicy(role); }, [role]);

  const onNum = (k: keyof Policy) => (v: string) => {
    if (!policy) return;
    const n = parseInt(v || "0", 10);
    setPolicy({ ...policy, [k]: isNaN(n) ? 0 : n });
  };

  const save = async () => {
    if (!policy) {
      toast({ title: "Nothing to save", description: "No policy loaded.", status: "warning" });
      return;
    }

    const req: (keyof Policy)[] = [
      "min_length","min_numeric","min_alpha","min_special",
      "expiry_days","auto_logoff_minutes","lock_after_attempts"
    ];

    for (const k of req) {
      const v = policy[k] as unknown as number;
      if (typeof v !== "number" || Number.isNaN(v)) {
        toast({ title: "Invalid value", description: `Field ${k} is required`, status: "error" });
        return;
      }
    }

    setSaving(true);
    try {
      const body = {
        role: policy.role_name,
        min_length: policy.min_length,
        min_numeric: policy.min_numeric,
        min_alpha: policy.min_alpha,
        min_special: policy.min_special,
        expiry_days: policy.expiry_days,
        auto_logoff_minutes: policy.auto_logoff_minutes,
        lock_after_attempts: policy.lock_after_attempts,
      };

      const res = await authFetch(`/policy`, {
        method: "PUT",
        body: JSON.stringify(body)
      });

      //  UX: Show specific toast for forbidden
      if (res.status === 403) {
        await loadPolicy(role);
        toast({
          title: "Forbidden",
          description: "Only admin can modify policy",
          status: "warning"
        });
        return;
      }
      //  IMPORTANT FIX — if forbidden or any fail → reload DB value immediately
      if (!res.ok) {
        await loadPolicy(role);   // 👈 yahi main fix hai
        const e = await res.json().catch(() => ({}));
        throw new Error(e?.error || `${res.status}`);
      }

      const data = await res.json() as Policy;
      setPolicy(data);

      toast({ title: "Policy saved", status: "success" });
      _scheduleAutoLogoutFromStoredToken();

    } catch (e: any) {
      toast({ title: "Save failed", description: e?.message, status: "error" });
    } finally {
      setSaving(false);
    }
  };

  const disabled = loading || saving || !policy;

  return (
    <Stack spacing={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold">1. Password & Security Policy</Text>
        <Text mt={1} opacity={0.8}>Select Security Level (Role)</Text>
        <HStack mt={3} spacing={3}>
          {roles.map(r => (
            <Button key={r.value}
              size="sm"
              variant={role === r.value ? "solid" : "outline"}
              onClick={() => setRole(r.value)}>
              {r.label}
            </Button>
          ))}
        </HStack>
      </Box>

      <Box borderWidth="1px" borderRadius="lg" p={4} opacity={loading ? 0.6 : 1}>
        <Text fontWeight="semibold" mb={3}>
          {roles.find(x=>x.value===role)?.label} — Password Options
        </Text>

        {loading && (
          <HStack mb={4}><Spinner size="sm"/><Text>Loading…</Text></HStack>
        )}

        {notFound && !loading && (
          <Text mb={4} color="orange.300">
            No policy found in DB for this role. Create one by filling fields and clicking Save.
          </Text>
        )}

        <Flex gap={6} flexWrap="wrap">
          <Field label="Minimum Password size" value={policy?.min_length} onChange={onNum("min_length")} min={4} max={128} isDisabled={!policy}/>
          <Field label="Minimum number of Special Characters" value={policy?.min_special} onChange={onNum("min_special")} min={0} max={10} isDisabled={!policy}/>
          <Field label="Minimum number of Numeric Characters" value={policy?.min_numeric} onChange={onNum("min_numeric")} min={0} max={10} isDisabled={!policy}/>
          <Field label="Minimum number of Alpha Characters" value={policy?.min_alpha} onChange={onNum("min_alpha")} min={0} max={10} isDisabled={!policy}/>
          <Field label="Password Expiry (days)" value={policy?.expiry_days} onChange={onNum("expiry_days")} min={0} max={3650} isDisabled={!policy}/>
        </Flex>

        <Text fontWeight="semibold" mt={6} mb={3}>Log On/Off Options</Text>
        <Flex gap={6} flexWrap="wrap">
          <Field label="Auto Log Off account (minutes)" value={policy?.auto_logoff_minutes} onChange={onNum("auto_logoff_minutes")} min={0} max={24*60} isDisabled={!policy}/>
        </Flex>

        <Text fontWeight="semibold" mt={6} mb={3}>Account Auto Lock Up</Text>
        <Flex gap={6} flexWrap="wrap">
          <Field label="Account Lock After (No of Invalid Password attempts)" value={policy?.lock_after_attempts} onChange={onNum("lock_after_attempts")} min={0} max={20} isDisabled={!policy}/>
        </Flex>

        <HStack mt={6} spacing={4}>
          <Button
            variant="outline"
            onClick={() => loadPolicy(role)}
            isDisabled={loading}
          >
            Reload
          </Button>
          <Button onClick={save} isLoading={saving} isDisabled={disabled}>
            Save
          </Button>
        </HStack>

        {policy?.updated_at && (
          <Text mt={3} opacity={0.7} fontSize="sm">
            Last updated: {_fmtUpdated(policy.updated_at)}
          </Text>
        )}
      </Box>
    </Stack>
  );
}

function Field({
  label, value, onChange, min, max, isDisabled
}: {
  label: string;
  value: number | undefined | null;
  onChange: (v: string)=>void;
  min?: number; max?: number;
  isDisabled?: boolean;
}) {
  // blank show: convert undefined/null -> ""
  const display = (value ?? "") as any;
  return (
    <Box minW="280px">
      <Text mb={1} fontSize="sm">{label}</Text>
      <NumberInput value={display} onChange={onChange} min={min} max={max} clampValueOnBlur isDisabled={isDisabled}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </Box>
  );
}
