import React, { useState } from "react";
import { useModelData, useModelDataById } from "../hooks/useModelData";
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

// Helper to render tree recursively
function TreeNode({
  node,
  onSelect,
}: {
  node: any;
  onSelect: (path: string) => void;
}) {
  if (!node) return null;

  if (node.type === "file") {
    return (
      <div
        style={{ paddingLeft: 16, cursor: "pointer", color: useColorModeValue("primaryText.light", "primaryText.dark") }}
        // send path without .json (same as your original)
        onClick={() => onSelect(node.name.split(".")[0])}
      >
        📄 {node.name}
      </div>
    );
  }

  const primaryBg = useColorModeValue("primary.light", "primary.dark");
  const primaryColor = useColorModeValue("primaryText.light", "primaryText.dark");
  const secondaryColor = useColorModeValue("secondaryText.light", "secondaryText.dark");

  return (
    <div style={{ paddingLeft: 8, color: secondaryColor }}>
      <div>📁 {node.name}</div>
      {node.children &&
        node.children.map((child: any) => (
          <TreeNode key={child.path} node={child} onSelect={onSelect} />
        ))}
    </div>
  );
}

export default function ConfigList() {
  const { data: treeData, loading: treeLoading, error: treeError } = useModelData();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  // Extract deviceId from path (assuming file path is used as deviceId)
  const deviceId = selectedPath ? encodeURIComponent(selectedPath) : "";
  const {
    data: fileContent,
    loading: fileLoading,
    error: fileError,
  } = useModelDataById(deviceId);

  // Build the top title: "make - model" (fallbacks to name or selectedPath)
  const title =
    (fileContent &&
      [fileContent.make, fileContent.model].filter(Boolean).join(" - ")) ||
    (fileContent && (fileContent.name as string)) ||
    selectedPath ||
    "";
  const primaryBg = useColorModeValue("primary.light", "primary.dark");
  const primaryColor = useColorModeValue("primaryText.light", "primaryText.dark");
  const secondaryColor = useColorModeValue("secondaryText.light", "secondaryText.dark");

  const breadcrumbs = [{ label: "Home", href: "/plantview" }, { label: "Config", href: "/config/device" }, { label: "Device Config", href: "/config/device" }, {label : "Device List"}]
  return (
    <Box
      bg={useColorModeValue("#F4F6F6", "#0E1111")}
    >
      <Breadcrumb
          color={useColorModeValue("primaryText.light", "primaryText.dark")}
          spacing="5px"
          fontSize={"12px"}
          p={3}
          separator={<ChevronRightIcon height={"16px"} width={"16px"} boxSize={"6"} color={useColorModeValue("rgba(0, 0, 0, 0.4)", "rgba(255, 255, 255, 0.5)")} />}
        >
          {breadcrumbs.map((bc, idx) => (
            <BreadcrumbItem key={idx} isCurrentPage={!bc.href}>
              {bc.href ? (
                <BreadcrumbLink href={bc.href}>{bc.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbLink fontWeight={"600"}>{bc.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      <div
        style={{
          display: "flex",
          height: "90vh",
          // background: useColorModeValue("#F4F6F6", "#0E1111"),
          color: primaryColor
        }}
      >
        {/* Left: Tree */}
        <div
          style={{
            width: "35%",
            resize: "horizontal",
            borderRight: "1px solid #2d3748",
            overflowY: "auto",
            padding: 16,
          }}
        >
          <h3 style={{ color: secondaryColor }}>File Structure</h3>
          {treeLoading && <div>Loading tree...</div>}
          {treeError && <div style={{ color: "red" }}>{String(treeError)}</div>}
          {treeData && <TreeNode node={treeData} onSelect={setSelectedPath} />}
        </div>

        {/* Right: Content (no 'File Content' heading) */}
        <div style={{ flex: 1, padding: 16 }}>
          {!selectedPath && <div>Select a file from the tree</div>}
          {fileLoading && <div>Loading file...</div>}
          {fileError && <div style={{ color: "red" }}>{String(fileError)}</div>}

          {fileContent && (
            <>
              {/* Make + Model (or fallback) */}
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  marginBottom: 12,
                  color: secondaryColor,
                }}
              >
                <Flex width={"100%"} justify={"space-between"} align={"center"}>
                  <Text color={primaryColor}>{deviceId}</Text>
                  <Text color={primaryColor}>{title}</Text>
                </Flex>
              </div>

              <pre
                style={{
                  background: primaryBg,
                  color: secondaryColor,
                  padding: 12,
                  borderRadius: 4,
                  maxHeight: "80vh",
                  overflow: "auto",
                }}
              >
                {typeof fileContent === "object"
                  ? JSON.stringify(fileContent.result, null, 2)
                  : String(fileContent)}
              </pre>
            </>
          )}
        </div>
      </div>
    </Box>
  );
}
