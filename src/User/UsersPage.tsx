// src/components/UsersPage.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronDownIcon, CheckIcon } from "@chakra-ui/icons";
import { useLocation } from "react-router-dom";
import UserList from "./UserList";
import UserForm from "./UserForm";
import useUsers from "../hooks/useUsers";
import usePermissions from "../hooks/usePermissions";
import type { User } from "./User";

/* --------------------- Inline dark RoleSelect (no separate file) --------------------- */
const ROLE_OPTIONS = ["Admin", "Operator", "Engineer", "Supervisor", "Manager", "Guest"] as const;
const pretty = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

function RoleSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <Menu matchWidth>
      <MenuButton
        as={Button}
        w="100%"
        justifyContent="space-between"
        rightIcon={<ChevronDownIcon />}
        bg="gray.700"
        color="white"
        border="1px solid"
        borderColor="gray.600"
        _hover={{ bg: "gray.600" }}
        _active={{ bg: "gray.600" }}
      >
        {pretty(value || "viewer")}
      </MenuButton>
      <MenuList bg="gray.800" borderColor="gray.700" color="white" p={0}>
        {ROLE_OPTIONS.map((r) => (
          <MenuItem
            key={r}
            bg="gray.800"
            _hover={{ bg: "gray.700" }}
            onClick={() => onChange(r)}
          >
            <HStack w="100%" justify="space-between">
              <Text>{pretty(r)}</Text>
              {value === r ? <CheckIcon boxSize="0.8em" /> : <span style={{ width: "0.8em" }} />}
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
/* ------------------------------------------------------------------------------------ */

const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : "");
const splitFirstLast = (raw: string | undefined) => {
  const base = (raw ?? "").trim().replace(/[_\.\-]+/g, " ");
  const parts = base.split(/\s+/).filter(Boolean);
  const first = parts[0] ?? "";
  const last = parts.slice(1).join(" ");
  return { first: cap(first), last: cap(last) };
};

export default function UsersPage() {
  const { users, fetchUsers, createUser, deleteUser, blockUser, updateUser } = useUsers();
  const { permissions } = usePermissions();

  const currentRole = (sessionStorage.getItem("role") || "").toLowerCase();

  const canCreateUser =
    permissions.find((p) => p.role_name === currentRole)?.can_create_user || false;

  const [showForm, setShowForm] = useState(false);

  // edit state
  const [editing, setEditing] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",              // added phone in edit form state
    role: "viewer",
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [actionPassword, setActionPassword] = useState("");

  const location = useLocation();
  const toast = useToast();

  useEffect(() => {
    if (location.search.includes("create=true")) setShowForm(true);
  }, [location.search]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFormSubmit = async (newUser: User) => {
    setShowForm(false);
    await fetchUsers();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      toast({ title: "User deleted", status: "success", duration: 3000, isClosable: true });
    } catch (err: any) {
      toast({ title: "Delete failed", description: err?.message || "Error", status: "error", duration: 3000, isClosable: true });
    }
  };

  const handleBlock = async (id: number, is_blocked: boolean) => {
    try {
      await blockUser(id, is_blocked);
      toast({ title: `User ${is_blocked ? "unblocked" : "blocked"}`, status: "success", duration: 3000, isClosable: true });
    } catch (err: any) {
      toast({ title: "Failed to update block", description: err?.message || "Unknown error", status: "error", duration: 3000, isClosable: true });
    }
  };

  const startEdit = (u: User) => {
    setEditing(u);
    setEditForm({
      firstName: u.firstName || "",
      lastName: u.lastName || "",
      email: u.email || "",
      phone: u.phone || "",            // prefill phone
      role: u.role || "Viewer",
    });
  };

  const submitEdit = async () => {
    if (!editing) return;
    const { firstName, lastName, email, phone, role } = editForm;

    // backend expects: username, email, role, phone
    const body = {
      username: `${(firstName || "").toLowerCase()}_${(lastName || "").toLowerCase()}`,
      email,
      role,
      phone,                           // include phone in PUT
    };

    try {
      await updateUser(editing.id as number, body);
      toast({ title: "User updated", status: "success", duration: 3000, isClosable: true });
      setEditing(null);
    } catch (err: any) {
      toast({ title: "Update failed", description: err?.message || "Invalid data", status: "error", duration: 3000, isClosable: true });
    }
  };

  const handleVerifyPassword = async () => {
    try {
      const res = await fetch("http://75.119.146.115:5179/api/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          password: actionPassword,
          control_type: "CREATE_USER",
          module: "USER_MANAGEMENT",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Verification failed");
      }

      setShowPasswordModal(false);
      setShowForm(true); // ✅ open form after success

    } catch (err: any) {
      toast({
        title: "Wrong Password",
        description: err.message,
        status: "error",
      });
    }
  };

  const bgOuter = useColorModeValue("gray.100", "gray.900");
  const textClr = useColorModeValue("gray.900", "white");
  const modalBg = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.200", "gray.700");
  const inputBorder = useColorModeValue("gray.300", "gray.600");
  return (
    <Box bg={bgOuter} color={textClr} minH="100vh" p={6}>
      <Heading mb={4}>Users Management</Heading>

      {!showForm && canCreateUser && (
        <Button
          leftIcon={<span style={{ fontSize: "1.2em" }}>+</span>}
          colorScheme="blue"
          mb={4}
          onClick={() => setShowPasswordModal(true)}
        >
          Create User
        </Button>
      )}

      {showForm ? (
        <UserForm onSubmit={handleFormSubmit} onCancel={() => setShowForm(false)} />
      ) : (
        <UserList
          users={users.map((u) => {
            const { first, last } = splitFirstLast(u.firstName || "");

            return {
              ...u,
              firstName: first,
              lastName: last,
            };
          })}
          onStartEdit={startEdit}
          onBlock={handleBlock}
          onDelete={handleDelete}
        />
      )}

      {/* Password Modal */}
      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="password"
              placeholder="Enter your password"
              value={actionPassword}
              onChange={(e) => setActionPassword(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={() => setShowPasswordModal(false)}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleVerifyPassword}>
              Verify
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editing} onClose={() => setEditing(null)}>
        <ModalOverlay />
        <ModalContent bg={modalBg} color={textClr}>
          <ModalHeader>Edit User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="First name"
              value={editForm.firstName}
              onChange={(e) => setEditForm((p) => ({ ...p, firstName: e.target.value }))}
              mb={3}
              bg={inputBg}
              borderColor={inputBorder}
              color={textClr}
            />
            <Input
              placeholder="Last name"
              value={editForm.lastName}
              onChange={(e) => setEditForm((p) => ({ ...p, lastName: e.target.value }))}
              mb={3}
              bg={inputBg}
              borderColor={inputBorder}
              color={textClr}
            />
            <Input
              type="email"
              placeholder="Email"
              value={editForm.email}
              onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
              mb={3}
              bg={inputBg}
              borderColor={inputBorder}
              color={textClr}
            />
            <Input
              placeholder="Phone (10 digits)"
              value={editForm.phone}
              onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
              mb={3}
              bg={inputBg}
              borderColor={inputBorder}
              color={textClr}
            />

            <RoleSelect
              value={editForm.role}
              onChange={(val) => setEditForm((p) => ({ ...p, role: val }))}
            />
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={submitEdit}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
