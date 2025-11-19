import { UserRole } from "@/config/role-config";

export const ROLE_OPTIONS = [
  { value: UserRole.USER, label: "USER" },
  { value: UserRole.ADMIN, label: "ADMIN" },
  { value: UserRole.SUPERADMIN, label: "SUPERADMIN" },
];
