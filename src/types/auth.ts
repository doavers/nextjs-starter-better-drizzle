import { Session } from "@/lib/auth";

export interface ExtendedSession extends Session {
  activeOrganizationId?: string | null;
}
