import { UserRole } from "@/config/role-config";

export const ROLE_OPTIONS = [
  { value: UserRole.USER, label: "USER" },
  { value: UserRole.ADMIN, label: "ADMIN" },
  { value: UserRole.SUPERADMIN, label: "SUPERADMIN" },
];

export type ActionMode = "dropdown" | "normal";

export const ACTION_MODE_OPTIONS = [
  { value: "dropdown" as ActionMode, label: "Dropdown" },
  { value: "normal" as ActionMode, label: "Normal" },
];
