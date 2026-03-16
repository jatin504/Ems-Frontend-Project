import { useState, useEffect, useCallback } from "react";

interface LockoutBehaviour {
  allow_safety_charging: boolean;
  allow_reserve_charging: boolean;
  block_economic_charging: boolean;
  block_discharging: boolean;
}

interface PriceLogicOverrides {
  disable_aggrassive_charging: boolean;
  disable_peak_shaving: boolean;
  disable_arbitrage: boolean;
  disable_low_price_charging: boolean;
}

interface NotificationsCfg {
  notify_at_80_percent_usage: boolean;
  notify_lockout_activated: boolean;
  mobile_push_notification: boolean;
}

interface SocSafetyManagement {
  min_safe_soc: number;
  normal_soc_after_safety_charge: number;
  standby_soc_hold_band: number;
}

interface CycleConfigResponse {
  max_cycles_per_day?: number;
  cycle_used_today?: number;
  cycle_counting_method?: string;
  lockout_behaviour?: Partial<LockoutBehaviour>;
  price_logic_overrides?: Partial<PriceLogicOverrides>;
  notifications?: Partial<NotificationsCfg>;
  soc_safety_management?: Partial<SocSafetyManagement>;
}

const API_BASE = import.meta.env.VITE_API_BASE;

export const useCycleConfig = (isOpen: boolean, initialValue: string) => {
  const [maxCycles, setMaxCycles] = useState<number>(
    Number(initialValue || 5) || 5
  );
  const [cyclesUsedToday, setCyclesUsedToday] = useState<number>(3.4);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [cycleCountingMethod, setCycleCountingMethod] =
    useState<string>("0");

  const [lockoutBehaviour, setLockoutBehaviour] =
    useState<LockoutBehaviour>({
      allow_safety_charging: true,
      allow_reserve_charging: true,
      block_economic_charging: false,
      block_discharging: false,
    });

  const [priceLogicOverrides, setPriceLogicOverrides] =
    useState<PriceLogicOverrides>({
      disable_aggrassive_charging: false,
      disable_peak_shaving: true,
      disable_arbitrage: false,
      disable_low_price_charging: true,
    });

  const [notifications, setNotifications] =
    useState<NotificationsCfg>({
      notify_at_80_percent_usage: true,
      notify_lockout_activated: true,
      mobile_push_notification: false,
    });

  const [socSafetyManagement, setSocSafetyManagement] =
    useState<SocSafetyManagement>({
      min_safe_soc: 30,
      normal_soc_after_safety_charge: 80,
      standby_soc_hold_band: 50,
    });

  useEffect(() => {
    if (!isOpen) return;

    const fetchConfig = async () => {
      setIsLoading(true);

      try {
        const resp = await fetch(
          `${API_BASE}/cycle-management/cycle-config`
        );

        if (!resp.ok) {
          const parsed = Number(initialValue);
          setMaxCycles(Number.isFinite(parsed) ? parsed : 5);
          return;
        }

        const data: CycleConfigResponse = await resp.json();

        if (typeof data.max_cycles_per_day === "number") {
          setMaxCycles(data.max_cycles_per_day);
        }

        if (typeof data.cycle_used_today === "number") {
          setCyclesUsedToday(data.cycle_used_today);
        }

        if (typeof data.cycle_counting_method === "string") {
          setCycleCountingMethod(data.cycle_counting_method);
        }

        if (data.lockout_behaviour) {
          setLockoutBehaviour((p) => ({ ...p, ...data.lockout_behaviour }));
        }

        if (data.price_logic_overrides) {
          setPriceLogicOverrides((p) => ({
            ...p,
            ...data.price_logic_overrides,
          }));
        }

        if (data.notifications) {
          setNotifications((p) => ({ ...p, ...data.notifications }));
        }

        if (data.soc_safety_management) {
          setSocSafetyManagement((p) => ({
            ...p,
            ...data.soc_safety_management,
          }));
        }
      } catch (err) {
        console.error("Error fetching cycle config:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [isOpen, initialValue]);

  const saveConfig = useCallback(async (): Promise<boolean> => {
    setIsSaving(true);

    try {
      const resp = await fetch(
        `${API_BASE}/cycle-management/cycle-config`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            max_cycles_per_day: maxCycles,
            cycle_counting_method: cycleCountingMethod,
            lockout_behaviour: lockoutBehaviour,
            price_logic_overrides: priceLogicOverrides,
            notifications,
            soc_safety_management: socSafetyManagement,
          }),
        }
      );

      if (!resp.ok) return false;

      const updated: CycleConfigResponse = await resp.json();

      if (updated.max_cycles_per_day !== undefined)
        setMaxCycles(updated.max_cycles_per_day);

      if (updated.cycle_used_today !== undefined)
        setCyclesUsedToday(updated.cycle_used_today);

      if (updated.cycle_counting_method)
        setCycleCountingMethod(updated.cycle_counting_method);

      return true;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [
    maxCycles,
    cycleCountingMethod,
    lockoutBehaviour,
    priceLogicOverrides,
    notifications,
    socSafetyManagement,
  ]);

  return {
    maxCycles,
    setMaxCycles,
    cyclesUsedToday,
    isLoading,
    isSaving,
    saveConfig,
    lockoutBehaviour,
    setLockoutBehaviour,
    priceLogicOverrides,
    setPriceLogicOverrides,
    notifications,
    setNotifications,
    socSafetyManagement,
    setSocSafetyManagement,
    cycleCountingMethod,
    setCycleCountingMethod,
  };
};