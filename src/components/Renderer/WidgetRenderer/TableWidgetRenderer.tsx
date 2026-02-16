// TableWidgetRenderer.tsx
import React from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  useColorModeValue,
  VStack,
  Tooltip,
} from "@chakra-ui/react";

interface TableColumn {
  key: string;
  label: string;
}

interface TableWidgetConfig {
  title?: string;
  table?: {
    columns?: TableColumn[];
    pageSize?: number;
    mode?: "latest" | "history"; // ✅ NEW
  };
  dataSource?: {
    keys?: { key: string; alias?: string }[];
    statusKey?: string;
    staleThresholdSeconds?: number;
  };
}

interface TableWidgetRendererProps {
  config: TableWidgetConfig & any;
  data: any;
}

const TableWidgetRenderer: React.FC<TableWidgetRendererProps> = ({ config, data }) => {
  const primaryBg = useColorModeValue("white", "gray.800");
  const primaryColor = useColorModeValue("gray.800", "white");
  const primaryBorder = useColorModeValue("gray.200", "gray.600");
  const subTextColor = useColorModeValue("gray.500", "gray.400");

  const keysCfg = config.dataSource?.keys || [];
  const statusKeyConfig = config.dataSource?.statusKey;
  const staleThresholdSeconds = config.dataSource?.staleThresholdSeconds ?? 300;

  // ✅ table mode
  const tableMode: "latest" | "history" =
    config.table?.mode === "history" ? "history" : "latest";

  // ✅ Resolve backend envelopes
  const incoming =
    data?.advanceTableData ??
    data?.tableData ??
    data?.data ??
    data?.advanceTable ??
    data ??
    null;

  let rows: any[] = [];

  // =======================
  // NORMALIZE DATA
  // =======================
  if (incoming && typeof incoming === "object") {
    Object.entries(incoming as Record<string, any>).forEach(
      ([deviceId, deviceData]: [string, any]) => {
        if (!deviceData || typeof deviceData !== "object") return;

        // ------------------------------------------------
        // HISTORY MODE → multiple timestamp rows
        // ------------------------------------------------
        if (tableMode === "history") {
          const tsMap: Record<number, any> = {};

          keysCfg.forEach((kCfg: any) => {
            const series = deviceData[kCfg.key];
            if (!Array.isArray(series)) return;

            series.forEach((pt: any) => {
              const ts = pt.ts ?? pt.timestamp;
              if (!ts) return;

              if (!tsMap[ts]) {
                tsMap[ts] = {
                  device: deviceId,
                  ts,
                };
              }

              let val = pt.value ?? pt.v ?? null;
              if (val && typeof val === "object") val = null;

              tsMap[ts][kCfg.key] = val;
            });
          });

          rows.push(...Object.values(tsMap));
          return;
        }

        // ------------------------------------------------
        // LATEST MODE → per device single row
        // ------------------------------------------------
        const row: any = { device: deviceId };

        keysCfg.forEach((kCfg: any) => {
          const series = deviceData[kCfg.key];
          if (Array.isArray(series) && series.length > 0) {
            const lastPoint = series[series.length - 1];
            let val = lastPoint?.value ?? lastPoint?.v ?? null;
            if (val && typeof val === "object") val = null;

            row[kCfg.key] = val;
            row[`${kCfg.key}_ts`] =
              lastPoint?.ts ?? lastPoint?.timestamp ?? null;
          } else {
            row[kCfg.key] = null;
            row[`${kCfg.key}_ts`] = null;
          }
        });

        rows.push(row);
      }
    );
  }

  // =======================
  // COLUMNS
  // =======================
  let columns: TableColumn[] =
    config.table?.columns && config.table.columns.length > 0
      ? config.table.columns
      : keysCfg.length > 0
        ? [
            { key: "device", label: "Device" },
            { key: "ts", label: "Timestamp" },
            ...keysCfg.map((k: any) => ({
              key: k.key,
              label: k.alias || k.key,
            })),
          ]
        : [];

  const pageSize = config.table?.pageSize || 50;
  const visibleRows = rows.slice(0, pageSize);

  // =======================
  // HELPERS
  // =======================
  const formatTs = (ts: any) => {
    if (!ts) return "-";
    const d = new Date(Number(ts));
    return isNaN(d.getTime()) ? "-" : d.toLocaleString();
  };

  const findTsForKey = (row: any, key?: string) => {
    if (row.ts) return row.ts;
    if (key && row[`${key}_ts`]) return row[`${key}_ts`];
    for (const k of keysCfg) {
      if (row[`${k.key}_ts`]) return row[`${k.key}_ts`];
    }
    return null;
  };

  const nowMs = Date.now();

  const getStatusForRow = (row: any) => {
    const statusKey = statusKeyConfig || keysCfg[0]?.key;
    if (!statusKey) return { color: "gray", reason: "no_key" };

    const val = row[statusKey];
    const ts = findTsForKey(row, statusKey);

    if (!ts || nowMs - Number(ts) > staleThresholdSeconds * 1000) {
      return { color: "gray", reason: "stale" };
    }

    const num = Number(val);
    if (!isNaN(num)) {
      if (num > 0) return { color: "green", reason: "gt_zero" };
      if (num === 0) return { color: "red", reason: "zero" };
    }

    return val ? { color: "green", reason: "value" } : { color: "red", reason: "no_value" };
  };

  // =======================
  // RENDER
  // =======================
  return (
    <Box w="100%" h="100%" py="16px" rounded="12px" bg={primaryBg} fontSize="14px">
      <VStack w="100%" h="100%" align="left">
        {config.title && (
          <Text fontSize="16px" fontWeight="600" mb={4} px="16px">
            {config.title}
          </Text>
        )}

        <TableContainer flex="1" overflowY="auto" w="100%">
          <Table size="sm">
            <Thead>
              <Tr bg={primaryBorder}>
                {columns.map((col) => (
                  <Th key={col.key} textAlign="center" fontSize="xs">
                    {col.label}
                  </Th>
                ))}
              </Tr>
            </Thead>

            <Tbody>
              {visibleRows.length === 0 ? (
                <Tr>
                  <Td colSpan={columns.length} textAlign="center">
                    <Text fontSize="xs" color={subTextColor}>
                      No data available
                    </Text>
                  </Td>
                </Tr>
              ) : (
                visibleRows.map((row, idx) => (
                  <Tr key={idx}>
                    {columns.map((col) => {
                      const key = col.key.toLowerCase();

                      if (key === "ts" || key === "timestamp") {
                        return (
                          <Td key={col.key} textAlign="center" fontSize="xs">
                            {formatTs(findTsForKey(row))}
                          </Td>
                        );
                      }

                      if (key === "status") {
                        const st = getStatusForRow(row);
                        const color =
                          st.color === "green"
                            ? "green.400"
                            : st.color === "red"
                            ? "red.400"
                            : "gray.400";

                        return (
                          <Td key={col.key} textAlign="center">
                            <Tooltip label={st.reason}>
                              <Box
                                w="12px"
                                h="12px"
                                borderRadius="50%"
                                bg={color}
                                mx="auto"
                              />
                            </Tooltip>
                          </Td>
                        );
                      }

                      const val = row[col.key];
                      return (
                        <Td key={col.key} textAlign="center" fontSize="xs">
                          {val ?? "-"}
                        </Td>
                      );
                    })}
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
    </Box>
  );
};

export default TableWidgetRenderer;
