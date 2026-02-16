import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  ButtonGroup,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import type { WidgetTemplate } from "../../types/widget/widgetTemplates";
import EditModeUI from "./EditModeUI";

interface EditWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  widget: WidgetTemplate | null;
  onSave: (updatedWidget: WidgetTemplate) => Promise<void>;
}

const EditWidgetModal = ({ isOpen, onClose, widget, onSave }: EditWidgetModalProps) => {
  const [mode, setMode] = useState<"json" | "edit">("edit");
  const [editedConfig, setEditedConfig] = useState("");

  /** ✨ Widget Props */
  const [widgetProps, setWidgetProps] = useState<any>({});

  /** Loading state for save operation */
  const [isSaving, setIsSaving] = useState(false);

  /** UI States */
  const [title, setTitle] = useState("");
  const [chartType, setChartType] = useState("spline");
  const [selectedDeviceTypes, setSelectedDeviceTypes] = useState<string[]>([]);
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);
  const [selectedParams, setSelectedParams] = useState<string[]>([]);

  const [dateType, setDateType] = useState<"absolute" | "relative" | "last">("relative");
  const [presetRange, setPresetRange] = useState("currentDaySoFar");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [lastValue, setLastValue] = useState(7);
  const [lastUnit, setLastUnit] = useState("day");

  const [aggregation, setAggregation] = useState("avg");
  const [interval, setInterval] = useState(15);
  const [intervalType, setIntervalType] = useState("minutes");
  const [orderBy, setOrderBy] = useState("DESC");

  const [parameterChartTypes, setParameterChartTypes] = useState<Record<string, string>>({});

  const [parameterAliases, setParameterAliases] = useState<Record<string, string>>({});

  const bg = useColorModeValue("gray.50", "gray.900");
  const textareaBg = useColorModeValue("white", "gray.800");
  const textareaColor = useColorModeValue("gray.800", "green.700");
  const textColor = useColorModeValue("gray.800", "white");
  const primaryBtn = useColorModeValue("blue", "teal");
  const secondaryBtn = useColorModeValue("gray", "gray");

  // Helpers: format milliseconds -> datetime-local input string, and parse input -> ms
  const formatMsToLocalInput = (ms?: number | null) => {
    if (!ms && ms !== 0) return "";
    const d = new Date(ms as number);
    const YYYY = d.getFullYear();
    const MM = String(d.getMonth() + 1).padStart(2, "0");
    const DD = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${YYYY}-${MM}-${DD}T${hh}:${mm}`;
  };

  const parseInputToMs = (input: string) => {
    if (!input) return undefined;
    const t = new Date(input).getTime();
    return Number.isNaN(t) ? undefined : t;
  };

  /** -----------------------------------------------------------
   * LOAD WIDGET WHEN MODAL OPENS
   * ----------------------------------------------------------- */
  useEffect(() => {
    if (!isOpen || !widget) return;

    setMode("edit");
    setEditedConfig(JSON.stringify(widget, null, 2));

    setTitle(widget.title || "");
    
    // Only set chartType for graph widgets
    if (widget?.type === "graph") {
      setChartType((widget as any)?.graph?.type || "spline")
    } else {
      setChartType(undefined as any);
    }
    
    setWidgetProps(widget.props || {});

    const ds = (widget as any).dataSource || {};

    setSelectedDeviceIds(ds?.devices?.ids || []);

    const normalize = (p: string) => {
      p = p.toLowerCase();
      if (p.includes("bank")) return "bank";
      if (p.includes("pcs")) return "pcs";
      if (p.includes("rack")) return "rack";
      if (p.includes("module")) return "module";
      if (p.includes("inverter")) return "inverter";
      return p;
    };

    const rawPatterns: string[] = ds?.devices?.patterns || [];
    setSelectedDeviceTypes(Array.from(new Set(rawPatterns.map(normalize))));

    setSelectedParams(
      ds?.keys?.map((k: any) => (typeof k === "string" ? k : k.key)) || []
    );

    const tr = ds?.timeRange || {};

    setDateType(tr.type || "relative");
    setPresetRange(tr.relativeType || "currentDaySoFar");
    setFrom(tr.startTs ? formatMsToLocalInput(tr.startTs) : tr.from || "");
    setTo(tr.endTs ? formatMsToLocalInput(tr.endTs) : tr.to || "");
    setLastValue(tr.interval || 7);

    const intType = tr.intervalType || "day";
    setLastUnit(intType.charAt(0).toUpperCase() + intType.slice(1));

    setAggregation(ds?.aggregation?.func || "avg");
    setInterval(ds?.aggregation?.interval || 15);
    setIntervalType(ds?.aggregation?.intervalType || "minutes");
    setOrderBy(ds?.orderBy || "DESC");

    setParameterChartTypes((widget as any)?.parameterChartTypes || {});

    setParameterAliases((widget as any)?.parameterAliases || {});
  }, [isOpen, widget]);

  /** -----------------------------------------------------------
   * FINAL JSON BUILDER
   * ----------------------------------------------------------- */
  const buildFinalJSON = () => {
    return {
      ...(widget || {}),

      title: title || widget?.title || "Untitled Widget",

      /** ✨ CHART TYPE FOR GRAPH WIDGETS */
      ...(widget?.type === "graph" ? { graph: { type: chartType } } : {}),

      /** ✨ PARAMETER CHART TYPES */
      ...(Object.keys(parameterChartTypes).length > 0 ? { parameterChartTypes } : {}),

      /** ✨ PARAMETER ALIASES */
      ...(Object.keys(parameterAliases).length > 0 ? { parameterAliases } : {}),

      /** ✨ FINAL WIDGET PROPS MERGED */
      props: { ...widgetProps },

      dataSource: {
        ...(widget as any)?.dataSource,

        devices: {
          ids: selectedDeviceIds,
          patterns: selectedDeviceTypes.map((t) => t.toLowerCase()),
        },

        keys: selectedParams.map((p) => ({ 
          key: p, 
          alias: parameterAliases[p] || p 
        })),

        timeRange: {
          type: dateType,
          interval: dateType === "last" ? lastValue : 1,
          intervalType: dateType === "last" ? lastUnit.toLowerCase() : "day",
          ...(dateType === "absolute"
            ? (() => {
                const obj: any = {};
                const s = parseInputToMs(from);
                const e = parseInputToMs(to);
                if (s !== undefined) obj.startTs = s;
                if (e !== undefined) obj.endTs = e;
                return obj;
              })()
            : {}),
          ...(dateType === "relative" ? { relativeType: presetRange } : {}),
        },

        aggregation: {
          func: aggregation,
          interval,
          intervalType,
        },

        orderBy,
      },
    };
  };

  /** JSON View Button */
  const handleSwitchToJson = () => {
    setMode("json");
    setEditedConfig(JSON.stringify(buildFinalJSON(), null, 2));
  };

  /** Edit Mode */
  const handleSwitchToEdit = () => {
    setMode("edit");
  };

  /** SAVE HANDLER */
  const handleSave = async () => {
    if (isSaving) return; // Prevent multiple saves

    setIsSaving(true);
    try {
      if (mode === "json") {
        await onSave(JSON.parse(editedConfig));
      } else {
        await onSave(buildFinalJSON());
      }
      onClose();
    } catch (error) {
      if (error instanceof SyntaxError) {
        alert("Invalid JSON. Please fix and retry.");
      } else {
        console.error("Error saving widget:", error);
        alert("Error saving widget. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!widget) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent bg={bg}>
        <ModalHeader display="flex" justifyContent="space-between" pr="6rem">
          <Text color={textColor}>Edit Widget: {widget.title}</Text>

          <HStack>
            <ButtonGroup isAttached size="sm">
              <Button
                variant={mode === "json" ? "solid" : "outline"}
                colorScheme={mode === "json" ? primaryBtn : secondaryBtn}
                onClick={handleSwitchToJson}
              >
                JSON View
              </Button>

              <Button
                variant={mode === "edit" ? "solid" : "outline"}
                colorScheme={mode === "edit" ? primaryBtn : secondaryBtn}
                onClick={handleSwitchToEdit}
              >
                Edit Mode
              </Button>
            </ButtonGroup>
          </HStack>
        </ModalHeader>

        <ModalCloseButton zIndex={20} />

        <ModalBody>
          {mode === "json" ? (
            <Textarea
              value={editedConfig}
              onChange={(e) => setEditedConfig(e.target.value)}
              h="60vh"
              bg={textareaBg}
              color={textareaColor}
              fontSize="sm"
              fontFamily="mono"
            />
          ) : (
            <EditModeUI
              title={title}
              onTitleChange={setTitle}
              chartType={widget?.type === "graph" ? chartType : undefined}
              onChartTypeChange={widget?.type === "graph" ? setChartType : undefined}
              selectedDeviceTypes={selectedDeviceTypes}
              onDeviceTypesChange={setSelectedDeviceTypes}
              selectedDeviceIds={selectedDeviceIds}
              onDeviceIdsChange={setSelectedDeviceIds}
              selectedParams={selectedParams}
              onParamsChange={setSelectedParams}
              dateType={dateType}
              onDateTypeChange={setDateType}
              presetRange={presetRange}
              onPresetRangeChange={setPresetRange}
              from={from}
              onFromChange={setFrom}
              to={to}
              onToChange={setTo}
              lastValue={lastValue}
              onLastValueChange={setLastValue}
              lastUnit={lastUnit}
              onLastUnitChange={setLastUnit}
              aggregation={aggregation}
              onAggregationChange={setAggregation}
              interval={interval}
              onIntervalChange={setInterval}
              intervalType={intervalType}
              onIntervalTypeChange={setIntervalType}
              orderBy={orderBy}
              onOrderByChange={setOrderBy}

              /** PARAMETER CHART TYPES - ONLY FOR GRAPH WIDGETS */
              parameterChartTypes={widget?.type === "graph" ? parameterChartTypes : undefined}
              onParameterChartTypesChange={widget?.type === "graph" ? setParameterChartTypes : undefined}

              /** PARAMETER ALIASES - ONLY FOR GRAPH WIDGETS */
              parameterAliases={widget?.type === "graph" ? parameterAliases : undefined}
              onParameterAliasesChange={widget?.type === "graph" ? setParameterAliases : undefined}

              /** PASS WIDGET PROPS TO UI */
              widgetProps={widgetProps}
              onWidgetPropsChange={setWidgetProps}
            />
          )}
        </ModalBody>

        <ModalFooter>
          <Button size="sm" mr={2} onClick={onClose}>
            Cancel
          </Button>

          <Button size="sm" mr={2} onClick={handleSwitchToJson} colorScheme={secondaryBtn}>
            Reload JSON
          </Button>

          <Button size="sm" colorScheme={primaryBtn} onClick={handleSave} isLoading={isSaving} loadingText="Saving...">
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditWidgetModal;
