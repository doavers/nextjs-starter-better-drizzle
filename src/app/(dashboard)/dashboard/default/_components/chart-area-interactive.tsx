"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";

export const description = "An interactive area chart showing user registrations";

interface TrendData {
  date: string;
  value: number;
}

const chartConfig = {
  users: {
    label: "User Registrations",
    color: "var(--chart-1)",
  },
  sessions: {
    label: "Session Activity",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");
  const [data, setData] = React.useState<TrendData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  React.useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Better Auth will automatically include auth headers
        const response = await fetch(`/api/v1/dashboard/stats?timeRange=${timeRange}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        if (result.code === "00") {
          setData(result.data.trends.users);
        } else {
          throw new Error(result.error || "Unknown error");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load chart data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [timeRange]);

  if (loading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>User Registrations</CardTitle>
          <CardDescription>
            <span className="hidden @[540px]/card:block">New user registrations over time</span>
            <span className="@[540px]/card:hidden">User registrations</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || data.length === 0) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>User Registrations</CardTitle>
          <CardDescription>
            <span className="hidden @[540px]/card:block">New user registrations over time</span>
            <span className="@[540px]/card:hidden">User registrations</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="text-muted-foreground flex h-[250px] w-full items-center justify-center">
            {error || "No data available"}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>User Registrations</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">New user registrations over time</span>
          <span className="@[540px]/card:hidden">User registrations</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-users)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-users)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : Math.floor(data.length / 2)}
              content={
                <ChartTooltipContent
                  labelFormatter={(value: unknown) => {
                    return new Date(value as string).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area dataKey="value" type="natural" fill="url(#fillUsers)" stroke="var(--color-users)" name="users" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
