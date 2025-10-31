import { NextRequest, NextResponse } from "next/server";
import { scrapeMeeshoProduct } from "@/lib/scraper";
import { analyzeSentiment, generateInsights } from "@/lib/ai-analysis";
import { supabase } from "@/lib/supabase";
import { redis } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || !url.includes("meesho.com")) {
      return NextResponse.json({ error: "Invalid Meesho URL" }, { status: 400 });
    }

    // Check cache
    const cacheKey = `analysis:${url}`;
    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return NextResponse.json(cached);
      }
    }

    // Create job
    const jobId = `job-${Date.now()}`;
    const job = {
      id: jobId,
      productId: "",
      status: "scraping",
      progress: 10,
      message: "Scraping product data...",
      startedAt: new Date().toISOString(),
    };

    if (redis) {
      await redis.set(`job:${jobId}`, JSON.stringify(job), { ex: 3600 });
    }

    // Start scraping in background
    scrapeAndAnalyze(jobId, url);

    return NextResponse.json({ jobId, status: "started" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function scrapeAndAnalyze(jobId: string, url: string) {
  try {
    // Update progress
    await updateJob(jobId, { status: "scraping", progress: 20, message: "Fetching product info..." });

    const { product, reviews } = await scrapeMeeshoProduct(url);

    await updateJob(jobId, { status: "analyzing", progress: 50, message: "Analyzing reviews..." });

    const analyzedReviews = await analyzeSentiment(reviews);
    const insights = await generateInsights(analyzedReviews, product);

    await updateJob(jobId, { status: "analyzing", progress: 80, message: "Generating insights..." });

    // Save to database (mock for now)
    const priceHistory = [
      { productId: product.id, price: product.price, timestamp: new Date().toISOString() },
    ];

    const result = {
      product,
      reviews: analyzedReviews,
      priceHistory,
      insights,
    };

    // Cache result
    if (redis) {
      await redis.set(`analysis:${url}`, JSON.stringify(result), { ex: 900 }); // 15 min cache
      await redis.set(`result:${jobId}`, JSON.stringify(result), { ex: 3600 });
    }

    await updateJob(jobId, {
      status: "completed",
      progress: 100,
      message: "Analysis complete!",
      completedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    await updateJob(jobId, {
      status: "failed",
      progress: 0,
      message: "Analysis failed",
      error: error.message,
    });
  }
}

async function updateJob(jobId: string, updates: any) {
  if (!redis) return;
  const existing = await redis.get(`job:${jobId}`);
  const job = typeof existing === "string" ? JSON.parse(existing) : existing || {};
  const updated = { ...job, ...updates };
  await redis.set(`job:${jobId}`, JSON.stringify(updated), { ex: 3600 });
}
