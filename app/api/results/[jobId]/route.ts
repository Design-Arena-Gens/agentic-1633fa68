import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(req: NextRequest, { params }: { params: { jobId: string } }) {
  try {
    const { jobId } = params;
    const range = req.nextUrl.searchParams.get("range") || "1m";

    if (!redis) {
      return NextResponse.json({ error: "Redis not configured" }, { status: 500 });
    }

    const result = await redis.get(`result:${jobId}`);

    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    const parsed = typeof result === "string" ? JSON.parse(result) : result;

    // Filter price history based on range
    if (parsed.priceHistory) {
      const now = Date.now();
      const rangeMs = range === "1m" ? 30 * 86400000 : range === "6m" ? 180 * 86400000 : Infinity;
      parsed.priceHistory = parsed.priceHistory.filter(
        (ph: any) => now - new Date(ph.timestamp).getTime() < rangeMs
      );
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
