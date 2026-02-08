"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Target, TrendingUp, CheckCircle, XCircle, Clock } from "lucide-react";

interface Campaign {
  id: string;
  client_id: string;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
  budget?: number;
  objectives: string[];
  kpis: {
    reach?: number;
    engagement?: number;
    conversions?: number;
  };
  proposals: Proposal[];
}

interface Proposal {
  id: string;
  type: string;
  title: string;
  description: string;
  created_by: string;
  created_at: string;
  status: string;
  details: any;
}

const statusColors: { [key: string]: string } = {
  active: "bg-green-500",
  paused: "bg-yellow-500",
  completed: "bg-blue-500",
  draft: "bg-gray-500",
};

const statusLabels: { [key: string]: string } = {
  active: "Active",
  paused: "Paused",
  completed: "Completed",
  draft: "Draft",
};

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;
  const campaignId = params.campaignId as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaign();
  }, [clientId, campaignId]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);

      // TODO: Replace with actual API call
      // const response = await fetch(`/api/clients/${clientId}/campaigns/${campaignId}`);
      // const data = await response.json();

      // Mock data
      const mockCampaign: Campaign = {
        id: campaignId,
        client_id: clientId,
        name: "Q1 Product Launch Campaign",
        status: "active",
        start_date: "2026-03-01",
        end_date: "2026-03-31",
        budget: 5000,
        objectives: [
          "Increase brand awareness",
          "Generate 500+ leads",
          "Achieve 5% conversion rate",
        ],
        kpis: {
          reach: 150000,
          engagement: 8500,
          conversions: 125,
        },
        proposals: [
          {
            id: "prop-1",
            type: "content",
            title: "Video Series Proposal",
            description: "3-part video series showcasing product features",
            created_by: "Content Team",
            created_at: "2026-02-28",
            status: "pending",
            details: {
              videos: 3,
              duration: "2-3 min each",
              platforms: ["instagram", "tiktok", "youtube"],
            },
          },
          {
            id: "prop-2",
            type: "collaboration",
            title: "Influencer Partnership",
            description: "Collaboration with @techinfluencer (150K followers)",
            created_by: "Marketing Team",
            created_at: "2026-03-01",
            status: "pending",
            details: {
              influencer: "@techinfluencer",
              followers: "150K",
              deliverables: ["2 posts", "1 story", "1 reel"],
              cost: "$2,500",
            },
          },
        ],
      };

      setCampaign(mockCampaign);
    } catch (error) {
      console.error("Error fetching campaign:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveProposal = (proposalId: string) => {
    // TODO: API call to approve proposal
    console.log("Approving proposal:", proposalId);
  };

  const rejectProposal = (proposalId: string) => {
    // TODO: API call to reject proposal
    console.log("Rejecting proposal:", proposalId);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#84cc16]"></div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="p-8">
        <div className="text-center text-muted-foreground">Campaign not found</div>
      </div>
    );
  }

  const statusColor = statusColors[campaign.status] || "bg-gray-500";
  const statusLabel = statusLabels[campaign.status] || campaign.status;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/clients/${clientId}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{campaign.name}</h1>
              <Badge className={`${statusColor} text-white`}>{statusLabel}</Badge>
            </div>
            <p className="text-muted-foreground">
              {campaign.start_date} - {campaign.end_date}
            </p>
          </div>
        </div>

        {campaign.budget && (
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Budget</div>
            <div className="text-2xl font-bold">${campaign.budget.toLocaleString()}</div>
          </div>
        )}
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaign.kpis.reach?.toLocaleString() || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Total impressions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaign.kpis.engagement?.toLocaleString() || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Likes, comments, shares</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaign.kpis.conversions?.toLocaleString() || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Leads generated</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="proposals">
            Proposals
            {campaign.proposals.filter((p) => p.status === "pending").length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {campaign.proposals.filter((p) => p.status === "pending").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {campaign.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Target className="h-5 w-5 text-[#84cc16] mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Proposals Tab */}
        <TabsContent value="proposals" className="space-y-4">
          {campaign.proposals.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No proposals yet
              </CardContent>
            </Card>
          ) : (
            campaign.proposals.map((proposal) => (
              <Card key={proposal.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{proposal.title}</CardTitle>
                      <CardDescription>
                        {proposal.created_by} • {proposal.created_at}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        proposal.status === "pending"
                          ? "destructive"
                          : proposal.status === "approved"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {proposal.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{proposal.description}</p>

                  {proposal.details && (
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                      {Object.entries(proposal.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="capitalize text-muted-foreground">
                            {key.replace("_", " ")}:
                          </span>
                          <span className="font-medium">
                            {Array.isArray(value) ? value.join(", ") : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {proposal.status === "pending" && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        className="flex-1"
                        onClick={() => approveProposal(proposal.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => rejectProposal(proposal.id)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Real-time campaign analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Performance dashboard coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
