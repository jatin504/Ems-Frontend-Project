import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Box,
  VStack,
  HStack,
  Text,
  RadioGroup,
  Radio,
  Stack,
  Input,
  SimpleGrid,
  Checkbox,
  Divider,
  Grid,
  GridItem,
  Select,
  useColorModeValue,
  IconButton, 
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons"; 

import MaxCyclesPerDayModal from "./MaxCyclesPerDayModal";
import RTMAdjustmentDashboard from "../../../../Dashboard/RTMAdjustmentDashboard";
import ConfirmPasswordModal from "../../../Common/ConfirmPasswordModal";
import usePermissions from "../../../../hooks/usePermissions";


import {
  fetchStrategyConfiguration,
  saveStrategyConfiguration,
  mapForecastCodeToUi,
  mapPriceSourceCodeToUi,
  mapArbitrageCodeToUi,
} from "../../../../hooks/strategyConfigurationAPI"; 

type ToUWindow = {
  id: string;
  name: string;
  start: string;
  end: string;
  price: string;
};

interface TariffConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategy?: string | null; // "0" Basic, "3" Smart-ToU, "4" Flat-ToU, "5" Peak Shaving
  loading?: boolean;
  onStrategyChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function TariffConfigurationModal({
  isOpen,
  onClose,
  strategy,
}: TariffConfigurationModalProps) {
  const cardBorder = useColorModeValue("#e6e9ef", "#24303a");
  const softBg = useColorModeValue("#ffffff", "#0f1720");
  const muted = useColorModeValue("#374151", "#bfcbd1");

  // Tariff mode (TOU / Capped / Virtual / Peak)
  const [tariffMode, setTariffMode] =
    React.useState<"tou" | "capped" | "virtual" | "peak" | "trading">("tou");

  // Map selected EMS strategy -> which tab opens in the modal
  React.useEffect(() => {
    if (!isOpen) return; // only when modal opens

    switch (strategy) {
      case "3": // Smart-ToU
        setTariffMode("capped"); // Capped Dynamic
        break;

      case "4": // Flat-ToU
        setTariffMode("tou"); // TOU Tariff
        break;

      case "5": // Peak Shaving
        setTariffMode("peak"); // Peak Shaving
        break;

      case "6": // Trading
        setTariffMode("trading");
        break;

      case "0": // Basic
      default:
        
        break;
    }
  }, [isOpen, strategy]);

  // BESS params
  const [maxCharge, setMaxCharge] = React.useState("500");
  const [maxDischarge, setMaxDischarge] = React.useState("500");
  const [minSOC, setMinSOC] = React.useState("10"); // %
  const [maxSOC, setMaxSOC] = React.useState("95"); // %

  // NEW BESS fields (GLOBAL)
  const [bessMaxCyclesPerDay, setBessMaxCyclesPerDay] = React.useState("4");
  const [backupSOC, setBackupSOC] = React.useState("5"); // %

  // Max Cycles per day edit modal state
  const [isMaxCyclesModalOpen, setIsMaxCyclesModalOpen] =
    React.useState(false);
  const [isRTMModalOpen, setIsRTMModalOpen] = React.useState(false);
  const [isTradingModalOpen, setIsTradingModalOpen] = React.useState(false);

  const handleMaxCyclesSave = (val: string) => {
    setBessMaxCyclesPerDay(val);
    setIsMaxCyclesModalOpen(false);
  };

  // TOU windows
  const [windows, setWindows] = React.useState<ToUWindow[]>([
    { id: "w1", name: "Peak", start: "17:00", end: "21:00", price: "12" },
    { id: "w2", name: "Off-peak", start: "00:00", end: "07:00", price: "4" },
  ]);

  const [newWindowType, setNewWindowType] = React.useState<
    "Off-peak" | "Mid-peak" | "Peak"
  >("Peak");

  const addWindow = () => {
    const newId = `w${Date.now()}`;

    setWindows((s) => [
      ...s,
      {
        id: newId,
        name: newWindowType, // Off-peak / Mid-peak / Peak
        start: "00:00",
        end: "01:00",
        price: "0",
      },
    ]);
  };

  const removeWindow = (id: string) => {
    setWindows((s) => s.filter((w) => w.id !== id));
  };

  const updateWindow = (id: string, patch: Partial<ToUWindow>) => {
    setWindows((s) => s.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  };

  // Optimization rules (TOU)
  const [allowOffPeakCharge, setAllowOffPeakCharge] = React.useState(false);
  const [dischargeOnlyPeak, setDischargeOnlyPeak] = React.useState(false);
  const [allowChargeOnlySolar, setAllowChargeOnlySolar] =
    React.useState(false);
  const [reserveSOC, setReserveSOC] = React.useState("20");

  // Peak Shaving specific state
  const [enablePeakShaving, setEnablePeakShaving] = React.useState(false);
  const [peakThreshold, setPeakThreshold] = React.useState("");
  const [psMinSOC, setPsMinSOC] = React.useState("");
  const [psMaxDischarge, setPsMaxDischarge] = React.useState("");
  const [psForecastSource, setPsForecastSource] = React.useState<
    "none" | "ai" | "manual" | "external"
  >("ai");

  // Peak shaving mode (soft / hard / predictive)
  const [peakMode, setPeakMode] =
    React.useState<"soft" | "hard" | "predictive">("soft");

  // Advanced peak settings
  const [softLimit, setSoftLimit] = React.useState("");
  const [hardLimit, setHardLimit] = React.useState("");
  const [psMaintainSoft, setPsMaintainSoft] = React.useState(false);
  const [psForceHard, setPsForceHard] = React.useState(false);

  // Capped Dynamic state (Smart-ToU)
  const [cappedPriceSource, setCappedPriceSource] = React.useState<
    "dayahead" | "real" | "custom" | "xls"
  >("dayahead");
  const [cappedApiUrl, setCappedApiUrl] = React.useState("");
  const [cappedRefreshMin, setCappedRefreshMin] = React.useState("60");
  const [priceCap, setPriceCap] = React.useState("12");
  const [priceFloor, setPriceFloor] = React.useState("3");
  const [arbThreshold, setArbThreshold] = React.useState("8");
  const [cappedAggressivelyCharge, setCappedAggressivelyCharge] =
    React.useState(false);
  const [cappedPreventImport, setCappedPreventImport] =
    React.useState(false);
  const [cappedAllowExport, setCappedAllowExport] = React.useState(false);

  // Virtual Tariff
  //  Tariff Type: JSON codes "0" | "1" (FlatTou / SmartTou)
  const [customerTariffType, setCustomerTariffType] =
    React.useState<"0" | "1">("0");
  const [touTypeOptions, setTouTypeOptions] = React.useState<
    Record<string, string>
  >({
    "0": "FlatTou",
    "1": "SmartTou",
  });

  const [flatPrice, setFlatPrice] = React.useState("8");
  const [aggregatorShare, setAggregatorShare] = React.useState("30");
  const [guaranteedSavings, setGuaranteedSavings] =
    React.useState("5000");

  // Settlement method: JSON codes "0" | "1" | "2"
  const [settlementMethod, setSettlementMethod] = React.useState<
    "0" | "1" | "2"
  >("0");
  const [settlementMethodOptions, setSettlementMethodOptions] =
    React.useState<Record<string, string>>({
      "0": "wholesale_arbitrage_calculation",
      "1": "baseline_load_method",
      "2": "export_settlement_method",
    });

  const [billingOutputs, setBillingOutputs] = React.useState<{
    pdf: boolean;
    csv: boolean;
    api: boolean;
  }>({ pdf: true, csv: false, api: false });
  const [virtualStrategy, setVirtualStrategy] = React.useState<
    "maxrev" | "balanced" | "solar"
  >("maxrev");

  const [saving, setSaving] = React.useState(false);
  // 🔥 PERMISSION CHECK (FINAL FIX)
const { permissions } = usePermissions();

const role = (sessionStorage.getItem("role") || "").toLowerCase();

const isPermissionLoaded = permissions && permissions.length > 0;

const myPermission = permissions.find(
  (p) => (p.role_name || "").toLowerCase() === role
);

const canControl = isPermissionLoaded
  ? myPermission?.can_control_bess === true
  : true; // jab tak load nahi hua tab disable mat karo


  // 🔥 PASSWORD CONFIRMATION FLOW
  const [isPasswordOpen, setIsPasswordOpen] = React.useState(false);
  const [pendingPayload, setPendingPayload] = React.useState<any>(null);

  //  Modal open hone par GET /strategy/configuration se values load karo
  React.useEffect(() => {
    if (!isOpen) return;

    const loadConfig = async () => {
      try {
        const data = await fetchStrategyConfiguration();

        // ----- BESS params (bess_params_setting.json) -----
        const bessRoot = data?.bess_params;
        const bess = bessRoot?.bess_params || bessRoot || {};

        if (bess) {
          if (bess.max_charge_kw != null) {
            setMaxCharge(String(bess.max_charge_kw));
          }
          if (bess.max_dicharge_kw != null) {
            setMaxDischarge(String(bess.max_dicharge_kw));
          }
          if (bess.min_soc != null) {
            setMinSOC(String(bess.min_soc));
          }
          if (bess.max_soc != null) {
            setMaxSOC(String(bess.max_soc));
          }

          // load max cycles per day if present in bess_params_setting.json
          if (bess.max_cycles_per_day != null) {
            setBessMaxCyclesPerDay(String(bess.max_cycles_per_day));
          }

          // load backup SOC (exact value from backend, no conversion)
          if (bess.backup_soc != null) {
            setBackupSOC(String(bess.backup_soc));
          }
        }

        // ----- Flat TOU (FlatTou.json) -> windows + TOU rules -----
        const flat = data?.flat_tou || {};
        const setting = flat.setting || {};
        const newWindows: ToUWindow[] = [];
        let idx = 1;

        const pushArray = (arr: any[], name: string) => {
          (arr || []).forEach((slot) => {
            newWindows.push({
              id: `w${idx++}`,
              name,
              start: slot?.start_time ?? "00:00",
              end: slot?.end_time ?? "00:00",
              price: String(slot?.price ?? "0"),
            });
          });
        };

        pushArray(setting.off_peak || [], "Off-peak");
        pushArray(setting.mid_peak || [], "Mid-peak");
        pushArray(setting.peak || [], "Peak");

        if (newWindows.length > 0) {
          setWindows(newWindows);
        }

        const opt = flat.optimization_rule || {};
        if (opt.allow_charging_during_off_peak != null) {
          setAllowOffPeakCharge(Boolean(opt.allow_charging_during_off_peak));
        }
        if (opt.allow_charging_only_from_solar != null) {
          setAllowChargeOnlySolar(Boolean(opt.allow_charging_only_from_solar));
        }
        if (opt.discharging_during_peak != null) {
          setDischargeOnlyPeak(Boolean(opt.discharging_during_peak));
        }
        if (opt.reserve_soc != null) {
          setReserveSOC(String(opt.reserve_soc));
        }

        // ----- Peak Shaving (PeakShaving.json) -----
        const peak = data?.peak_shaving || {};

        if (Object.keys(peak).length > 0) {
          setEnablePeakShaving(true);

          // mode mapping from backend code to UI value
          if (peak.peak_shaving_mode != null) {
            const modeCode = String(peak.peak_shaving_mode);
            if (modeCode === "0") setPeakMode("soft");
            else if (modeCode === "1") setPeakMode("hard");
            else if (modeCode === "2") setPeakMode("predictive");
          }

          if (peak.peak_shaving_threshold_kw != null) {
            setPeakThreshold(String(peak.peak_shaving_threshold_kw));
          }

          if (peak.reserve_soc_percent != null) {
            setPsMinSOC(String(peak.reserve_soc_percent));
          }

          if (peak.max_discharge_power_kw != null) {
            setPsMaxDischarge(String(peak.max_discharge_power_kw));
          }

          if (peak.forcast_source != null) {
            setPsForecastSource(
              mapForecastCodeToUi(String(peak.forcast_source))
            );
          }

          const adv = peak.advanced_settings || {};
          if (adv.soft_limit_kw != null) {
            setSoftLimit(String(adv.soft_limit_kw));
          }
          if (adv.hard_limit_kw != null) {
            setHardLimit(String(adv.hard_limit_kw));
          }
          if (adv.maintain_load_under_soft_limit_using_bess != null) {
            setPsMaintainSoft(
              Boolean(adv.maintain_load_under_soft_limit_using_bess)
            );
          }
          if (adv.force_control_to_stay_under_hard_limit != null) {
            setPsForceHard(
              Boolean(adv.force_control_to_stay_under_hard_limit)
            );
          }
        } else {
          // No existing config
          setEnablePeakShaving(false);
        }

        // ----- Smart TOU (SmartTou.json) -> Capped Dynamic -----
        const smart = data?.smart_tou || {};
        const ps = smart.price_source || {};
        if (Object.keys(ps).length > 0) {
          if (ps.price_source_default != null) {
            setCappedPriceSource(
              mapPriceSourceCodeToUi(String(ps.price_source_default))
            );
          }
          if (ps.api_url != null) {
            setCappedApiUrl(String(ps.api_url));
          }
          if (ps.refresh_interval_minutes != null) {
            setCappedRefreshMin(String(ps.refresh_interval_minutes));
          }
        }

        const caps = smart.caps_and_thresholds || {};
        if (caps.price_cap_threshold != null) {
          setPriceCap(String(caps.price_cap_threshold));
        }
        if (caps.price_floor_threshold != null) {
          setPriceFloor(String(caps.price_floor_threshold));
        }
        if (caps.arbitrage_threshold != null) {
          setArbThreshold(String(caps.arbitrage_threshold));
        }
        // NOTE: caps.max_cycles_per_day ignored in UI (global BESS cycles used instead)

        const sRules = smart.optimization_rule || {};
        if (
          sRules
            .Aggressively_charge_when_price_below_price_floor_threshold !=
          null
        ) {
          setCappedAggressivelyCharge(
            Boolean(
              sRules
                .Aggressively_charge_when_price_below_price_floor_threshold
            )
          );
        }
        if (
          sRules.prevent_charging_when_price_above_price_cap_threshold != null
        ) {
          setCappedPreventImport(
            Boolean(
              sRules.prevent_charging_when_price_above_price_cap_threshold
            )
          );
        }
        if (sRules.allow_discharge_when_profitable != null) {
          setCappedAllowExport(Boolean(sRules.allow_discharge_when_profitable));
        }

        // ----- Virtual Tariff (VirtualTariff.json) -----
        const virtual = data?.virtual_tariff || {};

        if (Object.keys(virtual).length > 0) {
          // Dropdown options ko JSON se load karo
          if (virtual.tou_type_option) {
            setTouTypeOptions(virtual.tou_type_option);
          }
          if (virtual.settlement_method_option) {
            setSettlementMethodOptions(virtual.settlement_method_option);
          }

          // tou_type: "0" => FlatTou, "1" => SmartTou
          if (virtual.tou_type != null) {
            setCustomerTariffType(
              String(virtual.tou_type) as "0" | "1"
            );
          }

          if (virtual.flat_tou_rate != null) {
            setFlatPrice(String(virtual.flat_tou_rate));
          }

          if (virtual.aggregator_profit_share_percent != null) {
            setAggregatorShare(
              String(virtual.aggregator_profit_share_percent)
            );
          }

          if (virtual.guaranteed_savings_per_month != null) {
            setGuaranteedSavings(
              String(virtual.guaranteed_savings_per_month)
            );
          }

          if (virtual.settlement_method != null) {
            setSettlementMethod(
              String(virtual.settlement_method) as "0" | "1" | "2"
            );
          }

          if (virtual.arbitrage_strategy != null) {
            setVirtualStrategy(
              mapArbitrageCodeToUi(String(virtual.arbitrage_strategy))
            );
          }
        }
      } catch (err) {
        console.error("Error loading /strategy/configuration:", err);
      }
    };

    loadConfig();
  }, [isOpen]);

  const handleSave = async () => {
    const peakShavingPayload =
      tariffMode === "peak" && enablePeakShaving
        ? {
            mode: peakMode,
            threshold: peakThreshold,
            minSOC: psMinSOC,
            maxDischarge: psMaxDischarge,
            forecastSource: psForecastSource,
            softLimit,
            hardLimit,
            maintainSoft: psMaintainSoft,
            forceHard: psForceHard,
          }
        : null;

    const cappedPayload =
      tariffMode === "capped"
        ? {
            priceSource: cappedPriceSource,
            apiUrl: cappedApiUrl,
            refreshMin: cappedRefreshMin,
            priceCap,
            priceFloor,
            arbThreshold,
            rules: {
              cappedAggressivelyCharge,
              cappedPreventImport,
              cappedAllowExport,
            },
          }
        : null;

    const virtualPayload =
      tariffMode === "virtual"
        ? {
            customerTariffType,
            flatPrice,
            aggregatorShare,
            guaranteedSavings,
            settlementMethod,
            billingOutputs,
            virtualStrategy,
          }
        : null;

    const payload = {
      tariffMode,
      bess: {
        maxCharge,
        maxDischarge,
        minSOC,
        maxSOC,
        maxCyclesPerDay: bessMaxCyclesPerDay,
        backupSOC: backupSOC,
      },

      windows,
      rules: {
        allowOffPeakCharge,
        dischargeOnlyPeak,
        allowChargeOnlySolar,
        reserveSOC,
      },
      peakShaving: peakShavingPayload,
      capped: cappedPayload,
      virtual: virtualPayload,
    };

    // 🔥 Open password modal instead of saving directly
    if (!canControl) {
  console.warn("User has no BESS control permission");
  return;
}

setPendingPayload(payload);
setIsPasswordOpen(true);

  };

  // 🔥 Password confirm handler
  const handlePasswordConfirm = async (password: string) => {
    try {
      setSaving(true);
      const data = await saveStrategyConfiguration(pendingPayload, password);
      console.log("Tariff config saved OK:", data);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
      setIsPasswordOpen(false);
      onClose();
    }
  };

  const priceSourceLabel = (val: string) => {
    switch (val) {
      case "dayahead":
        return "Day-Ahead Market";
      case "real":
        return "Intraday Market";
      case "custom":
        return "API URL";
      case "xls":
        return "XLS Upload";
      default:
        return "Select";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent fontSize="xs">
        <ModalHeader fontSize="sm" py={1.5}>
          EMS Tariff Configuration
        </ModalHeader>
        <ModalCloseButton top="8px" />
        <ModalBody py={2} px={3}>
          <Grid templateColumns="240px 1fr" gap={3}>
            {/* LEFT COLUMN: Tariff mode + BESS params */}
            <GridItem>
              <VStack align="stretch" spacing={3}>
                <Box px={2} py={1}>
                  <Text fontWeight={600} mb={1} fontSize="xs">
                    Tariff Mode
                  </Text>
                  <RadioGroup
                    value={tariffMode}
                    onChange={(v) =>
                      setTariffMode(
                        v as "tou" | "capped" | "virtual" | "peak" | "trading"
                      )
                    }
                  >
                    <Stack spacing={1} fontSize="xs">
                      <Radio value="tou" size="sm" colorScheme="blue">
                        TOU Tariff
                      </Radio>
                      <Radio value="capped" size="sm" colorScheme="blue">
                        Capped Dynamic
                      </Radio>
                      <Radio value="virtual" size="sm" colorScheme="blue">
                        Virtual Tariff
                      </Radio>
                      <Radio value="peak" size="sm" colorScheme="blue">
                        Peak Shaving
                      </Radio>
                      <Radio value="trading" size="sm" colorScheme="blue">
                        Trading
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </Box>

                <Divider />

                <Box px={2} py={1}>
                  <Text fontWeight={600} mb={1} fontSize="xs">
                    BESS Parameters
                  </Text>

                  <Grid
                    templateColumns="auto 1fr"
                    columnGap={2}
                    rowGap={2}
                    alignItems="center"
                  >
                    {/* Max Charge (kW) */}
                    <Box>
                      <Text fontSize="2xs" lineHeight="short">
                        Max Charge
                      </Text>
                      <Text fontSize="2xs" lineHeight="short" color={muted}>
                        (kW)
                      </Text>
                    </Box>
                    <Input
                      size="xs"
                      value={maxCharge}
                      onChange={(e) => setMaxCharge(e.target.value)}
                    />

                    {/* Max Discharge (kW) */}
                    <Box>
                      <Text fontSize="2xs" lineHeight="short">
                        Max Discharge
                      </Text>
                      <Text fontSize="2xs" lineHeight="short" color={muted}>
                        (kW)
                      </Text>
                    </Box>
                    <Input
                      size="xs"
                      value={maxDischarge}
                      onChange={(e) => setMaxDischarge(e.target.value)}
                    />

                    {/* Min SOC (%) */}
                    <Box>
                      <Text fontSize="2xs" lineHeight="short">
                        Min SOC
                      </Text>
                      <Text fontSize="2xs" lineHeight="short" color={muted}>
                        (%)
                      </Text>
                    </Box>
                    <Input
                      size="xs"
                      value={minSOC}
                      onChange={(e) => setMinSOC(e.target.value)}
                    />

                    {/* Max SOC (%) */}
                    <Box>
                      <Text fontSize="2xs" lineHeight="short">
                        Max SOC
                      </Text>
                      <Text fontSize="2xs" lineHeight="short" color={muted}>
                        (%)
                      </Text>
                    </Box>
                    <Input
                      size="xs"
                      value={maxSOC}
                      onChange={(e) => setMaxSOC(e.target.value)}
                    />

                    {/* Max Cycles / day & Backup SOC (ALL TARIFF MODES) */}
                    <>
                      {/* Max Cycles / day (GLOBAL BESS) */}
                      <Box>
                        <Text fontSize="2xs" lineHeight="short">
                          Max Cycles / day
                        </Text>
                      </Box>
                      <HStack>
                        <Input
                          size="xs"
                          value={bessMaxCyclesPerDay}
                          onChange={(e) =>
                            setBessMaxCyclesPerDay(e.target.value)
                          }
                        />
                        <IconButton
                          aria-label="Edit max cycles per day"
                          size="xs"
                          icon={<EditIcon />}
                          variant="outline"
                          onClick={() => setIsMaxCyclesModalOpen(true)}
                        />
                      </HStack>

                      {/* Backup SOC (%) */}
                      <Box>
                        <Text fontSize="2xs" lineHeight="short">
                          Backup SOC
                        </Text>
                        <Text
                          fontSize="2xs"
                          lineHeight="short"
                          color={muted}
                        >
                          (%)
                        </Text>
                      </Box>
                      <Input
                        size="xs"
                        value={backupSOC}
                        onChange={(e) => setBackupSOC(e.target.value)}
                      />
                    </>
                  </Grid>
                </Box>
              </VStack>
            </GridItem>

            {/* RIGHT COLUMN */}
            <GridItem>
              <VStack align="stretch" spacing={3}>
                {/* Top action buttons */}
                <HStack justify="flex-end" spacing={2}>
                  <Button
  size="xs"
  colorScheme="purple"
  onClick={() => {
    if (!canControl) return;   // 🔥 permission check
    handleSave();
  }}
  isDisabled={!canControl}
  isLoading={saving}
  loadingText="Saving..."
>
  Save
</Button>

                  <Button
                    size="xs"
                    variant="outline"
                    onClick={onClose}
                    isDisabled={saving}
                  >
                    Reset
                  </Button>
                  <Button size="xs" colorScheme="green" isDisabled={saving}>
                    Test Optimization
                  </Button>
                </HStack>

                {/* CAPPED DYNAMIC view (Smart-ToU) */}
                {tariffMode === "capped" && (
                  <Box
                    borderRadius="8px"
                    p={2}
                    bg={softBg}
                    border={`1px solid ${cardBorder}`}
                  >
                    <Text fontWeight={700} mb={2} fontSize="xs">
                      Capped Dynamic Tariff
                    </Text>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                      <Box>
                        <Text fontSize="2xs" mb={1}>
                          Price Source
                        </Text>

                        <Select
                          size="xs"
                          value={cappedPriceSource}
                          onChange={(e) =>
                            setCappedPriceSource(
                              e.target.value as
                                | "dayahead"
                                | "real"
                                | "custom"
                                | "xls"
                            )
                          }
                        >
                          <option value="dayahead">Day-Ahead Market</option>
                          <option value="real">Intraday Market</option>
                          <option value="custom">API URL</option>
                          <option value="xls">XLS Upload</option>
                        </Select>

                        <Text fontSize="2xs" mb={1} mt={2}>
                          API URL
                        </Text>
                        <Input
                          size="xs"
                          value={cappedApiUrl}
                          onChange={(e) => setCappedApiUrl(e.target.value)}
                          placeholder="https://..."
                        />

                        <Text fontSize="2xs" mb={1} mt={2}>
                          Refresh (min)
                        </Text>
                        <Input
                          size="xs"
                          value={cappedRefreshMin}
                          onChange={(e) => setCappedRefreshMin(e.target.value)}
                        />
                      </Box>

                      <Box>
                        <Text fontSize="2xs" fontWeight={600} mb={1}>
                          Caps &amp; Thresholds
                        </Text>

                        <Grid
                          templateColumns="auto 1fr"
                          columnGap={2}
                          rowGap={2}
                          alignItems="center"
                        >
                          {/* Price Cap (₹/kWh) */}
                          <Box>
                            <Text fontSize="2xs" lineHeight="short">
                              Price Cap
                            </Text>
                            <Text
                              fontSize="2xs"
                              lineHeight="short"
                              color={muted}
                            >
                              (₹/kWh)
                            </Text>
                          </Box>
                          <Input
                            size="xs"
                            value={priceCap}
                            onChange={(e) => setPriceCap(e.target.value)}
                          />

                          {/* Price Floor (₹/kWh) */}
                          <Box>
                            <Text fontSize="2xs" lineHeight="short">
                              Price Floor
                            </Text>
                            <Text
                              fontSize="2xs"
                              lineHeight="short"
                              color={muted}
                            >
                              (₹/kWh)
                            </Text>
                          </Box>
                          <Input
                            size="xs"
                            value={priceFloor}
                            onChange={(e) => setPriceFloor(e.target.value)}
                          />

                          {/* Arb Threshold */}
                          <Box>
                            <Text fontSize="2xs" lineHeight="short">
                              Arb Threshold
                            </Text>
                          </Box>
                          <Input
                            size="xs"
                            value={arbThreshold}
                            onChange={(e) => setArbThreshold(e.target.value)}
                          />
                        </Grid>
                      </Box>
                    </SimpleGrid>

                    <Box
                      mt={2}
                      p={2}
                      border={`1px solid ${cardBorder}`}
                      borderRadius="8px"
                    >
                      <Text fontWeight={600} mb={1} fontSize="xs">
                        Decision Rules
                      </Text>
                      <VStack align="start" spacing={1} fontSize="2xs">
                        <Checkbox
                          size="xs"
                          isChecked={cappedAggressivelyCharge}
                          onChange={(e) =>
                            setCappedAggressivelyCharge(e.target.checked)
                          }
                        >
                          Aggressively charge when price &lt; floor
                        </Checkbox>
                        <Checkbox
                          size="xs"
                          isChecked={cappedPreventImport}
                          onChange={(e) =>
                            setCappedPreventImport(e.target.checked)
                          }
                        >
                          Prevent import when price &gt; cap
                        </Checkbox>
                        <Checkbox
                          size="xs"
                          isChecked={cappedAllowExport}
                          onChange={(e) =>
                            setCappedAllowExport(e.target.checked)
                          }
                        >
                          Allow export when profitable
                        </Checkbox>
                      </VStack>
                    </Box>

                    <Box
                      mt={2}
                      p={3}
                      border={`1px dashed ${cardBorder}`}
                      borderRadius="8px"
                      textAlign="center"
                    >
                      <Text color={muted} fontSize="2xs">
                        24-hour Price Preview
                      </Text>
                      <Box
                        h="80px"
                        mt={2}
                        borderRadius="6px"
                        bg={useColorModeValue("#fafafa", "#071019")}
                      />
                    </Box>
                  </Box>
                )}

                {/* VIRTUAL TARIFF view */}
                {tariffMode === "virtual" && (
                  <Box
                    borderRadius="8px"
                    p={2}
                    bg={softBg}
                    border={`1px solid ${cardBorder}`}
                  >
                    <Text fontWeight={700} mb={2} fontSize="xs">
                      Virtual Tariff (Aggregator)
                    </Text>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                      <Box>
                        <Text fontSize="2xs" mb={1}>
                          Customer Tariff Type
                        </Text>
                        <Select
                          size="xs"
                          value={customerTariffType}
                          onChange={(e) =>
                            setCustomerTariffType(
                              e.target.value as "0" | "1"
                            )
                          }
                        >
                          {Object.entries(touTypeOptions).map(
                            ([key, label]) => (
                              <option key={key} value={key}>
                                {label}
                              </option>
                            )
                          )}
                        </Select>

                        <Text fontSize="2xs" mb={1} mt={2}>
                          Flat Price
                        </Text>
                        <Input
                          size="xs"
                          value={flatPrice}
                          onChange={(e) => setFlatPrice(e.target.value)}
                        />

                        <Text fontSize="2xs" mb={1} mt={2}>
                          Aggregator Profit Share (%)
                        </Text>
                        <Input
                          size="xs"
                          value={aggregatorShare}
                          onChange={(e) =>
                            setAggregatorShare(e.target.value)
                          }
                        />

                        <Text fontSize="2xs" mb={1} mt={2}>
                          Guaranteed Savings (₹/month)
                        </Text>
                        <Input
                          size="xs"
                          value={guaranteedSavings}
                          onChange={(e) =>
                            setGuaranteedSavings(e.target.value)
                          }
                        />
                      </Box>

                      <Box>
                        <Text fontSize="2xs" mb={1}>
                          Settlement Method
                        </Text>
                        <Select
                          size="xs"
                          value={settlementMethod}
                          onChange={(e) =>
                            setSettlementMethod(
                              e.target.value as "0" | "1" | "2"
                            )
                          }
                        >
                          {Object.entries(settlementMethodOptions).map(
                            ([key, label]) => (
                              <option key={key} value={key}>
                                {label}
                              </option>
                            )
                          )}
                        </Select>

                        <Text fontSize="2xs" mb={1} mt={2}>
                          Billing Output
                        </Text>
                        <HStack spacing={1}>
                          <Button
                            size="2xs"
                            variant={billingOutputs.pdf ? "solid" : "outline"}
                            onClick={() =>
                              setBillingOutputs((s) => ({
                                ...s,
                                pdf: !s.pdf,
                              }))
                            }
                          >
                            PDF
                          </Button>
                          <Button
                            size="2xs"
                            variant={billingOutputs.csv ? "solid" : "outline"}
                            onClick={() =>
                              setBillingOutputs((s) => ({
                                ...s,
                                csv: !s.csv,
                              }))
                            }
                          >
                            CSV
                          </Button>
                          <Button
                            size="2xs"
                            variant={billingOutputs.api ? "solid" : "outline"}
                            onClick={() =>
                              setBillingOutputs((s) => ({
                                ...s,
                                api: !s.api,
                              }))
                            }
                          >
                            API
                          </Button>
                        </HStack>

                        <Box mt={3}>
                          <Text fontWeight={600} mb={1} fontSize="2xs">
                            Arbitrage Strategy
                          </Text>
                          <VStack align="start" spacing={1} fontSize="2xs">
                            <RadioGroup
                              value={virtualStrategy}
                              onChange={(v) =>
                                setVirtualStrategy(
                                  v as "maxrev" | "balanced" | "solar"
                                )
                              }
                            >
                              <Stack direction="row" spacing={2}>
                                <Radio size="xs" value="maxrev">
                                  Maximise revenue
                                </Radio>
                                <Radio size="xs" value="solar">
                                  Solar-first
                                </Radio>
                                <Radio size="xs" value="balanced">
                                  Balanced cycles
                                </Radio>
                              </Stack>
                            </RadioGroup>
                          </VStack>
                        </Box>
                      </Box>
                    </SimpleGrid>

                    <Box
                      mt={2}
                      p={2}
                      border={`1px solid ${cardBorder}`}
                      borderRadius="8px"
                    >
                      <Text color={muted} fontSize="2xs">
                        Simulation Result
                      </Text>
                      <Text fontSize="2xs" mt={1}>
                        No simulation run yet. Click{" "}
                        <strong>Test Optimization</strong> to preview expected
                        performance.
                      </Text>
                    </Box>
                  </Box>
                )}

                {/* PEAK SHAVING view (API wired) */}
                {tariffMode === "peak" && (
                  <Box
                    borderRadius="8px"
                    p={2}
                    bg={softBg}
                    border={`1px solid ${cardBorder}`}
                  >
                    <Text fontWeight={700} mb={2} fontSize="xs">
                      Peak Shaving Configuration
                    </Text>

                    <VStack align="stretch" spacing={2}>
                      <Checkbox
                        size="xs"
                        isChecked={enablePeakShaving}
                        onChange={(e) =>
                          setEnablePeakShaving(e.target.checked)
                        }
                      >
                        Enable Peak Shaving
                      </Checkbox>

                      {/* Peak Shaving Mode box */}
                      <Box
                        p={2}
                        borderRadius="8px"
                        border={`1px solid ${cardBorder}`}
                      >
                        <Text fontWeight={600} mb={1} fontSize="2xs">
                          Peak Shaving Mode
                        </Text>
                        <RadioGroup
                          value={peakMode}
                          onChange={(v) =>
                            setPeakMode(
                              v as "soft" | "hard" | "predictive"
                            )
                          }
                        >
                          <Stack direction="row" spacing={3} fontSize="2xs">
                            <Radio
                              size="sm"
                              colorScheme="blue"
                              value="soft"
                              isDisabled={!enablePeakShaving}
                            >
                              Soft
                            </Radio>
                            <Radio
                              size="sm"
                              colorScheme="blue"
                              value="hard"
                              isDisabled={!enablePeakShaving}
                            >
                              Hard
                            </Radio>
                            <Radio
                              size="sm"
                              colorScheme="blue"
                              value="predictive"
                              isDisabled={!enablePeakShaving}
                            >
                              Predictive
                            </Radio>
                          </Stack>
                        </RadioGroup>
                      </Box>

                      <Box
                        p={2}
                        borderRadius="8px"
                        border={`1px solid ${cardBorder}`}
                      >
                        <Text fontWeight={600} mb={1} fontSize="2xs">
                          General Settings
                        </Text>

                        <Grid
                          templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                          gap={2}
                        >
                          <Box>
                            <Text fontSize="2xs" mb={1}>
                              Peak Shaving Threshold (kW)
                            </Text>
                            <Input
                              size="xs"
                              placeholder="Enter threshold"
                              value={peakThreshold}
                              onChange={(e) =>
                                setPeakThreshold(e.target.value)
                              }
                              isDisabled={!enablePeakShaving}
                            />
                          </Box>

                          <Box>
                            <Text fontSize="2xs" mb={1}>
                              Minimum SOC (%)
                            </Text>
                            <Input
                              size="xs"
                              placeholder="e.g., 20"
                              value={psMinSOC}
                              onChange={(e) => setPsMinSOC(e.target.value)}
                              isDisabled={!enablePeakShaving}
                            />
                          </Box>

                          <Box>
                            <Text fontSize="2xs" mb={1}>
                              Max Discharge Power (kW)
                            </Text>
                            <Input
                              size="xs"
                              placeholder=""
                              value={psMaxDischarge}
                              onChange={(e) =>
                                setPsMaxDischarge(e.target.value)
                              }
                              isDisabled={!enablePeakShaving}
                            />
                          </Box>

                          <Box>
                            <Text fontSize="2xs" mb={1}>
                              Forecast Source
                            </Text>
                            <Select
                              size="xs"
                              value={psForecastSource}
                              onChange={(e) =>
                                setPsForecastSource(
                                  e.target.value as
                                    | "none"
                                    | "ai"
                                    | "manual"
                                    | "external"
                                )
                              }
                              isDisabled={!enablePeakShaving}
                            >
                              <option value="none">None</option>
                              <option value="ai">AI Forecast</option>
                              <option value="manual">Manual Input</option>
                              <option value="external">External API</option>
                            </Select>
                          </Box>
                        </Grid>
                      </Box>

                      <Box
                        p={2}
                        borderRadius="8px"
                        border={`1px solid ${cardBorder}`}
                      >
                        <Text fontWeight={600} mb={1} fontSize="2xs">
                          Advanced Settings
                        </Text>

                        <Grid
                          templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                          gap={2}
                        >
                          <Box>
                            <Text fontSize="2xs" mb={1}>
                              Soft Limit (kW)
                            </Text>
                            <Input
                              size="xs"
                              placeholder=""
                              value={softLimit}
                              onChange={(e) => setSoftLimit(e.target.value)}
                              isDisabled={!enablePeakShaving}
                            />
                          </Box>

                          <Box>
                            <Text fontSize="2xs" mb={1}>
                              Hard Limit (kW)
                            </Text>
                            <Input
                              size="xs"
                              placeholder=""
                              value={hardLimit}
                              onChange={(e) => setHardLimit(e.target.value)}
                              isDisabled={!enablePeakShaving}
                            />
                          </Box>
                        </Grid>

                        <VStack
                          align="start"
                          spacing={1}
                          mt={2}
                          fontSize="2xs"
                        >
                          <Checkbox
                            size="xs"
                            isChecked={psMaintainSoft}
                            onChange={(e) =>
                              setPsMaintainSoft(e.target.checked)
                            }
                            isDisabled={!enablePeakShaving}
                          >
                            Maintain load under soft limit using BESS
                          </Checkbox>
                          <Checkbox
                            size="xs"
                            isChecked={psForceHard}
                            onChange={(e) =>
                              setPsForceHard(e.target.checked)
                            }
                            isDisabled={!enablePeakShaving}
                          >
                            Force control to stay under hard limit
                          </Checkbox>
                        </VStack>
                      </Box>

                      <Box
                        p={2}
                        borderRadius="8px"
                        border={`1px solid ${cardBorder}`}
                      >
                        <Text fontWeight={700} mb={1} fontSize="2xs">
                          Simulation Preview
                        </Text>
                        <Box
                          h="150px"
                          borderRadius="6px"
                          bg={useColorModeValue("#f3f4f6", "#071019")}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text color={muted} fontSize="2xs">
                            Load Curve + Threshold + BESS Discharge (Mock Chart)
                          </Text>
                        </Box>
                      </Box>
                    </VStack>
                  </Box>
                )}

                {/* Trading Configuration box (NEW) */}
                {tariffMode === "peak" && (
                  <Box
                    borderRadius="8px"
                    p={2}
                    bg={softBg}
                    border={`1px solid ${cardBorder}`}
                  >
                    <HStack justify="space-between" align="center">
                      <Text fontWeight={700} fontSize="xs">
                        Trading Configuration
                      </Text>
                      <IconButton
                        aria-label="View Trading Visualization"
                        icon={<ViewIcon />}
                        size="xs"
                        onClick={() => setIsTradingModalOpen(true)}
                      />
                    </HStack>
                  </Box>
                )}

                {/* TRADING view */}
                {tariffMode === "trading" && (
                  <Box
                    borderRadius="8px"
                    p={2}
                    bg={softBg}
                    border={`1px solid ${cardBorder}`}
                  >
                    <HStack justify="space-between" align="center">
                      <Text fontWeight={700} fontSize="xs">
                        Trading Configuration
                      </Text>
                      <IconButton
                        aria-label="View Trading Visualization"
                        icon={<ViewIcon />}
                        size="xs"
                        onClick={() => setIsTradingModalOpen(true)}
                      />
                    </HStack>
                  </Box>
                )}

                {/* TOU view (Flat-ToU) */}
                {tariffMode === "tou" && (
                  <Box
                    borderRadius="8px"
                    p={2}
                    bg={softBg}
                    border={`1px solid ${cardBorder}`}
                  >
                    <Text fontWeight={700} mb={2} fontSize="xs">
                      Time-of-Use (TOU) Settings
                    </Text>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                      {windows.map((w) => (
                        <Box
                          key={w.id}
                          borderRadius="8px"
                          p={2}
                          border={`1px solid ${cardBorder}`}
                        >
                          <HStack justify="space-between" mb={1}>
                            <Text fontWeight={600} fontSize="xs">
                              {w.name}
                            </Text>
                            <Button
                              variant="ghost"
                              size="2xs"
                              onClick={() => removeWindow(w.id)}
                              leftIcon={<DeleteIcon />}
                            >
                              Remove
                            </Button>
                          </HStack>

                          <VStack align="stretch" spacing={1} fontSize="2xs">
                            <HStack>
                              <Text w="60px">Start</Text>
                              <Input
                                size="xs"
                                type="time"
                                value={w.start}
                                onChange={(e) =>
                                  updateWindow(w.id, {
                                    start: e.target.value,
                                  })
                                }
                              />
                            </HStack>
                            <HStack>
                              <Text w="60px">End</Text>
                              <Input
                                size="xs"
                                type="time"
                                value={w.end}
                                onChange={(e) =>
                                  updateWindow(w.id, { end: e.target.value })
                                }
                              />
                            </HStack>
                            <HStack>
                              <Text w="60px">Price</Text>
                              <Input
                                size="xs"
                                value={w.price}
                                onChange={(e) =>
                                  updateWindow(w.id, {
                                    price: e.target.value,
                                  })
                                }
                              />
                            </HStack>
                          </VStack>
                        </Box>
                      ))}
                    </SimpleGrid>

                    <Box
                      mt={2}
                      p={2}
                      borderWidth={1}
                      borderStyle="dashed"
                      borderColor={cardBorder}
                      borderRadius="8px"
                    >
                      <HStack
                        justify="space-between"
                        align="center"
                        flexWrap="wrap"
                        rowGap={1}
                      >
                        {/* Window type selector */}
                        <HStack>
                          <Text fontSize="2xs" mr={1}>
                            New window type:
                          </Text>
                          <Select
                            size="xs"
                            w="130px"
                            value={newWindowType}
                            onChange={(e) =>
                              setNewWindowType(
                                e.target.value as
                                  | "Off-peak"
                                  | "Mid-peak"
                                  | "Peak"
                              )
                            }
                          >
                            <option value="Off-peak">Off-peak</option>
                            <option value="Mid-peak">Mid-peak</option>
                            <option value="Peak">Peak</option>
                          </Select>
                        </HStack>

                        {/* Add button */}
                        <Button
                          size="2xs"
                          variant="ghost"
                          leftIcon={<AddIcon />}
                          onClick={addWindow}
                        >
                          Add Window
                        </Button>
                      </HStack>
                    </Box>

                    <Box
                      mt={2}
                      borderRadius="8px"
                      p={2}
                      bg={softBg}
                      border={`1px solid ${cardBorder}`}
                    >
                      <Text fontWeight={700} mb={1} fontSize="xs">
                        Optimization Rules
                      </Text>
                      <SimpleGrid
                        columns={2}
                        spacing={2}
                        alignItems="center"
                        fontSize="2xs"
                      >
                        <Checkbox
                          size="xs"
                          isChecked={allowOffPeakCharge}
                          onChange={(e) =>
                            setAllowOffPeakCharge(e.target.checked)
                          }
                        >
                          Allow charging during off-peak
                        </Checkbox>
                        <HStack>
                          <Checkbox
                            size="xs"
                            isChecked={allowChargeOnlySolar}
                            onChange={(e) =>
                              setAllowChargeOnlySolar(e.target.checked)
                            }
                          >
                            Allow charging only from solar
                          </Checkbox>
                        </HStack>

                        <Checkbox
                          size="xs"
                          isChecked={dischargeOnlyPeak}
                          onChange={(e) =>
                            setDischargeOnlyPeak(e.target.checked)
                          }
                        >
                          Discharge only during peak
                        </Checkbox>
                        <HStack>
                          <Text>Reserve SOC:</Text>
                          <Input
                            size="xs"
                            w="60px"
                            value={reserveSOC}
                            onChange={(e) => setReserveSOC(e.target.value)}
                          />
                        </HStack>
                      </SimpleGrid>
                    </Box>
                  </Box>
                )}

                {/* Simulation Result (fallback) */}
                <Box
                  borderRadius="8px"
                  p={2}
                  bg={softBg}
                  border={`1px solid ${cardBorder}`}
                >
                  <Text fontWeight={700} mb={1} fontSize="xs">
                    Simulation Result
                  </Text>
                  <Text color={muted} fontSize="2xs">
                    No simulation run yet. Click{" "}
                    <strong>Test Optimization</strong> to preview expected
                    performance.
                  </Text>
                </Box>
              </VStack>
            </GridItem>
          </Grid>
        </ModalBody>

        {/* NEW: Max Cycles per Day Modal */}
        <MaxCyclesPerDayModal
          isOpen={isMaxCyclesModalOpen}
          onClose={() => setIsMaxCyclesModalOpen(false)}
          value={bessMaxCyclesPerDay}
          onSave={handleMaxCyclesSave}
        />

        {/* NEW: Trading Visualization Modal */}
        <Modal isOpen={isTradingModalOpen} onClose={() => setIsTradingModalOpen(false)} size="4xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontSize="sm" py={1.5}>
              Trading Visualization
            </ModalHeader>
            <ModalCloseButton top="8px" />
            <ModalBody py={2} px={3}>
              <RTMAdjustmentDashboard />
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Password Confirmation Modal */}
        <ConfirmPasswordModal
          isOpen={isPasswordOpen}
          onClose={() => setIsPasswordOpen(false)}
          onConfirm={handlePasswordConfirm}
        />
      </ModalContent>
    </Modal>
  );
}
