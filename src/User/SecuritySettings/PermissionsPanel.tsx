import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  HStack,
  Spinner,
  Stack,
  Text,
  useToast,
  useColorModeValue,
  Badge,
  VStack,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  EditIcon,
  DeleteIcon,
  SettingsIcon,
  LockIcon,
  UnlockIcon,
} from "@chakra-ui/icons";
import usePermissions from "../../hooks/usePermissions";

export default function PermissionsPanel() {
  const toast = useToast();
  const bgCard = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textMuted = useColorModeValue("gray.600", "gray.400");
  const headerBg = useColorModeValue(
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  );

  // Role-specific gradient colors
  const roleGradients: Record<string, string> = {
    admin: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    cogneta: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    manager: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    supervisor: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    engineer: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    operator: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    guest: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
  };

  const { permissions, loading, error, fetchPermissions, updatePermissions } =
    usePermissions();

  const [localPermissions, setLocalPermissions] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalPermissions(permissions);
  }, [permissions]);

  // Permission groups with icons
  const permissionGroups = [
    {
      title: "User Management",
      icon: EditIcon,
      permissions: [
        { key: "can_edit_user", label: "Edit User", icon: EditIcon },
        { key: "can_delete_user", label: "Delete User", icon: DeleteIcon },
        { key: "can_settings_user", label: "Settings User", icon: SettingsIcon },
      ],
    },
    {
      title: "Control & Monitoring",
      icon: CheckCircleIcon,
      permissions: [
        { key: "can_control_bess", label: "Control Strategy", icon: LockIcon },
        { key: "can_control_service", label: "Control Services", icon: UnlockIcon },
        { key: "can_control_switchgear", label: "Switchgear Control", icon: LockIcon },
      ],
    },
    {
      title: "Advanced",
      icon: SettingsIcon,
      permissions: [
        {
          key: "can_control_plant_config",
          label: "Plant Configuration",
          icon: SettingsIcon,
        },
      ],
    },
  ];

  function updatePermission(
    roleName: string,
    key:
      | "can_edit_user"
      | "can_delete_user"
      | "can_settings_user"
      | "can_control_bess"
      | "can_control_switchgear"
      | "can_control_service"
      | "can_control_plant_config",
    value: boolean
  ) {
    setLocalPermissions((prev) =>
      prev.map((p) =>
        p.role_name === roleName ? { ...p, [key]: value } : p
      )
    );
  }

  async function savePermissions() {
    setSaving(true);
    const success = await updatePermissions(localPermissions);
    setSaving(false);

    if (success) {
      toast({
        title: "Permissions updated",
        description: "All changes have been saved successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } else {
      await fetchPermissions();      

      toast({
        title: "Save failed",
        description: "Permission denied",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  }

  return (
    <Box>
      {/* Loading State */}
      {loading && (
        <Box textAlign="center" py={6}>
          <Spinner
            size="md"
            mb={2}
            color="purple.500"
            thickness="3px"
          />
          <Text color={textMuted} fontWeight="medium" fontSize="sm">
            Loading permissions...
          </Text>
        </Box>
      )}

      {/* Permissions Grid */}
      {!loading && localPermissions.length > 0 && (
        <Stack spacing={4}>
          {/* Tabs Layout */}
          <Tabs colorScheme="purple" variant="soft-rounded" size="sm">
            {/* Tab List with Role Names */}
            <TabList
              bg={useColorModeValue("gray.50", "gray.900")}
              p={2}
              borderRadius="lg"
              border={`1px solid ${borderColor}`}
              overflowX="auto"
              mb={3}
            >
              {localPermissions.map((perm) => {
                const gradient = roleGradients[perm.role_name] || roleGradients.guest;
                const isLocked = perm.role_name === "admin" || perm.role_name === "cogneta";
                return (
                  <Tab
                    key={perm.role_name}
                    fontSize="sm"
                    fontWeight="600"
                    textTransform="capitalize"
                    borderRadius="md"
                    _selected={{
                      bg: "purple.500",
                      color: "white",
                    }}
                    opacity={isLocked ? 0.7 : 1}
                  >
                    {perm.role_name}
                    {isLocked && <Badge ml={1} fontSize="xs" bg="red.500"></Badge>}
                  </Tab>
                );
              })}
            </TabList>

            {/* Tab Panels with Role Permissions */}
            <TabPanels>
              {localPermissions.map((perm) => {
                const isLocked = perm.role_name === "admin" || perm.role_name === "cogneta";
                const gradient = roleGradients[perm.role_name] || roleGradients.guest;

                return (
                  <TabPanel key={perm.role_name} p={0}>
                    <Box
                      bg={bgCard}
                      border={`2px solid ${borderColor}`}
                      borderRadius="xl"
                      overflow="hidden"
                    >
                      {/* Role Header */}
                      <Box
                        background={gradient}
                        p={2}
                        color="white"
                        fontWeight="bold"
                        fontSize="md"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Text textTransform="capitalize" fontSize="md">
                          {perm.role_name}
                        </Text>
                        {isLocked && (
                          <Badge
                            bg="rgba(255,255,255,0.3)"
                            color="white"
                            fontSize="sm"
                            px={1}
                          >
                             Fixed
                          </Badge>
                        )}
                      </Box>

                      {/* Content */}
                      <VStack align="stretch" p={3} spacing={3}>
                        {permissionGroups.map((group, idx) => (
                          <VStack key={group.title} align="stretch" spacing={1}>
                            <HStack spacing={1} opacity={0.7}>
                              <Icon as={group.icon} w={3} h={3} />
                              <Text fontSize="xs" fontWeight="bold" textTransform="uppercase">
                                {group.title}
                              </Text>
                            </HStack>

                            {/* Permission Checkboxes */}
                            <VStack align="stretch" spacing={1} pl={2}>
                              {group.permissions.map((perm_item) => {
                                // Plant config only editable for cogneta, but show for all
                                const isPlantConfig = perm_item.key === "can_control_plant_config";
                                const canEditPlantConfig = perm.role_name === "cogneta";

                                return (
                                  <HStack
                                    key={perm_item.key}
                                    spacing={1}
                                    p={1}
                                    borderRadius="md"
                                    transition="all 0.2s"
                                    opacity={isPlantConfig && !canEditPlantConfig ? 0.4 : 1}
                                    _hover={{
                                      bg: useColorModeValue("gray.50", "gray.700"),
                                    }}
                                  >
                                    <Checkbox
                                      isChecked={perm[perm_item.key]}
                                      onChange={(e) =>
                                        updatePermission(
                                          perm.role_name,
                                          perm_item.key as any,
                                          e.target.checked
                                        )
                                      }
                                      isDisabled={isLocked || (isPlantConfig && !canEditPlantConfig)}
                                      opacity={isLocked ? 0.5 : 1}
                                      colorScheme="purple"
                                      size="sm"
                                    />
                                    <HStack spacing={1} flex={1}>
                                      <Icon as={perm_item.icon} w={2} h={2} opacity={0.6} />
                                      <Text
                                        fontSize="xs"
                                        opacity={isLocked ? 0.6 : 1}
                                        fontWeight="500"
                                      >
                                        {perm_item.label}
                                      </Text>
                                    </HStack>
                                  </HStack>
                                );
                              })}
                            </VStack>

                            {/* Divider between groups */}
                            {idx !== permissionGroups.length - 1 && <Divider />}
                          </VStack>
                        ))}
                      </VStack>
                    </Box>
                  </TabPanel>
                );
              })}
            </TabPanels>
          </Tabs>

          {/* Action Buttons */}
          <Box pt={2} pb={2}>
            <HStack spacing={2} justify="flex-end">
              <Button
                variant="outline"
                onClick={() => setLocalPermissions([...permissions])}
                isDisabled={loading || saving}
                size="sm"
                borderRadius="md"
                fontSize="sm"
              >
                ↻ Reload
              </Button>

              <Button
                onClick={savePermissions}
                isLoading={saving}
                isDisabled={loading || localPermissions.length === 0}
                bgGradient="linear(to-r, purple.400, purple.600)"
                color="white"
                size="sm"
                borderRadius="md"
                fontSize="sm"
                _hover={{
                  bgGradient: "linear(to-r, purple.500, purple.700)",
                  transform: "translateY(-1px)",
                  shadow: "md",
                }}
                transition="all 0.3s"
              >
                ✨ Save
              </Button>
            </HStack>
          </Box>
        </Stack>
      )}

      {/* Empty State */}
      {!loading && localPermissions.length === 0 && (
        <Box
          textAlign="center"
          py={6}
          px={4}
          bg={useColorModeValue("gray.50", "gray.900")}
          borderRadius="xl"
          border={`2px dashed ${borderColor}`}
        >
          <Text fontSize="lg" mb={1}>
            🔍
          </Text>
          <Text fontSize="md" fontWeight="bold" mb={1}>
            No Permissions Found
          </Text>
          <Text color={textMuted} fontSize="sm" mb={3}>
            {error || "Unable to load permissions. Try again."}
          </Text>
          <Button
            size="sm"
            onClick={() => fetchPermissions()}
            isLoading={loading}
            bgGradient="linear(to-r, purple.400, purple.600)"
            color="white"
            borderRadius="md"
            fontSize="sm"
          >
            🔄 Retry
          </Button>
        </Box>
      )}
    </Box>
  );
}
