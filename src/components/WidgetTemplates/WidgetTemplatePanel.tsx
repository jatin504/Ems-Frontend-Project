// WidgetTemplatePanel.tsx
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { useWidgetTemplates } from "../../hooks/WidgetTemplate/useWidgetTemplates";
import { useEffect, useRef } from "react";

interface WidgetTemplatePanelProps {
  onAddWidget: (template: any) => void;
}

const WidgetTemplatePanel = ({ onAddWidget }: WidgetTemplatePanelProps) => {
  const { getWidgetTemplates, groupedTemplates, loading } = useWidgetTemplates();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Theme aware tokens
  const drawerBg = useColorModeValue("white", "gray.800");
  const drawerColor = useColorModeValue("gray.800", "white");
  const headerBorder = useColorModeValue("gray.200", "gray.600");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const itemBg = useColorModeValue("gray.50", "gray.700");
  const itemBorder = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const descColor = useColorModeValue("gray.600", "gray.300");

  // Guard to avoid repeated network calls (StrictMode/dev or repeated opens)
  const fetchedRef = useRef(false);

  useEffect(() => {
    // Only fetch when drawer opens and we haven't fetched yet.
    if (!isOpen) return;
    if (fetchedRef.current) return;

    fetchedRef.current = true;
    getWidgetTemplates();
    // Intentionally depend on isOpen only; fetchedRef prevents duplicate calls.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleRefresh = () => {
    // Allow manual refresh/reset of fetched guard so a fresh request can be made.
    fetchedRef.current = false;
    getWidgetTemplates();
  };

  // New: when adding a widget, notify parent AND dispatch a window event so parent can refresh data immediately
  const handleAddAndNotify = (template: any) => {
    // create a safe copy to avoid accidental mutation
    let tplCopy: any;
    try {
      tplCopy = JSON.parse(JSON.stringify(template));
    } catch (err) {
      tplCopy = template;
    }

    // call parent handler to add widget into dashboard state
    onAddWidget(tplCopy);

    // dispatch global event so dashboard can react and fetch data for the new widget immediately
    try {
      const ev = new CustomEvent("dashboard:widgetAdded", { detail: { template: tplCopy } });
      window.dispatchEvent(ev);
    } catch (err) {
      // fallback for very old browsers (rare)
      try {
        const ev2 = document.createEvent("CustomEvent");
        ev2.initCustomEvent("dashboard:widgetAdded", true, true, { template: tplCopy });
        window.dispatchEvent(ev2);
      } catch (e) {
        // ignore if custom event couldn't be dispatched
      }
    }

    // close drawer after adding
    onClose();
  };

  return (
    <>
      {/* Trigger Button */}
      <Button size="sm" colorScheme="blue" onClick={onOpen} mb={2}>
        + Add Widget
      </Button>

      {/* Drawer */}
      <Drawer size="sm" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={drawerBg} color={drawerColor}>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderColor={headerBorder}>
            Widget Library
          </DrawerHeader>

          <DrawerBody pt={4}>
            {loading ? (
              <Text color={mutedText}>Loading templates...</Text>
            ) : Object.keys(groupedTemplates).length === 0 ? (
              <Text color={mutedText}>No widgets available.</Text>
            ) : (
              <Accordion allowMultiple defaultIndex={[0]}>
                {Object.entries(groupedTemplates).map(([type, items]) => (
                  <AccordionItem key={type} border="1px" borderColor={itemBorder} mb={2} borderRadius="md">
                    <h3>
                      <AccordionButton py={2} _hover={{ bg: hoverBg }}>
                        <Box flex="1" textAlign="left" fontWeight="bold" textTransform="capitalize">
                          {type.replace(/_/g, " ")} Widgets
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h3>
                    <AccordionPanel pb={4} pt={2} px={2}>
                      {items.map((template) => (
                        <Box
                          key={template.id}
                          p={3}
                          mb={3}
                          borderWidth="1px"
                          borderRadius="md"
                          bg={itemBg}
                          borderColor={itemBorder}
                          fontSize="sm"
                        >
                          <Text fontWeight="semibold" textTransform={"capitalize"}>
                            {template.title.replace(/_/g, " ")}
                          </Text>
                          {template.description && (
                            <Text mt={1} color={descColor} fontSize="xs">
                              {template.description}
                            </Text>
                          )}
                          <Button
                            size="xs"
                            colorScheme="green"
                            mt={2}
                            onClick={() => {
                              handleAddAndNotify(template);
                            }}
                          >
                            Add Widget
                          </Button>
                        </Box>
                      ))}
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px" borderColor={headerBorder}>
            <Button size="sm" onClick={handleRefresh} mr={2}>
              Refresh
            </Button>
            <Button size="sm" onClick={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default WidgetTemplatePanel;
