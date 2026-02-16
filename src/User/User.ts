// src/components/User.ts
export type User = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  is_blocked?: boolean;
};
