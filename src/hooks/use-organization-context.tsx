"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

import { authClient } from "@/lib/auth-client";
import { getClientCookie, setClientCookie } from "@/lib/client-cookie";
import { getValueFromIndexDB, setValueToIndexDB } from "@/lib/index-db";
import { APIResponse } from "@/types/api/api-response";

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  memberCount?: number;
  role?: string;
}

interface OrganizationsResponseData {
  organizations: Organization[];
  currentOrganization: Organization | null;
}

interface SwitchOrganizationResponseData {
  currentOrganization: Organization;
  role: string;
}

interface OrganizationContextType {
  currentOrganization: Organization | null;
  organizations: Organization[];
  switchOrganization: (orgId: string) => void;
  isLoading: boolean;
}

const ORG_COOKIE_KEY = "active_organization_id";
const ORG_INDEXDB_KEY = "active_organization_id";

// Helper functions to persist and retrieve active organization
async function getActiveOrganizationId(): Promise<string | null> {
  // Try cookie first, then IndexedDB as fallback
  const cookieValue = getClientCookie(ORG_COOKIE_KEY);
  if (cookieValue) return cookieValue;

  try {
    const indexedDBValue = await getValueFromIndexDB(ORG_INDEXDB_KEY);
    return indexedDBValue || null;
  } catch {
    return null;
  }
}

async function setActiveOrganizationId(orgId: string): Promise<void> {
  // Store in both cookie and IndexedDB for redundancy
  try {
    setClientCookie(ORG_COOKIE_KEY, orgId, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      secure: process.env.NODE_ENV === "production",
    });
    await setValueToIndexDB(ORG_INDEXDB_KEY, orgId);
  } catch (error) {
    console.warn("Failed to persist active organization ID:", error);
  }
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    async function fetchOrganizationContext() {
      try {
        // Get the persisted active organization ID
        const activeOrgId = await getActiveOrganizationId();

        // Better Auth automatically handles authentication in API routes
        const response = await fetch("/api/v1/users/organizations", {
          // Include the cookie with the active organization ID
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch organizations");
        const result = (await response.json()) as APIResponse;

        if (result.code === "00" && result.data) {
          const data = result.data as OrganizationsResponseData;
          setOrganizations(data.organizations);
          setCurrentOrganization(data.currentOrganization);

          // If we have a persisted active org ID and it's different from the server's choice,
          // switch to it locally
          if (activeOrgId && data.organizations.some((org: Organization) => org.id === activeOrgId)) {
            const activeOrg = data.organizations.find((org: Organization) => org.id === activeOrgId);
            if (activeOrg && activeOrg.id !== data.currentOrganization?.id) {
              setCurrentOrganization(activeOrg);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load organization context:", error);
      } finally {
        setIsLoading(false);
      }
    }

    // Only fetch if user is authenticated
    if (session?.user) {
      fetchOrganizationContext();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  const switchOrganization = async (orgId: string) => {
    try {
      // Better Auth automatically handles authentication in API routes
      const response = await fetch(`/api/v1/users/switch-organization/${orgId}`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to switch organization");

      const result = (await response.json()) as APIResponse;
      if (result.code === "00" && result.data) {
        const data = result.data as SwitchOrganizationResponseData;
        const newOrg = data.currentOrganization;
        setCurrentOrganization(newOrg);

        // Persist the active organization ID in both cookie and IndexedDB
        await setActiveOrganizationId(orgId);
      }
    } catch (error) {
      console.error("Failed to switch organization:", error);
    }
  };

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization,
        organizations,
        switchOrganization,
        isLoading,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganizationContext() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error("useOrganizationContext must be used within an OrganizationProvider");
  }
  return context;
}
