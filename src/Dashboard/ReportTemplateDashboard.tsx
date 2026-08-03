import React from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Text,
  Flex,
  useToast,
  IconButton,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { FiTrash2, FiDownload, FiEdit } from "react-icons/fi";
import useReports from "../hooks/useReports";
import useReportTemplate from "../hooks/useReportTemplate";
import { ExportReportToExcel } from "../hooks/ExportReportToExcel";
import { useNavigate } from "react-router-dom";
import { ChevronRightIcon } from "@chakra-ui/icons";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "") || "";

type Template = {
  reportName: string;
  email?: string;
  scheduleTime?: string | number | null;
  scheduleLive?: string | number | null;
  configuration?: any; // JSON object or string
};

export default function ReportTemplateDashboard() {
  const toast = useToast();
  const navigate = useNavigate();
  const [items, setItems] = React.useState<Template[]>([]);
  const [downloadReportName, setDownloadReportName] = React.useState("report.csv");

  // --- color mode tokens ---
  const bgColor = useColorModeValue("#FFFFFF", "#161B1B"); // light / dark background
  const textColor = useColorModeValue("black", "white");   // light / dark text
  const subtleText = useColorModeValue("gray.600", "gray.400");
  const iconHover = useColorModeValue("blackAlpha.100", "whiteAlpha.200");
  const iconActive = useColorModeValue("blackAlpha.200", "whiteAlpha.300");
  const dangerIconColor = useColorModeValue("red.600", "red.300");
  const dangerHoverBg = useColorModeValue("red.50", "red.500");
  const dangerActiveBg = useColorModeValue("red.100", "red.600");

  // download helpers (CSV -> replaced by Excel export)
  const downloadBlob = (data: string, filename: string, type = "application/json") => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const { generateReportByConfig, reportData } = useReports();

  const downloadTemplateJSON = async (t: Template) => {

    try {

      setDownloadReportName(t.reportName);

      const payload = {
        reportName: t.reportName,
        email: t.email ?? null,
        scheduleTime: t.scheduleTime ?? null,
        scheduleLive: t.scheduleLive ?? null,
        configuration: (() => {
          try {
            return typeof t.configuration === "string"
              ? JSON.parse(t.configuration)
              : t.configuration ?? {};
          } catch {
            return t.configuration ?? {};
          }
        })(),
      };

      // API CALL
      await generateReportByConfig(payload.configuration);

    } catch (err: any) {

      toast({
        title: "Download failed",
        description: err?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  React.useEffect(() => {

    const exportExcel = async () => {

      if (!reportData || reportData.length === 0) {
        return;
      }

      const groupedData = {
        Report: reportData.map((row: any) => {

          const formattedRow: any = {};

          Object.keys(row).forEach((key) => {

            // skip unit columns
            if (key.endsWith("_unit")) return;

            if (key === "timestamp") {

              formattedRow["time_stamp"] = row[key];

            } else {

              const unit = row[`${key}_unit`] || "";

              formattedRow[key] =
                row[key] !== null &&
                row[key] !== undefined
                  ? `${row[key]} ${unit}`.trim()
                  : "";
            }
          });

          return formattedRow;
        }),
      };

      await ExportReportToExcel({
        title: downloadReportName,
        createdAt: new Date().toLocaleString(),
        data: groupedData,
      });

    };

    exportExcel();

  }, [reportData]);

  

  // --- fetch templates ---
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/reports/templates`);
        const data = await res.json();
        if (res.ok) setItems(data);
        else toast({ title: "Error fetching templates", status: "error" });
      } catch (err: any) {
        toast({ title: "Network error", description: err?.message, status: "error" });
      }
    })();
  }, [toast]);

  // --- delete ---
  const remove = async (reportName: string) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/reports/templates/${encodeURIComponent(reportName)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (res.ok && data.ok) {
        setItems((prev) => prev.filter((t) => t.reportName !== reportName));
        toast({ title: "Deleted", status: "info", duration: 1500 });
      } else {
        toast({ title: "Error deleting template", status: "error" });
      }
    } catch (err: any) {
      toast({ title: "Network error", description: err?.message, status: "error" });
    }
  };

  // use hook to fetch single template
  const { fetchTemplateByName } = useReportTemplate();

  // --- edit (fetch single template and navigate to report with state) ---
  const handleEditTemplate = async (t: Template) => {
    try {
      const data = await fetchTemplateByName(t.reportName);
      const config = (() => {
        try {
          return typeof data.configuration === 'string' ? JSON.parse(data.configuration) : data.configuration || {};
        } catch { return data.configuration || {} }
      })();

      navigate('/report', { state: { editTemplate: { reportName: t.reportName, email: t.email ?? '', scheduleTime: t.scheduleTime ?? '', scheduleLive: t.scheduleLive ?? '', configuration: config } } });
    } catch (err: any) {
      toast({ title: 'Error loading template', description: err?.message || 'Could not load template', status: 'error' });
    }
  };

  // bulk clear (loop)
  const clearAll = async () => {
    for (const t of items) {
      try {
        await remove(t.reportName);
      } catch { }
    }
  };
  // ...existing code...

  return (
    <Box p={3} bg={bgColor} minH="100vh" color={textColor}>
      <Flex justify="space-between" align="center" mt={5} mb={6} flexWrap="wrap" gap={3}>
        <Heading size="lg">📄 Saved Report Templates</Heading>
          <Flex gap={3} flexWrap="wrap">
          <Button onClick={() => navigate("/report")} variant="outline" color={textColor}>
            + New Report
          </Button>
          <Button
            colorScheme="red"
            variant="outline"
            onClick={clearAll}
            isDisabled={!items.length}
            color={dangerIconColor}
          >
            Clear All
          </Button>
        </Flex>
      </Flex>

      {items.length === 0 ? (
        <Text color={subtleText}>No templates saved yet.</Text>
      ) : (
        <Table variant="simple" colorScheme="gray">
          <Thead>
            <Tr>
              <Th color={textColor}>REPORT NAME</Th>
              <Th color={textColor}>EMAIL</Th>
              <Th color={textColor}>SCHEDULE TIME</Th>
              <Th color={textColor}>SCHEDULE LIVE</Th>
              {/* <Th color={textColor}>CONFIGURATION</Th>  // UI se hata diya */}
              <Th color={textColor} textAlign="right">
                ACTIONS
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((t, idx) => (
              <Tr key={idx}>
                <Td>{t.reportName}</Td>
                <Td>{t.email || "-"}</Td>
                <Td>{t.scheduleTime ?? "-"}</Td>
                <Td>{t.scheduleLive ?? "-"}</Td>

                {/* CONFIGURATION COLUMN (UI se remove) */}
                {/* <Td whiteSpace="pre-wrap" fontFamily="mono" fontSize="sm">
                  {compactConfig(t.configuration)}
                </Td> */}

                {/* ACTIONS — edit + download + delete icons in one row */}
                <Td textAlign="right">
                  <Flex gap={2} justify="flex-end" align="center" wrap="nowrap">
                    <IconButton
                      aria-label="Edit template"
                      icon={<FiEdit size={16} />}
                      size="sm"
                      variant="ghost"
                      color={textColor}
                      _hover={{ bg: iconHover }}
                      _active={{ bg: iconActive }}
                      onClick={() => handleEditTemplate(t)}
                    />
                    <IconButton
                      aria-label="Download template"
                      icon={<FiDownload size={16} />}
                      size="sm"
                      variant="ghost"
                      color={textColor}
                      _hover={{ bg: iconHover }}
                      _active={{ bg: iconActive }}
                      onClick={() => downloadTemplateJSON(t)}
                    />
                    <IconButton
                      aria-label="Delete template"
                      icon={<FiTrash2 size={16} />}
                      size="sm"
                      variant="ghost"
                      color={dangerIconColor}
                      _hover={{ bg: dangerHoverBg, color: useColorModeValue("red.700", "white") }}
                      _active={{ bg: dangerActiveBg, color: "white" }}
                      onClick={() => remove(t.reportName)}
                    />
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
