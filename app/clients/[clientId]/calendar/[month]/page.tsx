"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, CheckCircle, XCircle, Instagram, Linkedin, Facebook } from "lucide-react";

interface Post {
  date: string;
  platform: string;
  content: string;
  hashtags: string[];
  media_suggestion: string;
  cta: string;
  alignment_score?: number;
  validation_score?: number;
  status?: string;
}

interface CalendarData {
  posts: Post[];
  metadata: {
    total_posts: number;
    platforms_distribution: { [key: string]: number };
    themes: string[];
  };
  quality_score: number;
}

const platformIcons: { [key: string]: any } = {
  instagram: Instagram,
  linkedin: Linkedin,
  facebook: Facebook,
};

const platformColors: { [key: string]: string } = {
  instagram: "bg-pink-500",
  linkedin: "bg-blue-600",
  facebook: "bg-blue-500",
  tiktok: "bg-black",
  twitter: "bg-sky-500",
};

export default function CalendarMonthPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;
  const month = params.month as string;

  const [calendar, setCalendar] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    fetchCalendar();
  }, [clientId, month]);

  const fetchCalendar = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/clients/${clientId}/calendar/${month}`);
      // const data = await response.json();
      
      // Mock data for now
      const mockData: CalendarData = {
        posts: [
          {
            date: "2026-03-01",
            platform: "instagram",
            content: "🚀 Lanzamos nueva funcionalidad que revoluciona la forma de trabajar. #innovation #tech",
            hashtags: ["#innovation", "#tech", "#productlaunch"],
            media_suggestion: "Product screenshot with gradient background",
            cta: "Link en bio para probar gratis",
            alignment_score: 0.92,
            validation_score: 0.88,
            status: "pending"
          },
          {
            date: "2026-03-03",
            platform: "linkedin",
            content: "Insights de nuestro último estudio sobre productividad en equipos remotos.",
            hashtags: ["#remotework", "#productivity"],
            media_suggestion: "Infographic with key statistics",
            cta: "Descarga el whitepaper completo",
            alignment_score: 0.89,
            validation_score: 0.91,
            status: "pending"
          },
        ],
        metadata: {
          total_posts: 20,
          platforms_distribution: { instagram: 10, linkedin: 7, tiktok: 3 },
          themes: ["educativo", "inspiracional", "promocional"]
        },
        quality_score: 0.90
      };
      
      setCalendar(mockData);
    } catch (error) {
      console.error("Error fetching calendar:", error);
    } finally {
      setLoading(false);
    }
  };

  const approvePost = (post: Post) => {
    // TODO: API call to approve post
    console.log("Approving post:", post);
  };

  const rejectPost = (post: Post) => {
    // TODO: API call to reject post
    console.log("Rejecting post:", post);
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

  if (!calendar) {
    return (
      <div className="p-8">
        <div className="text-center text-muted-foreground">
          No calendar found for {month}
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold">Calendar {month}</h1>
            <p className="text-muted-foreground">
              {calendar.metadata.total_posts} posts scheduled
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Quality Score</div>
            <div className="text-2xl font-bold text-[#84cc16]">
              {(calendar.quality_score * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {Object.entries(calendar.metadata.platforms_distribution).map(([platform, count]) => {
              const Icon = platformIcons[platform];
              return (
                <div key={platform} className="flex items-center gap-2">
                  {Icon && <Icon className="h-4 w-4" />}
                  <span className="capitalize">{platform}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Posts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {calendar.posts.map((post, index) => {
          const Icon = platformIcons[post.platform];
          const colorClass = platformColors[post.platform] || "bg-gray-500";

          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`${colorClass} p-2 rounded`}>
                      {Icon && <Icon className="h-4 w-4 text-white" />}
                    </div>
                    <div>
                      <CardTitle className="text-sm capitalize">{post.platform}</CardTitle>
                      <CardDescription>{post.date}</CardDescription>
                    </div>
                  </div>
                  {post.validation_score && (
                    <Badge variant={post.validation_score >= 0.85 ? "default" : "secondary"}>
                      {(post.validation_score * 100).toFixed(0)}%
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{post.content}</p>

                <div className="flex flex-wrap gap-1">
                  {post.hashtags.slice(0, 3).map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {post.hashtags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{post.hashtags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">
                  <strong>CTA:</strong> {post.cta}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    className="flex-1"
                    onClick={() => approvePost(post)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => rejectPost(post)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Themes */}
      {calendar.metadata.themes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Content Themes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {calendar.metadata.themes.map((theme, i) => (
                <Badge key={i} variant="secondary">
                  {theme}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
