// EditModeUI.tsx — FINAL RESPONSIVE + JSON WIDGET PROPS VERSION

import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  useColorModeValue,
  VStack,
  HStack,
  NumberInput,
  NumberInputField,
  Input,
  Text,
  Select,
  Checkbox,
  Spinner,
  Button,
  Textarea,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

import { useDevices } from "../../hooks/useDevices";
import {
  getAllDeviceTypes,
  getAllDeviceIds,
  getDeviceColumnsByIds,
} from "../../hooks/library/device";

interface EditModeUIProps {
  title?: string;
  onTitleChange?: (title: string) => void;

  chartType?: string;
  onChartTypeChange?: (type: string) => void;

  selectedDeviceTypes?: string[];
  onDeviceTypesChange?: (types: string[]) => void;

  selectedDeviceIds?: string[];
  onDeviceIdsChange?: (ids: string[]) => void;

  selectedParams?: string[];
  onParamsChange?: (params: string[]) => void;

  dateType?: "absolute" | "relative" | "last";
  onDateTypeChange?: (type: any) => void;

  presetRange?: string;
  onPresetRangeChange?: (range: string) => void;

  from?: string;
  onFromChange?: (from: string) => void;

  to?: string;
  onToChange?: (to: string) => void;

  lastValue?: number;
  onLastValueChange?: (val: number) => void;

  lastUnit?: string;
  onLastUnitChange?: (unit: string) => void;

  aggregation?: string;
  onAggregationChange?: (agg: string) => void;

  interval?: number;
  onIntervalChange?: (v: number) => void;

  intervalType?: string;
  onIntervalTypeChange?: (type: string) => void;

  orderBy?: string;
  onOrderByChange?: (order: string) => void;

  widgetProps?: any;
  onWidgetPropsChange?: (p: any) => void;

  parameterChartTypes?: Record<string, string>;
  onParameterChartTypesChange?: (types: Record<string, string>) => void;

  parameterAliases?: Record<string, string>;
  onParameterAliasesChange?: (aliases: Record<string, string>) => void;
}

export default function EditModeUI(props: EditModeUIProps) {
  const {
    title = "",
    onTitleChange,

    chartType,
    onChartTypeChange,

    selectedDeviceTypes = [],
    onDeviceTypesChange,

    selectedDeviceIds = [],
    onDeviceIdsChange,

    selectedParams = [],
    onParamsChange,

    dateType = "relative",
    onDateTypeChange,

    presetRange = "currentDaySoFar",
    onPresetRangeChange,

    from = "",
    onFromChange,

    to = "",
    onToChange,

    lastValue = 7,
    onLastValueChange,

    lastUnit = "day",
    onLastUnitChange,

    aggregation = "avg",
    onAggregationChange,

    interval = 15,
    onIntervalChange,

    intervalType = "minutes",
    onIntervalTypeChange,

    orderBy = "DESC",
    onOrderByChange,

    widgetProps = {},
    onWidgetPropsChange,

    parameterChartTypes = {},
    onParameterChartTypesChange,

    parameterAliases = {},
    onParameterAliasesChange,
  } = props;

  // Local copies to ensure immediate UI updates even if parent handler is missing
  const [localParamChartTypes, setLocalParamChartTypes] = useState<Record<string, string>>(parameterChartTypes || {});
  const [localParamAliases, setLocalParamAliases] = useState<Record<string, string>>(parameterAliases || {});

  // Sync with incoming props - use useMemo to stabilize dependency
  const memoParamChartTypes = useMemo(() => parameterChartTypes || {}, [JSON.stringify(parameterChartTypes)]);
  const memoParamAliases = useMemo(() => parameterAliases || {}, [JSON.stringify(parameterAliases)]);

  React.useEffect(() => {
    setLocalParamChartTypes(memoParamChartTypes);
  }, [memoParamChartTypes]);

  React.useEffect(() => {
    setLocalParamAliases(memoParamAliases);
  }, [memoParamAliases]);

  const bg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const labelColor = useColorModeValue("gray.700", "gray.300");
  const inputBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const checkboxColor = useColorModeValue("blue", "teal");

  const { devices, loading } = useDevices();

  // DEVICE TYPES
  const deviceTypes = useMemo(() => {
    if (!devices) return [];
    let types: string[] = [];

    try {
      types = getAllDeviceTypes(devices).map((t) => t.toLowerCase());
    } catch {
      devices.forEach((d: any) =>
        d?.deviceType && types.push(d.deviceType.toLowerCase())
      );
    }

    const uniq = Array.from(new Set(types));
    selectedDeviceTypes.forEach((t) => {
      if (!uniq.includes(t.toLowerCase())) uniq.push(t.toLowerCase());
    });

    return uniq;
  }, [devices, selectedDeviceTypes]);

  const allIds = useMemo(() => {
    if (!devices) return [];
    return getAllDeviceIds(devices);
  }, [devices]);

  // FILTER DEVICE IDs
  const filteredIds = useMemo(() => {
    if (!devices) return [];
    if (!selectedDeviceTypes.length) return allIds;

    const sel = selectedDeviceTypes.map((x) => x.toLowerCase());

    return devices
      .filter((d: any) => {
        const type = (d.deviceType || "").toLowerCase();
        const id = (d.device_id || "").toLowerCase();
        return (
          sel.includes(type) ||
          (sel.includes("pcs") && id.includes("_pcs_")) ||
          (sel.includes("bank") && id.includes("_bank_")) ||
          (sel.includes("rack") && id.includes("_rack_")) ||
          (sel.includes("module") && id.includes("_module_")) ||
          (sel.includes("inverter") && id.includes("_inverter_"))
        );
      })
      .map((d: any) => d.device_id);
  }, [devices, selectedDeviceTypes]);

  // LOAD TELEMETRY PARAMS
  const [telemetryOptions, setTelemetryOptions] = useState<string[]>([]);
  const [loadingParams, setLoadingParams] = useState(false);

  useEffect(() => {
    if (!selectedDeviceIds.length) {
      setTelemetryOptions([]);
      return;
    }

    const load = async () => {
      setLoadingParams(true);

      let params: string[] = [];

      try {
        const cols = await getDeviceColumnsByIds(selectedDeviceIds);

        if (Array.isArray(cols)) {
          params = cols.map((c: any) => (typeof c === "string" ? c : c.key));
        } else {
          const set = new Set<string>();
          Object.values(cols).forEach((arr: any) =>
            arr.forEach((c: any) =>
              set.add(typeof c === "string" ? c : c.key)
            )
          );
          params = [...set];
        }

        selectedParams.forEach((p) => {
          if (!params.includes(p)) params.push(p);
        });

        setTelemetryOptions(params);
      } catch {}

      setLoadingParams(false);
    };

    load();
  }, [selectedDeviceIds]);

  // PROP EDIT
  const handlePropEdit = (key: string, value: any) => {
    onWidgetPropsChange?.({ ...widgetProps, [key]: value });
  };

  const addNewProp = () => {
    const name = `prop_${Object.keys(widgetProps).length + 1}`;
    onWidgetPropsChange?.({ ...widgetProps, [name]: "" });
  };

  if (loading) return <Spinner />;

  const Label = ({ children }: any) => (
    <FormLabel fontSize="xs" fontWeight={600} color={labelColor}>
      {children}
    </FormLabel>
  );

  return (
    <Box bg={bg} border="1px" borderColor={border} p={4} borderRadius="md">
      {/* TITLE */}
      <FormControl mb={4}>
        <Label>Widget Title</Label>
        <Input
          size="sm"
          fontSize="xs"
          bg={inputBg}
          color={textColor}
          value={title}
          onChange={(e) => onTitleChange?.(e.target.value)}
        />
      </FormControl>

      {/* CHART TYPE - ONLY FOR GRAPH WIDGETS */}
      {chartType !== undefined && onChartTypeChange && (
        <FormControl mb={4}>
          <Label>Chart Type</Label>
          <Select
            size="sm"
            fontSize="xs"
            bg={inputBg}
            color={textColor}
            value={chartType}
            onChange={(e) => onChartTypeChange?.(e.target.value)}
          >
            <option value="spline">Spline</option>
            <option value="line">Line</option>
            <option value="areaspline">Areaspline</option>
            <option value="column">Column</option>
            <option value="bar">Bar</option>
          </Select>
        </FormControl>
      )}

      {/* ---------------------------------------------------------------- */}
      {/*                    RESPONSIVE 3-COLUMN DEVICE GRID               */}
      {/* ---------------------------------------------------------------- */}

      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2,1fr)",
          lg: "repeat(3,1fr)",
        }}
        gap={4}
      >
        {/* DEVICE TYPES */}
        <GridItem>
          <Label>Device Type</Label>
          <Box
              border="1px"
              borderColor={border}
              p={2}
              height="260px"
              overflowY="auto"
              bg={inputBg}
            >
            <VStack align="start">
              {deviceTypes.map((t) => (
                <Checkbox
                  key={t}
                  size="sm"
                  isChecked={selectedDeviceTypes.includes(t)}
                  onChange={() =>
                    onDeviceTypesChange?.(
                      selectedDeviceTypes.includes(t)
                        ? selectedDeviceTypes.filter((x) => x !== t)
                        : [...selectedDeviceTypes, t]
                    )
                  }
                >
                  {t}
                </Checkbox>
              ))}
            </VStack>
          </Box>
        </GridItem>

        {/* DEVICE IDS */}
        <GridItem>
          <Label>Device IDs</Label>
          <Box
              border="1px"
              borderColor={border}
              p={2}
              height="260px"
              overflowY="auto"
              bg={inputBg}
            >
            <VStack align="start">
              {filteredIds.map((id) => (
                <Checkbox
                  key={id}
                  size="sm"
                  isChecked={selectedDeviceIds.includes(id)}
                  onChange={() =>
                    onDeviceIdsChange?.(
                      selectedDeviceIds.includes(id)
                        ? selectedDeviceIds.filter((x) => x !== id)
                        : [...selectedDeviceIds, id]
                    )
                  }
                >
                  {id}
                </Checkbox>
              ))}
            </VStack>
          </Box>
        </GridItem>

        {/* PARAMETERS */}
        <GridItem>
          <Label>Parameters</Label>
          <Box
              border="1px"
              borderColor={border}
              p={2}
              height="260px"
              overflowY="auto"
              overflowX="hidden"
              bg={inputBg}
            >
            {loadingParams ? (
              <Spinner size="sm" />
            ) : (
              <VStack align="start" spacing={1}>
                {telemetryOptions.map((p) => (
                  <HStack key={p} w="100%">
                    <Checkbox
                      size="sm"
                      isChecked={selectedParams.includes(p)}
                      onChange={() =>
                        onParamsChange?.(
                          selectedParams.includes(p)
                            ? selectedParams.filter((x) => x !== p)
                            : [...selectedParams, p]
                        )
                      }
                      flex={1}
                      sx={{
                        "& .chakra-checkbox__label": {
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxW: "100%",
                        },
                      }}
                    >
                      {p}
                    </Checkbox>
                    
                    {/* PENCIL ICON FOR CHART TYPE - ONLY FOR GRAPH WIDGETS */}
                    {chartType !== undefined && (
                      <Popover>
                        <PopoverTrigger>
                          <IconButton
                            aria-label="Edit parameter"
                            icon={<EditIcon />}
                            size="xs"
                            variant="ghost"
                            isDisabled={!selectedParams.includes(p)}
                          />
                        </PopoverTrigger>
                        <PopoverContent w="320px">
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <Box p={3}>
                            <Text fontSize="xs" fontWeight={600} mb={2}>Chart Type for {p}</Text>
                            <Select
                              size="sm"
                              fontSize="xs"
                              value={localParamChartTypes[p] || "spline"}
                              onChange={(e) => {
                                const next = { ...(localParamChartTypes || {}), [p]: e.target.value };
                                setLocalParamChartTypes(next);
                                onParameterChartTypesChange?.(next);
                              }}
                            >
                              <option value="spline">Spline</option>
                              <option value="line">Line</option>
                              <option value="areaspline">Areaspline</option>
                              <option value="column">Column</option>
                              <option value="bar">Bar</option>
                            </Select>

                            <Text fontSize="xs" fontWeight={600} mb={2} mt={3}>Chart Label for {p}</Text>
                            <Input
                              size="sm"
                              fontSize="xs"
                              placeholder="e.g., Temperature, Current, Voltage"
                              value={localParamAliases[p] || p}
                              onChange={(e) => {
                                const next = { ...(localParamAliases || {}), [p]: e.target.value };
                                setLocalParamAliases(next);
                                onParameterAliasesChange?.(next);
                              }}
                            />

                            <Text fontSize="xs" opacity={0.6} mt={2}>
                              Chart type and label for the selected parameter
                            </Text>
                          </Box>
                        </PopoverContent>
                      </Popover>
                    )}
                  </HStack>
                ))}
              </VStack>
            )}
          </Box>
        </GridItem>
      </Grid>

      {/* ORDER BY */}
      <FormControl mt={4}>
        <Label>Order By</Label>
          <Select
            size="sm"
            fontSize="xs"
            bg={inputBg}
            color={textColor}
            value={orderBy}
            onChange={(e) => onOrderByChange?.(e.target.value)}
        >
          <option value="ASC">ASC</option>
          <option value="DESC">DESC</option>
        </Select>
      </FormControl>

      {/* DATE TYPE */}
      <FormControl mt={4}>
        <Label>Date Type</Label>
          <Select
            size="sm"
            fontSize="xs"
            bg={inputBg}
            color={textColor}
            value={dateType}
            onChange={(e) => onDateTypeChange?.(e.target.value)}
        >
          <option value="absolute">Absolute</option>
          <option value="relative">Relative</option>
          <option value="last">Last</option>
        </Select>
      </FormControl>

      {/* DATE UI */}
      {dateType === "absolute" && (
        <Grid templateColumns="repeat(2,1fr)" gap={4} mt={3}>
          <FormControl>
            <Label>From</Label>
            <Input
              size="sm"
              fontSize="xs"
              bg={inputBg}
              color={textColor}
              type="datetime-local"
              value={from}
              onChange={(e) => onFromChange?.(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <Label>To</Label>
            <Input
              size="sm"
              fontSize="xs"
              bg={inputBg}
              color={textColor}
              type="datetime-local"
              value={to}
              onChange={(e) => onToChange?.(e.target.value)}
            />
          </FormControl>
        </Grid>
      )}

      {dateType === "relative" && (
        <FormControl mt={3}>
          <Label>Preset Range</Label>
          <Select
            size="sm"
            fontSize="xs"
            bg={inputBg}
            color={textColor}
            value={presetRange}
            onChange={(e) => onPresetRangeChange?.(e.target.value)}
          >
            <option value ="currentDaySoFar">Today So Far</option>
            <option value ="currentWeekSoFar">This Week So Far</option>
            <option value ="currentMonthSoFar">This Month So Far</option>
            <option value ="currentQuarterSoFar">This Quarter So Far</option>
          </Select>
        </FormControl>
      )}

      {dateType === "last" && (
        <Grid templateColumns="repeat(2,1fr)" gap={4} mt={3}>
          <FormControl>
            <Label>Last</Label>
            <NumberInput
              value={lastValue}
              min={1}
              onChange={(v) => onLastValueChange?.(Number(v))}
            >
              <NumberInputField size="sm" fontSize="xs" />
            </NumberInput>
          </FormControl>

          <FormControl>
            <Label>Unit</Label>
            <Select
              size="sm"
              fontSize="xs"
              bg={inputBg}
              color={textColor}
              value={lastUnit}
              onChange={(e) => onLastUnitChange?.(e.target.value)}
            >
              <option value="minute">Minute</option>
              <option value="hour">Hour</option>
              <option value="day">Day</option>
            </Select>
          </FormControl>
        </Grid>
      )}

      {/* AGGREGATION */}
      <FormControl mt={4}>
        <Label>Aggregation</Label>
        <Select
          size="sm"
          fontSize="xs"
          value={aggregation}
          onChange={(e) => onAggregationChange?.(e.target.value)}
        >
          <option value="avg">AVG</option>
          <option value="min">Min</option>
          <option value="max">Max</option>
          <option value="sum">SUM</option>
          <option value="last">Last</option>
          <option value="none">NONE</option>
        </Select>
      </FormControl>

      {/* INTERVAL */}
      {aggregation !== "none" && (
        <Grid templateColumns="repeat(2,1fr)" gap={4} mt={4}>
          <FormControl>
            <Label>Interval</Label>
            <Select
              size="sm"
              fontSize="xs"
              value={interval}
              onChange={(e) => onIntervalChange?.(Number(e.target.value))}
            >
              <option value={1}>1</option>
              <option value={5}>5</option>
              <option value={15}>15</option>
              <option value={30}>30</option>
            </Select>
          </FormControl>

          <FormControl>
            <Label>Interval Type</Label>
            <Select
              size="sm"
              fontSize="xs"
              value={intervalType}
              onChange={(e) => onIntervalTypeChange?.(e.target.value)}
            >
              <option value="minutes">minutes</option>
              <option value="hour">hour</option>
              <option value="day">day</option>
              <option value="week">week</option>
              <option value="month">month</option>
            </Select>
          </FormControl>
        </Grid>
      )}

      {/* --------------------------------------------------------------- */}
      {/*                         WIDGET PROPS                            */}
      {/* --------------------------------------------------------------- */}

      <Box mt={6} p={3} border="1px" borderColor={border} borderRadius="md">
        <Label>Widget Props</Label>

        <VStack align="stretch" spacing={2}>
          {Object.entries(widgetProps).map(([key, value]: any) => (
            <Grid key={key} templateColumns="120px 1fr" gap={2}>
              <Text fontSize="xs">{key}</Text>

              {typeof value === "object" ? (
                <Textarea
                  size="sm"
                  height="150px"
                  fontFamily="mono"
                  fontSize="xs"
                  bg={inputBg}
                  color={textColor}
                  value={JSON.stringify(value, null, 2)}
                  onChange={(e) => {
                    try {
                      handlePropEdit(key, JSON.parse(e.target.value));
                    } catch {
                      handlePropEdit(key, e.target.value);
                    }
                  }}
                />
              ) : (
                <Input
                  size="sm"
                  fontSize="xs"
                  bg={inputBg}
                  color={textColor}
                  value={String(value)}
                  onChange={(e) => handlePropEdit(key, e.target.value)}
                />
              )}
            </Grid>
          ))}

          <Button size="xs" mt={2} onClick={addNewProp}>
            + Add Widget Prop
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
