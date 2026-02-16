import { Avatar } from "@chakra-ui/react";

const getInitials = (name?: string) =>
  (name || "User")
    .split(/\s+|[_.-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]!.toUpperCase())
    .join("") || "U";

export default function UserAvatar() {
  const name = sessionStorage.getItem("userName") || "User";
  const initials = getInitials(name);
  return (
    <Avatar name={name} bgColor="purple.500">
      {initials}
    </Avatar>
  );
}
