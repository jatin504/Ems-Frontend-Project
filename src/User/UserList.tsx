// src/components/UserList.tsx
import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  HStack,
  Box,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type { User } from "./User";

type Props = {
  users: User[];
  /** Open edit UI (modal) with this user prefilled */
  onStartEdit: (user: User) => void;
  /** Toggle block/unblock. Pass current is_blocked so parent can flip it. */
  onBlock: (id: number, is_blocked: boolean) => void;
  /** Delete a user by id */
  onDelete: (id: number) => void;
};

const UserList: React.FC<Props> = ({ users, onStartEdit, onBlock, onDelete }) => {
  const emptyBg = useColorModeValue("gray.100", "gray.800");
  const emptyText = useColorModeValue("gray.600", "gray.300");
  if (!users || users.length === 0) {
    return (
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={6}
        bg={emptyBg}
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Text color={emptyText}>No users found.</Text>
      </Box>
    );
  }

  const tableBg = useColorModeValue("white", "gray.900");
  const headBg = useColorModeValue("gray.100", "gray.800");
  const headText = useColorModeValue("gray.700", "gray.200");
  const rowHover = useColorModeValue("gray.50", "gray.800");
  const rowText = useColorModeValue("gray.900", "white");
  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" borderColor={useColorModeValue("gray.200", "gray.700")} bg={tableBg}>
      <Table variant="simple" size="md">
        <Thead bg={headBg}>
          <Tr>
            <Th color={headText}>First Name</Th>
            <Th color={headText}>Last Name</Th>
            <Th color={headText}>Email</Th>
            <Th color={headText}>Phone</Th>
            <Th color={headText}>Role</Th>
            <Th color={headText}>Blocked?</Th>
            <Th color={headText} isNumeric pr={6}>
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((u) => (
            <Tr key={u.id} _hover={{ bg: rowHover }}>
              <Td color={rowText}>{u.firstName || "-"}</Td>
              <Td color={rowText}>{u.lastName || "-"}</Td>
              <Td color={rowText}>{u.email}</Td>
              <Td color={rowText}>{u.phone || "-"}</Td>
              <Td color={rowText} textTransform="capitalize">{u.role || "viewer"}</Td>
              <Td color={rowText}>
                {u.is_blocked ? (
                  <Badge colorScheme="red">Yes</Badge>
                ) : (
                  <Badge colorScheme="green">No</Badge>
                )}
              </Td>
              <Td isNumeric pr={6}>
                <HStack spacing={2} justify="flex-end">
                  <Button
                    size="sm"
                    colorScheme="teal"
                    onClick={() => onStartEdit(u)}
                    aria-label={`Edit ${u.email}`}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    colorScheme={u.is_blocked ? "green" : "red"}
                    onClick={() => onBlock(u.id, u.is_blocked)}
                    aria-label={`${u.is_blocked ? "Unblock" : "Block"} ${u.email}`}
                  >
                    {u.is_blocked ? "Unblock" : "Block"}
                  </Button>
                  <Button
                    size="sm"
                    colorScheme={useColorModeValue("gray", "whiteAlpha")}
                    onClick={() => onDelete(u.id)}
                    aria-label={`Delete ${u.email}`}
                  >
                    Delete
                  </Button>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default UserList;
