import { UserRole } from "@/config/role-config";

type UserType = {
  id: string;
  created_at: Date;
  updated_at: Date;
  name: string;
  email: string;
  email_verified: boolean;
  image: string;
  banned: boolean | null;
  ban_reason: string | null;
  ban_expires: Date | null;
  password?: string;
  is_active: boolean;
  role: UserRole | string;
};

export default UserType;
