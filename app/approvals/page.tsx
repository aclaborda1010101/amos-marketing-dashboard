"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Filter,
  Calendar,
  User,
} from "lucide-react";

interface Approval {
  id: string;
  request_id: string;
  client_id: string;
  client_name: string;
  bot: string;
  request_type: string;
  priority: number;
  payload: any;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  decided_at?: string;
  decided_by?: string;
  decision?: any;
}

const priorityLabels: { [key: number]: string } = {
  1: "Critical",
  2: "High",
  3: "Medium",
  4: "Low",
  5: "Normal",
};

const priorityColors: { [key: number]: string } = {
  1: "bg-red-500",
  2: "bg-orange-500",
  3: "bg-yellow-500",
  4: "bg-blue-500",
  5: "bg-gray-500",
};

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterClient, setFilterClient] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("pending");

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      setLoading(true);

      // TODO: Replace with actual API call
      // const response = await fetch(`/api/approvals?client_id=${filterClient}`);
      // const data = await response.json();

      // Mock data
      const mockApprovals: Approval[] = [
        {
          id: "1",
          request_id: "req-001",
          client_id: "client-123",
          client_name: "Agustito Lab",
          bot: "brand_architect",
          request_type: "brand_dna_approval",
          priority: 1,
          payload: {
            essence: "Laboratorio de IA que transforma procesos empresariales",
            quality_score: 0.90,
          },
          status: "pending",
          created_at: "2026-03-01T10:00:00Z",
        },
        {
          id: "2",
          request_id: "req-002",
          client_id: "client-456",
          client_name: "Fashion Brand",
          bot: "content_bot",
          request_type: "calendar_approval",
          priority: 2,
          payload: {
            month: "2026-03",
            posts_count: 20,
            quality_score: 0.88,
          },
          status: "pending",
          created_at: "2026-03-01T11:30:00Z",
        },
        {
          id: "3",
          request_id: "req-003",
          client_id: "client-789",
          client_name: "Tech Startup",
          bot: "content_bot",
          request_type: "post_approval",
          priority: 3,
          payload: {
            platform: "instagram",
            content: "Launching our new feature...",
          },
          status: "approved",
          created_at: "2026-02-28T15:00:00Z",
          decided_at: "2026-02-28T16:00:00Z",
          decided_by: "director",
        },
      ];

      setApprovals(mockApprovals);
    } catch (error) {
      console.error("Error fetching approvals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (requestId: string, decision: "approved" | "rejected") => {
    try {
      // TODO: API call
      // await fetch(`/api/approvals/${requestId}/decide`, {
      //   method: "POST",
      //   body: JSON.stringify({ decision }),
      // });

      console.log(`Decision: ${decision} for request ${requestId}`);

      // Update local state
      setApprovals((prev) =>
        prev.map((a) => (a.request_id === requestId ? { ...a, status: decision } : a))
      );
    } catch (error) {
      console.error("Error deciding approval:", error);
    }
  };

  const filteredApprovals = approvals.filter((approval) => {
    if (activeTab !== "all" && approval.status !== activeTab) return false;
    if (filterClient !== "all" && approval.client_id !== filterClient) return false;
    if (filterPriority !== "all" && approval.priority.toString() !== filterPriority)
      return false;
    return true;
  });

  const pendingCount = approvals.filter((a) => a.status === "pending").length;
  const approvedCount = approvals.filter((a) => a.status === "approved").length;
  const rejectedCount = approvals.filter((a) => a.status === "rejected").length;

  const uniqueClients = Array.from(new Set(approvals.map((a) => a.client_name)));

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#84cc16]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Approval Queue</h1>
        <p className="text-muted-foreground">Review and approve team proposals</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting decision</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">Needs revision</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <Select value={filterClient} onValueChange={setFilterClient}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All clients" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All clients</SelectItem>
            {uniqueClients.map((client) => (
              <SelectItem key={client} value={client}>
                {client}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="1">Critical (P1)</SelectItem>
            <SelectItem value="2">High (P2)</SelectItem>
            <SelectItem value="3">Medium (P3)</SelectItem>
            <SelectItem value="5">Normal (P5)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending
            {pendingCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredApprovals.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No approvals found
              </CardContent>
            </Card>
          ) : (
            filteredApprovals.map((approval) => {
              const priorityColor = priorityColors[approval.priority] || "bg-gray-500";
              const priorityLabel = priorityLabels[approval.priority] || "Normal";

              return (
                <Card key={approval.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="capitalize">
                            {approval.request_type.replace("_", " ")}
                          </CardTitle>
                          <Badge className={`${priorityColor} text-white`}>
                            P{approval.priority} - {priorityLabel}
                          </Badge>
                          <Badge
                            variant={
                              approval.status === "pending"
                                ? "destructive"
                                : approval.status === "approved"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {approval.status}
                          </Badge>
                        </div>
                        <CardDescription>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {approval.client_name}
                            </span>
                            <span>Bot: {approval.bot}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(approval.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </CardDescription>
                      </div>

                      {approval.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDecision(approval.request_id, "rejected")}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDecision(approval.request_id, "approved")}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                      {Object.entries(approval.payload).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="capitalize text-muted-foreground">
                            {key.replace("_", " ")}:
                          </span>
                          <span className="font-medium">
                            {typeof value === "number" && key.includes("score")
                              ? `${(value * 100).toFixed(0)}%`
                              : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
