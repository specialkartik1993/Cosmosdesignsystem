import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use("*", logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

/* ================================================================ */
/*  KNOWN PATHS — canonical list of all tracked routes               */
/* ================================================================ */
const ALL_PATHS = [
  "/", "/installation", "/changelog",
  "/foundations/colors", "/foundations/typography", "/foundations/spacing",
  "/foundations/shadows", "/foundations/icons",
  "/tokens", "/theming", "/figma", "/api",
  "/components/button", "/components/input", "/components/badge",
  "/components/avatar", "/components/toggle", "/components/checkbox",
  "/components/tooltip", "/components/skeleton", "/components/separator",
  "/components/slider", "/components/progress", "/components/tag",
  "/components/card", "/components/alert", "/components/tabs",
  "/components/dropdown", "/components/select", "/components/dialog",
  "/components/popover", "/components/breadcrumb", "/components/pagination",
  "/components/accordion", "/components/error-states", "/components/timeline",
  "/components/status", "/components/search-bar", "/components/notification",
  "/components/table", "/components/navigation", "/components/form",
  "/components/charts", "/components/calendar",
  "/components/drawer",
  "/enterprise/data-grid", "/enterprise/file-upload",
  "/enterprise/rich-text-editor", "/enterprise/date-range-picker",
  "/interactions/interactive-cards", "/interactions/scroll-triggered",
  "/interactions/parallax", "/interactions/reveal-effects",
  "/ai/chat", "/ai/prompt", "/ai/response", "/ai/copilot", "/ai/widgets",
  "/examples/dashboard", "/examples/animations", "/examples/playground",
  "/examples/ai-playground", "/accessibility",
];

/* Helper: human-readable label for a route path */
function pathLabel(path: string): string {
  if (path === "/") return "Overview";
  const segments = path.split("/").filter(Boolean);
  const last = segments[segments.length - 1];
  return last
    .split("-")
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* Helper: determine category from path */
function pathCategory(path: string): string {
  if (path === "/") return "overview";
  const seg = path.split("/")[1];
  const map: Record<string, string> = {
    foundations: "foundations",
    components: "components",
    enterprise: "enterprise",
    interactions: "interactions",
    ai: "ai",
    examples: "examples",
  };
  return map[seg] || "general";
}

/* Helper: last N days as YYYY-MM-DD strings */
function lastNDays(n: number): string[] {
  const days: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

/* ================================================================ */
/*  HEALTH                                                          */
/* ================================================================ */
app.get("/make-server-d2841b3b/health", async (c) => {
  const start = Date.now();
  try {
    await kv.get("__health_check__");
    return c.json({
      status: "ok",
      latencyMs: Date.now() - start,
      timestamp: new Date().toISOString(),
      version: "2.0.0",
    });
  } catch (err) {
    return c.json({ status: "degraded", error: String(err), latencyMs: Date.now() - start }, 500);
  }
});

/* ================================================================ */
/*  FEEDBACK — thumbs up/down on component pages                    */
/* ================================================================ */
app.post("/make-server-d2841b3b/feedback", async (c) => {
  try {
    const { component, rating, comment, timestamp } = await c.req.json();
    if (!component || !rating) return c.json({ error: "Missing required fields: component, rating" }, 400);
    if (rating !== "up" && rating !== "down") return c.json({ error: "Rating must be 'up' or 'down'" }, 400);

    const feedbackKey = `feedback:${component}:${Date.now()}`;
    await kv.set(feedbackKey, { component, rating, comment, timestamp });

    const statsKey = `feedback-stats:${component}`;
    const existing = (await kv.get(statsKey)) || { up: 0, down: 0 };
    existing[rating] = (existing[rating] || 0) + 1;
    await kv.set(statsKey, existing);

    // Increment global feedback counter
    const globalKey = "global:feedback-count";
    const globalCount = (await kv.get(globalKey)) || 0;
    await kv.set(globalKey, globalCount + 1);

    console.log(`Feedback recorded for ${component}: ${rating}`);
    return c.json({ success: true, stats: existing });
  } catch (err) {
    console.log(`Error recording feedback: ${err}`);
    return c.json({ error: `Failed to record feedback: ${err}` }, 500);
  }
});

app.get("/make-server-d2841b3b/feedback/stats", async (c) => {
  try {
    const component = c.req.query("component");
    if (!component) return c.json({ error: "Missing required query param: component" }, 400);
    const stats = await kv.get(`feedback-stats:${component}`);
    return c.json(stats || { up: 0, down: 0 });
  } catch (err) {
    console.log(`Error fetching feedback stats: ${err}`);
    return c.json({ error: `Failed to fetch feedback stats: ${err}` }, 500);
  }
});

/* Feedback leaderboard — top-rated & most-discussed components */
app.get("/make-server-d2841b3b/feedback/leaderboard", async (c) => {
  try {
    const componentPaths = ALL_PATHS.filter(
      (p) => p.startsWith("/components/") || p.startsWith("/enterprise/") || p.startsWith("/ai/") || p.startsWith("/interactions/")
    );
    const slugs = componentPaths.map((p) => p.split("/").pop()!);
    const keys = slugs.map((s) => `feedback-stats:${s}`);
    const values = await kv.mget(keys);

    const items = slugs
      .map((slug, i) => {
        const stats = values[i] || { up: 0, down: 0 };
        const total = (stats.up || 0) + (stats.down || 0);
        const satisfaction = total > 0 ? Math.round(((stats.up || 0) / total) * 100) : 0;
        return {
          component: slug,
          label: pathLabel(`/components/${slug}`),
          up: stats.up || 0,
          down: stats.down || 0,
          total,
          satisfaction,
        };
      })
      .filter((item) => item.total > 0)
      .sort((a, b) => b.total - a.total);

    return c.json(items.slice(0, 15));
  } catch (err) {
    console.log(`Error fetching feedback leaderboard: ${err}`);
    return c.json({ error: `Failed to fetch feedback leaderboard: ${err}` }, 500);
  }
});

/* ================================================================ */
/*  ANALYTICS — page view tracking                                  */
/* ================================================================ */
app.post("/make-server-d2841b3b/analytics/pageview", async (c) => {
  try {
    const { path } = await c.req.json();
    if (!path) return c.json({ error: "Missing required field: path" }, 400);

    // Increment all-time counter
    const countKey = `pageviews:${path}`;
    const current = (await kv.get(countKey)) || 0;
    const newCount = current + 1;
    await kv.set(countKey, newCount);

    // Increment daily counter
    const today = new Date().toISOString().split("T")[0];
    const dailyKey = `daily-views:${today}:${path}`;
    const dailyCount = (await kv.get(dailyKey)) || 0;
    await kv.set(dailyKey, dailyCount + 1);

    // Increment daily total (across all pages)
    const dailyTotalKey = `daily-total:${today}`;
    const dailyTotal = (await kv.get(dailyTotalKey)) || 0;
    await kv.set(dailyTotalKey, dailyTotal + 1);

    // Increment global total
    const globalKey = "global:total-views";
    const globalTotal = (await kv.get(globalKey)) || 0;
    await kv.set(globalKey, globalTotal + 1);

    // Track unique pages visited (set of paths)
    const uniqueKey = "global:unique-pages";
    const uniqueSet: string[] = (await kv.get(uniqueKey)) || [];
    if (!uniqueSet.includes(path)) {
      uniqueSet.push(path);
      await kv.set(uniqueKey, uniqueSet);
    }

    return c.json({ success: true, views: newCount });
  } catch (err) {
    console.log(`Error tracking page view: ${err}`);
    return c.json({ error: `Failed to track page view: ${err}` }, 500);
  }
});

/* Popular pages — ranked by all-time views */
app.get("/make-server-d2841b3b/analytics/popular", async (c) => {
  try {
    const limit = Math.min(parseInt(c.req.query("limit") || "20"), 50);
    const keys = ALL_PATHS.map((p) => `pageviews:${p}`);
    const values = await kv.mget(keys);

    const results = ALL_PATHS.map((path, i) => ({
      path,
      label: pathLabel(path),
      category: pathCategory(path),
      views: values[i] || 0,
    }))
      .filter((r) => r.views > 0)
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);

    return c.json(results);
  } catch (err) {
    console.log(`Error fetching popular pages: ${err}`);
    return c.json({ error: `Failed to fetch popular pages: ${err}` }, 500);
  }
});

/* Daily trend data — last N days of total views */
app.get("/make-server-d2841b3b/analytics/trends", async (c) => {
  try {
    const days = Math.min(parseInt(c.req.query("days") || "14"), 30);
    const dates = lastNDays(days);
    const keys = dates.map((d) => `daily-total:${d}`);
    const values = await kv.mget(keys);

    const trend = dates.map((date, i) => ({
      date,
      label: new Date(date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views: values[i] || 0,
    }));

    return c.json(trend);
  } catch (err) {
    console.log(`Error fetching trend data: ${err}`);
    return c.json({ error: `Failed to fetch trend data: ${err}` }, 500);
  }
});

/* Category breakdown — views grouped by section */
app.get("/make-server-d2841b3b/analytics/categories", async (c) => {
  try {
    const keys = ALL_PATHS.map((p) => `pageviews:${p}`);
    const values = await kv.mget(keys);

    const categories: Record<string, { views: number; pages: number }> = {};
    ALL_PATHS.forEach((path, i) => {
      const cat = pathCategory(path);
      if (!categories[cat]) categories[cat] = { views: 0, pages: 0 };
      const views = values[i] || 0;
      if (views > 0) {
        categories[cat].views += views;
        categories[cat].pages += 1;
      }
    });

    const result = Object.entries(categories)
      .map(([category, data]) => ({
        category,
        label: category.charAt(0).toUpperCase() + category.slice(1),
        ...data,
      }))
      .filter((c) => c.views > 0)
      .sort((a, b) => b.views - a.views);

    return c.json(result);
  } catch (err) {
    console.log(`Error fetching category breakdown: ${err}`);
    return c.json({ error: `Failed to fetch category breakdown: ${err}` }, 500);
  }
});

/* Engagement scores — combined views + feedback per component */
app.get("/make-server-d2841b3b/analytics/engagement", async (c) => {
  try {
    const componentPaths = ALL_PATHS.filter(
      (p) => p.startsWith("/components/") || p.startsWith("/enterprise/") || p.startsWith("/ai/") || p.startsWith("/interactions/")
    );

    const viewKeys = componentPaths.map((p) => `pageviews:${p}`);
    const viewValues = await kv.mget(viewKeys);

    const slugs = componentPaths.map((p) => p.split("/").pop()!);
    const fbKeys = slugs.map((s) => `feedback-stats:${s}`);
    const fbValues = await kv.mget(fbKeys);

    const items = componentPaths.map((path, i) => {
      const views = viewValues[i] || 0;
      const fb = fbValues[i] || { up: 0, down: 0 };
      const feedbackTotal = (fb.up || 0) + (fb.down || 0);
      // Engagement = views + weighted feedback (feedback is rarer, worth more)
      const engagement = views + feedbackTotal * 5;
      const satisfaction = feedbackTotal > 0 ? Math.round(((fb.up || 0) / feedbackTotal) * 100) : null;

      return {
        path,
        slug: slugs[i],
        label: pathLabel(path),
        category: pathCategory(path),
        views,
        feedbackUp: fb.up || 0,
        feedbackDown: fb.down || 0,
        feedbackTotal,
        satisfaction,
        engagement,
      };
    })
      .filter((item) => item.views > 0 || item.feedbackTotal > 0)
      .sort((a, b) => b.engagement - a.engagement);

    return c.json(items.slice(0, 20));
  } catch (err) {
    console.log(`Error fetching engagement data: ${err}`);
    return c.json({ error: `Failed to fetch engagement data: ${err}` }, 500);
  }
});

/* ================================================================ */
/*  DASHBOARD SUMMARY — single aggregated endpoint                  */
/* ================================================================ */
app.get("/make-server-d2841b3b/analytics/dashboard", async (c) => {
  try {
    // Fetch all globals in parallel
    const [totalViews, uniquePages, feedbackCount] = await kv.mget([
      "global:total-views",
      "global:unique-pages",
      "global:feedback-count",
    ]);

    // Today's views
    const today = new Date().toISOString().split("T")[0];
    const todayViews = (await kv.get(`daily-total:${today}`)) || 0;

    // Yesterday's views for comparison
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const yesterdayViews = (await kv.get(`daily-total:${yesterday}`)) || 0;

    // Calculate change percentage
    const viewsChange = yesterdayViews > 0 ? Math.round(((todayViews - yesterdayViews) / yesterdayViews) * 100) : todayViews > 0 ? 100 : 0;

    // Aggregate satisfaction from all feedback
    const componentPaths = ALL_PATHS.filter(
      (p) => p.startsWith("/components/") || p.startsWith("/enterprise/") || p.startsWith("/ai/") || p.startsWith("/interactions/")
    );
    const slugs = componentPaths.map((p) => p.split("/").pop()!);
    const fbKeys = slugs.map((s) => `feedback-stats:${s}`);
    const fbValues = await kv.mget(fbKeys);

    let totalUp = 0;
    let totalDown = 0;
    let componentsWithFeedback = 0;
    fbValues.forEach((fb) => {
      if (fb) {
        totalUp += fb.up || 0;
        totalDown += fb.down || 0;
        if ((fb.up || 0) + (fb.down || 0) > 0) componentsWithFeedback++;
      }
    });

    const totalFeedback = totalUp + totalDown;
    const avgSatisfaction = totalFeedback > 0 ? Math.round((totalUp / totalFeedback) * 100) : 0;

    return c.json({
      totalViews: totalViews || 0,
      uniquePagesVisited: Array.isArray(uniquePages) ? uniquePages.length : 0,
      totalPages: ALL_PATHS.length,
      totalFeedback: feedbackCount || 0,
      todayViews,
      yesterdayViews,
      viewsChange,
      feedbackUp: totalUp,
      feedbackDown: totalDown,
      avgSatisfaction,
      componentsWithFeedback,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.log(`Error fetching dashboard summary: ${err}`);
    return c.json({ error: `Failed to fetch dashboard summary: ${err}` }, 500);
  }
});

/* ================================================================ */
/*  PREFERENCES — persist user settings                             */
/* ================================================================ */
app.post("/make-server-d2841b3b/preferences", async (c) => {
  try {
    const { sessionId, prefs } = await c.req.json();
    if (!sessionId) return c.json({ error: "Missing required field: sessionId" }, 400);
    await kv.set(`prefs:${sessionId}`, prefs);
    return c.json({ success: true });
  } catch (err) {
    console.log(`Error saving preferences: ${err}`);
    return c.json({ error: `Failed to save preferences: ${err}` }, 500);
  }
});

app.get("/make-server-d2841b3b/preferences", async (c) => {
  try {
    const sessionId = c.req.query("sessionId");
    if (!sessionId) return c.json({ error: "Missing required query param: sessionId" }, 400);
    const prefs = await kv.get(`prefs:${sessionId}`);
    return c.json(prefs || null);
  } catch (err) {
    console.log(`Error fetching preferences: ${err}`);
    return c.json({ error: `Failed to fetch preferences: ${err}` }, 500);
  }
});

Deno.serve(app.fetch);