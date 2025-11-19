"use client";

import { TrendingUp, TrendingDown, Users, Building2, Activity, Mail } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganizationContext } from "@/hooks/use-organization-context";

interface DashboardStats {
  totals: {
    users: number;
    organizations: number;
    activeSessions: number;
    pendingInvitations: number;
  };
  trends: {
    users: { date: string; value: number }[];
    sessions: { date: string; value: number }[];
  };
}

export function SectionCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentOrganization } = useOrganizationContext();

  useEffect(() => {
    async function fetchStats() {
      try {
        // Better Auth will automatically include auth headers
        const response = await fetch("/api/v1/dashboard/stats");
        if (!response.ok) throw new Error("Failed to fetch stats");
        const result = await response.json();
        if (result.code === "00") {
          setStats(result.data);
        } else {
          throw new Error(result.error || "Unknown error");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load statistics");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [currentOrganization]); // Re-fetch when organization changes

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
            </CardHeader>
            <CardFooter>
              <Skeleton className="h-4 w-20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <CardDescription>Error loading data</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">--</CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="text-muted-foreground">Please try again later</div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate trends (simple comparison between first half and second half of data)
  const calculateTrend = (data: { date: string; value: number }[]) => {
    if (data.length < 2) return { value: 0, isUp: true };
    const half = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, half).reduce((sum, item) => sum + item.value, 0);
    const secondHalf = data.slice(half).reduce((sum, item) => sum + item.value, 0);
    const change = secondHalf - firstHalf;
    return {
      value: firstHalf > 0 ? Math.round((change / firstHalf) * 100) : 0,
      isUp: change >= 0,
    };
  };

  const userTrend = calculateTrend(stats.trends.users);
  const sessionTrend = calculateTrend(stats.trends.sessions);

  const isOrgContext = !!currentOrganization;

  const cards = [
    {
      title: isOrgContext ? "Team Members" : "Total Users",
      value: stats.totals.users.toLocaleString(),
      icon: Users,
      trend: userTrend,
      description: isOrgContext ? "Organization members" : "Registered users",
      footerText: userTrend.isUp ? "Growing steadily" : "Needs attention",
    },
    {
      title: isOrgContext ? "Organization Status" : "Organizations",
      value: isOrgContext ? "Active" : stats.totals.organizations.toLocaleString(),
      icon: Building2,
      trend: { value: 5, isUp: true }, // Placeholder trend
      description: isOrgContext ? "Current organization" : "Active organizations",
      footerText: isOrgContext ? currentOrganization.name : "Good progress",
    },
    {
      title: "Active Sessions",
      value: stats.totals.activeSessions.toLocaleString(),
      icon: Activity,
      trend: sessionTrend,
      description: isOrgContext ? "Team member sessions" : "Current active sessions",
      footerText: sessionTrend.isUp ? "High engagement" : "Engagement needs work",
    },
    {
      title: "Pending Invitations",
      value: stats.totals.pendingInvitations.toLocaleString(),
      icon: Mail,
      trend: { value: -10, isUp: false }, // Placeholder trend
      description: isOrgContext ? "Team invitations" : "Awaiting acceptance",
      footerText: stats.totals.pendingInvitations > 0 ? "Follow up needed" : "All caught up",
    },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="@container/card">
            <CardHeader>
              <CardDescription className="flex items-center gap-2">
                <Icon className="size-4" />
                {card.title}
              </CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{card.value}</CardTitle>
              <CardAction>
                <Badge variant="outline">
                  {card.trend.isUp ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
                  {card.trend.isUp ? "+" : ""}
                  {card.trend.value}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {card.footerText}
                {card.trend.isUp ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
              </div>
              <div className="text-muted-foreground">{card.description}</div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
