"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Star,
  Activity,
  Package,
  BarChart3,
  PieChart,
  LineChart,
  AlertCircle,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  getOverviewStats,
  getContactTrends,
  getContactStatusDistribution,
  getCategoryPerformance,
  getRatingDistribution,
  getRecentActivity,
  getGalleryCategories,
  type OverviewStatsResponse,
  type ContactTrendsResponse,
  type ContactStatusResponse,
  type CategoryPerformanceResponse,
  type RatingDistributionResponse,
  type RecentActivityResponse,
  type GalleryCategoriesResponse,
} from "@/api/dashboard";
import { format } from "date-fns";
import type { LucideIcon } from "lucide-react";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Overview data
  const [overviewStats, setOverviewStats] = useState<
    OverviewStatsResponse["data"] | null
  >(null);
  const [contactTrends, setContactTrends] = useState<
    ContactTrendsResponse["data"]
  >([]);
  const [contactStatus, setContactStatus] = useState<
    ContactStatusResponse["data"]
  >({});
  const [categoryPerformance, setCategoryPerformance] = useState<
    CategoryPerformanceResponse["data"]["categories"]
  >([]);
  const [ratingDistribution, setRatingDistribution] = useState<
    RatingDistributionResponse["data"]
  >({});
  const [recentActivity, setRecentActivity] = useState<
    RecentActivityResponse["data"]["contacts"]
  >([]);
  const [galleryCategories, setGalleryCategories] = useState<
    GalleryCategoriesResponse["data"]
  >({});

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch all dashboard data
        const [
          overviewRes,
          trendsRes,
          statusRes,
          categoryRes,
          ratingRes,
          recentRes,
          galleryRes,
        ] = await Promise.all([
          getOverviewStats(),
          getContactTrends(),
          getContactStatusDistribution(),
          getCategoryPerformance(),
          getRatingDistribution(),
          getRecentActivity(),
          getGalleryCategories(),
        ]);

        setOverviewStats(overviewRes.data);
        setContactTrends(trendsRes.data);
        setContactStatus(statusRes.data);
        setCategoryPerformance(categoryRes.data.categories);
        setRatingDistribution(ratingRes.data);
        setRecentActivity(recentRes.data.contacts);
        setGalleryCategories(galleryRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    trend,
    color = "blue",
  }: {
    title: string;
    value: string | number;
    change?: number;
    icon: LucideIcon;
    trend?: "up" | "down";
    color?: string;
  }) => {
    const colorClasses = {
      blue: "bg-blue-500/10 text-blue-600 border-blue-200",
      green: "bg-green-500/10 text-green-600 border-green-200",
      red: "bg-red-500/10 text-red-600 border-red-200",
      yellow: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
      purple: "bg-purple-500/10 text-purple-600 border-purple-200",
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon
            className={`h-4 w-4 ${colorClasses[color as keyof typeof colorClasses].split(" ")[1]}`}
          />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {change !== undefined && trend && (
            <div className="flex items-center text-xs text-muted-foreground">
              {trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span
                className={trend === "up" ? "text-green-500" : "text-red-500"}
              >
                {Math.abs(change)}%
              </span>
              from last month
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 container mx-auto py-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto py-6">
      {/* Header */}
      <div className="space-y-2">
        <Typography variant="Bold_H2">Dashboard Overview</Typography>
        <Typography variant="Regular_H7" className="text-muted-foreground">
          Monitor your website performance and user engagement
        </Typography>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Contacts"
          value={overviewStats?.totalContacts || 0}
          change={overviewStats?.contactGrowth}
          trend={
            overviewStats?.contactGrowth && overviewStats.contactGrowth > 0
              ? "up"
              : "down"
          }
          icon={MessageSquare}
          color="blue"
        />

        <StatCard
          title="Pending Inquiries"
          value={overviewStats?.pendingContacts || 0}
          icon={AlertCircle}
          color="red"
        />

        <StatCard
          title="Average Rating"
          value={overviewStats?.avgRating?.toFixed(1) || "0.0"}
          icon={Star}
          color="yellow"
        />

        <StatCard
          title="Active Services"
          value={overviewStats?.activeServices || 0}
          icon={Package}
          color="green"
        />
      </div>

      {/* Charts */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Contact Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Contact Trends (12 Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={contactTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ fill: "#8884d8" }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Contact Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Contact Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(contactStatus).length === 0 ? (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No contact data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={Object.entries(contactStatus).map(
                          ([status, count]) => ({
                            name: status,
                            value: typeof count === "number" ? count : 0,
                          })
                        )}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(props: unknown) => {
                          const pieProps = props as { percentage?: number };
                          const percentage = pieProps?.percentage;
                          return percentage != null &&
                            !isNaN(percentage) &&
                            typeof percentage === "number"
                            ? `${percentage.toFixed(0)}%`
                            : "";
                        }}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {Object.entries(contactStatus).map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Category Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={categoryPerformance.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="inquiries" fill="#82ca9d" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Rating Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Customer Rating Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(ratingDistribution).length === 0 ? (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No rating data available
                  </div>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(ratingDistribution)
                      .reverse()
                      .map(([rating, count]) => {
                        const numericCount =
                          typeof count === "number" ? count : 0;
                        const values = Object.values(ratingDistribution).filter(
                          (v): v is number => typeof v === "number"
                        );
                        const maxCount =
                          values.length > 0 ? Math.max(...values) : 0;
                        const percentage =
                          maxCount > 0 ? (numericCount / maxCount) * 100 : 0;
                        return (
                          <div key={rating} className="flex items-center gap-2">
                            <div className="w-12 text-sm font-medium">
                              {rating} ⭐
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-500 h-2 rounded-full"
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>
                            <div className="w-12 text-sm text-right">
                              {numericCount}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Gallery Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Gallery Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(galleryCategories).map(
                    ([category, count]) => {
                      const numericCount =
                        typeof count === "number" ? count : 0;
                      return (
                        <div
                          key={category}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm">{category}</span>
                          <Badge variant="secondary">{numericCount}</Badge>
                        </div>
                      );
                    }
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Additional Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Content Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Categories</span>
                    <Badge variant="secondary">
                      {overviewStats?.activeCategories}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Services</span>
                    <Badge variant="secondary">
                      {overviewStats?.activeServices}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Users</span>
                    <Badge variant="secondary">
                      {overviewStats?.totalUsers}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">New Users</span>
                    <Badge variant="secondary">{overviewStats?.newUsers}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>{overviewStats?.avgRating?.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Revenue Growth</span>
                    <Badge
                      variant={
                        overviewStats?.contactGrowth &&
                        overviewStats.contactGrowth > 0
                          ? "default"
                          : "destructive"
                      }
                    >
                      {overviewStats?.contactGrowth?.toFixed(1) ?? "0.0"}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Response Rate</span>
                    <Badge variant="outline">
                      {overviewStats && overviewStats.totalContacts > 0
                        ? (
                            ((overviewStats.totalContacts -
                              overviewStats.pendingContacts) /
                              overviewStats.totalContacts) *
                            100
                          ).toFixed(0)
                        : 0}
                      %
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Contact Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity?.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{contact.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        {contact.email}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{contact.parentCategory?.name}</span>
                        {contact.service?.name && (
                          <>
                            <span>•</span>
                            <span>{contact.service.name}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>
                          {format(new Date(contact.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        contact.status === "PENDING"
                          ? "default"
                          : contact.status === "APPROVED"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {contact.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
