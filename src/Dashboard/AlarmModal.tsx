import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Box,
  Button,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

export default function AlarmModal({
  isOpen,
  onClose,
  type,
}: {
  isOpen: boolean;
  onClose: () => void;
  type: "latest" | "history";
}) {
  const alarmRows = Array(5).fill(null);
  const [comments, setComments] = useState<string[]>(Array(5).fill("--"));
  const [inputValues, setInputValues] = useState<string[]>(Array(5).fill(""));
  const [ackDisabled, setAckDisabled] = useState<boolean[]>(Array(5).fill(false));
  const [clrDisabled, setClrDisabled] = useState<boolean[]>(Array(5).fill(false));
  const [activePopover, setActivePopover] = useState<number | null>(null);

  const handleCommentChange = (index: number, value: string) => {
    const updated = [...inputValues];
    updated[index] = value;
    setInputValues(updated);
  };

  const handleCommentSave = (index: number, action: "ack" | "clr") => {
    const updatedComments = [...comments];
    updatedComments[index] = inputValues[index] || "--";
    setComments(updatedComments);

    if (action === "ack") {
      const updatedAck = [...ackDisabled];
      updatedAck[index] = true;
      setAckDisabled(updatedAck);
    } else {
      const updatedClr = [...clrDisabled];
      updatedClr[index] = true;
      setClrDisabled(updatedClr);
    }

    setActivePopover(null);
  };

  const renderTable = () => (
    <Box overflowX="auto" mt={4}>
      <Table variant="simple" size="sm">
        <Thead bg="gray.700">
          <Tr>
            <Th color="gray.200">Device</Th>
            <Th color="gray.200">Created Time</Th>
            <Th color="gray.200">Type</Th>
            <Th color="gray.200">Severity</Th>
            <Th color="gray.200">Status</Th>
            <Th color="gray.200">Assignee</Th>
            <Th color="gray.200">Comment</Th>
            <Th color="gray.200">ACK</Th>
            <Th color="gray.200">Clear</Th>
          </Tr>
        </Thead>
        <Tbody>
          {alarmRows.map((_, index) => (
            <Tr key={index}>
              <Td></Td>
              <Td>Invalid Date</Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td>
                <Box
                  bg="whiteAlpha.200"
                  color="white"
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontSize="sm"
                >
                  {comments[index]}
                </Box>
              </Td>

              {/* ACK Button with Popover */}
              <Td>
                <Popover
                  isOpen={activePopover === index && !ackDisabled[index]}
                  onClose={() => setActivePopover(null)}
                  placement="bottom-start"
                  closeOnBlur={false}
                >
                  <PopoverTrigger>
                    <Button
                      colorScheme="blue"
                      size="xs"
                      onClick={() => setActivePopover(index)}
                      isDisabled={ackDisabled[index]}
                    >
                      ACK
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent bg="gray.800" borderColor="gray.600" color="white">
                    <PopoverArrow bg="gray.800" />
                    <PopoverBody>
                      <VStack spacing={2}>
                        <Input
                          size="sm"
                          bg="gray.700"
                          color="white"
                          placeholder="Enter comment"
                          value={inputValues[index] || ""}
                          onChange={(e) =>
                            handleCommentChange(index, e.target.value)
                          }
                        />
                        <Button
                          size="sm"
                          colorScheme="blue"
                          width="100%"
                          onClick={() => handleCommentSave(index, "ack")}
                        >
                          Save
                        </Button>
                      </VStack>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Td>

              {/* CLR Button with Popover */}
              <Td>
                <Popover
                  isOpen={activePopover === index + 100 && !clrDisabled[index]}
                  onClose={() => setActivePopover(null)}
                  placement="bottom-start"
                  closeOnBlur={false}
                >
                  <PopoverTrigger>
                    <Button
                      colorScheme="red"
                      size="xs"
                      onClick={() => setActivePopover(index + 100)}
                      isDisabled={clrDisabled[index]}
                    >
                      CLR
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent bg="gray.800" borderColor="gray.600" color="white">
                    <PopoverArrow bg="gray.800" />
                    <PopoverBody>
                      <VStack spacing={2}>
                        <Input
                          size="sm"
                          bg="gray.700"
                          color="white"
                          placeholder="Enter comment"
                          value={inputValues[index] || ""}
                          onChange={(e) =>
                            handleCommentChange(index, e.target.value)
                          }
                        />
                        <Button
                          size="sm"
                          colorScheme="red"
                          width="100%"
                          onClick={() => handleCommentSave(index, "clr")}
                        >
                          Save
                        </Button>
                      </VStack>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" motionPreset="none">
      <ModalOverlay bg="blackAlpha.600" zIndex="1000" />
      <ModalContent
        bg="gray.800"
        maxW="100vw"
        height="calc(100vh - 64px)"
        mt="64px"
        borderRadius="0"
        zIndex="900"
      >
        <ModalHeader color="white">
          {type === "latest" ? "Latest Alarms" : "Alarm History"}
        </ModalHeader>
        <ModalBody>{renderTable()}</ModalBody>
      </ModalContent>
    </Modal>
  );
}
