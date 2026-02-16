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

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://75.119.146.115:5179";

export const useCycleConfig = (isOpen: boolean, initialValue: string) => {
  const [maxCycles, setMaxCycles] = useState<number>(
    Number(initialValue || 5) || 5
  );
  const [cyclesUsedToday, setCyclesUsedToday] = useState<number>(3.4);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // cycle counting method (0 = throughput, 1 = full_cycle, 2 = dod_weighted)
  const [cycleCountingMethod, setCycleCountingMethod] = useState<string>("0");

  const [lockoutBehaviour, setLockoutBehaviour] = useState<LockoutBehaviour>({
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

  const [notifications, setNotifications] = useState<NotificationsCfg>({
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
          `${API_BASE_URL}/cycle-management/cycle-config`
        );

        if (!resp.ok) {
          console.error("Failed to fetch cycle config", resp.statusText);
          const parsed = Number(initialValue);
          setMaxCycles(Number.isFinite(parsed) ? parsed : 5);
          return;
        }

        const data: CycleConfigResponse = await resp.json();

        if (typeof data.max_cycles_per_day === "number") {
          setMaxCycles(data.max_cycles_per_day);
        } else {
          const parsed = Number(initialValue);
          setMaxCycles(Number.isFinite(parsed) ? parsed : 5);
        }

        if (typeof data.cycle_used_today === "number") {
          setCyclesUsedToday(data.cycle_used_today);
        }

        // NEW: cycle counting method
        if (typeof data.cycle_counting_method === "string") {
          setCycleCountingMethod(data.cycle_counting_method);
        } else {
          setCycleCountingMethod("0");
        }

        if (data.lockout_behaviour) {
          setLockoutBehaviour((prev) => ({
            ...prev,
            ...data.lockout_behaviour,
          }));
        }

        if (data.price_logic_overrides) {
          setPriceLogicOverrides((prev) => ({
            ...prev,
            ...data.price_logic_overrides,
          }));
        }

        if (data.notifications) {
          setNotifications((prev) => ({
            ...prev,
            ...data.notifications,
          }));
        }

        if (data.soc_safety_management) {
          setSocSafetyManagement((prev) => ({
            ...prev,
            ...data.soc_safety_management,
          }));
        }
      } catch (err) {
        console.error("Error fetching cycle config:", err);
        const parsed = Number(initialValue);
        setMaxCycles(Number.isFinite(parsed) ? parsed : 5);
        setCycleCountingMethod("0");
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
        `${API_BASE_URL}/cycle-management/cycle-config`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            max_cycles_per_day: maxCycles,
            cycle_counting_method: cycleCountingMethod, // NEW
            lockout_behaviour: lockoutBehaviour,
            price_logic_overrides: priceLogicOverrides,
            notifications: notifications,
            soc_safety_management: socSafetyManagement,
          }),
        }
      );

      if (!resp.ok) {
        const errText = await resp.text();
        console.error("Failed to save cycle config:", errText);
        return false;
      }

      const updated: CycleConfigResponse = await resp.json();

      if (typeof updated.max_cycles_per_day === "number") {
        setMaxCycles(updated.max_cycles_per_day);
      }
      if (typeof updated.cycle_used_today === "number") {
        setCyclesUsedToday(updated.cycle_used_today);
      }
      if (typeof updated.cycle_counting_method === "string") {
        setCycleCountingMethod(updated.cycle_counting_method);
      }

      if (updated.lockout_behaviour) {
        setLockoutBehaviour((prev) => ({
          ...prev,
          ...updated.lockout_behaviour,
        }));
      }
      if (updated.price_logic_overrides) {
        setPriceLogicOverrides((prev) => ({
          ...prev,
          ...updated.price_logic_overrides,
        }));
      }
      if (updated.notifications) {
        setNotifications((prev) => ({
          ...prev,
          ...updated.notifications,
        }));
      }
      if (updated.soc_safety_management) {
        setSocSafetyManagement((prev) => ({
          ...prev,
          ...updated.soc_safety_management,
        }));
      }

      return true;
    } catch (err) {
      console.error("Error saving cycle config:", err);
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
