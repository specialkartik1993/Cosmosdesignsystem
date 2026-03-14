import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;

// Singleton Supabase client for frontend use
export const supabase = createClient(supabaseUrl, publicAnonKey);

// Base URL for server API calls
const API_BASE = `${supabaseUrl}/functions/v1/make-server-d2841b3b`;

// Generic fetch helper with auth header
async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${publicAnonKey}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error');
    console.error(`API error [${res.status}] ${path}: ${text}`);
    throw new Error(`API ${res.status}: ${text}`);
  }

  return res.json();
}

// ---- Feedback API ----

export interface ComponentFeedback {
  component: string;
  rating: 'up' | 'down';
  comment?: string;
  timestamp: string;
}

export async function submitFeedback(feedback: ComponentFeedback) {
  return apiFetch('/feedback', {
    method: 'POST',
    body: JSON.stringify(feedback),
  });
}

export async function getFeedbackStats(component: string): Promise<{ up: number; down: number }> {
  return apiFetch(`/feedback/stats?component=${encodeURIComponent(component)}`);
}

export interface FeedbackLeaderboardItem {
  component: string;
  label: string;
  up: number;
  down: number;
  total: number;
  satisfaction: number;
}

export async function getFeedbackLeaderboard(): Promise<FeedbackLeaderboardItem[]> {
  return apiFetch('/feedback/leaderboard');
}

// ---- Page View Analytics API ----

export async function trackPageView(path: string) {
  return apiFetch('/analytics/pageview', {
    method: 'POST',
    body: JSON.stringify({ path, timestamp: new Date().toISOString() }),
  });
}

export interface PopularPage {
  path: string;
  label: string;
  category: string;
  views: number;
}

export async function getPopularPages(limit = 20): Promise<PopularPage[]> {
  return apiFetch(`/analytics/popular?limit=${limit}`);
}

export interface TrendPoint {
  date: string;
  label: string;
  views: number;
}

export async function getViewTrends(days = 14): Promise<TrendPoint[]> {
  return apiFetch(`/analytics/trends?days=${days}`);
}

export interface CategoryBreakdown {
  category: string;
  label: string;
  views: number;
  pages: number;
}

export async function getCategoryBreakdown(): Promise<CategoryBreakdown[]> {
  return apiFetch('/analytics/categories');
}

export interface EngagementItem {
  path: string;
  slug: string;
  label: string;
  category: string;
  views: number;
  feedbackUp: number;
  feedbackDown: number;
  feedbackTotal: number;
  satisfaction: number | null;
  engagement: number;
}

export async function getEngagementData(): Promise<EngagementItem[]> {
  return apiFetch('/analytics/engagement');
}

export interface DashboardSummary {
  totalViews: number;
  uniquePagesVisited: number;
  totalPages: number;
  totalFeedback: number;
  todayViews: number;
  yesterdayViews: number;
  viewsChange: number;
  feedbackUp: number;
  feedbackDown: number;
  avgSatisfaction: number;
  componentsWithFeedback: number;
  timestamp: string;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return apiFetch('/analytics/dashboard');
}

export async function getSystemHealth(): Promise<{
  status: string;
  latencyMs: number;
  timestamp: string;
  version: string;
}> {
  return apiFetch('/health');
}

// ---- User Preferences API ----

export async function savePreferences(sessionId: string, prefs: Record<string, any>) {
  return apiFetch('/preferences', {
    method: 'POST',
    body: JSON.stringify({ sessionId, prefs }),
  });
}

export async function getPreferences(sessionId: string): Promise<Record<string, any> | null> {
  return apiFetch(`/preferences?sessionId=${encodeURIComponent(sessionId)}`);
}
