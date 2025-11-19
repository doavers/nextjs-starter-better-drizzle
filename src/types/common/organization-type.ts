export interface OrganizationType {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  createdAt: string;
  metadata?: string | null;
  memberCount?: number;
  role?: string; // User's role in this organization (for user-specific views)
  members?: {
    id: string;
    userId: string;
    organizationId: string;
    role: string;
    createdAt: string;
    users?: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
    };
  }[];
}

export interface OrganizationCreateType {
  name: string;
  slug: string;
  logo?: string | null;
  metadata?: string | null;
}

export interface OrganizationUpdateType extends Partial<OrganizationCreateType> {
  id: string;
}
