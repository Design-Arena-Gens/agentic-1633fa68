import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(req: NextRequest, { params }: { params: { jobId: string } }) {
  try {
    const { jobId } = params;

    if (!redis) {
      return NextResponse.json({ error: "Redis not configured" }, { status: 500 });
    }

    const job = await redis.get(`job:${jobId}`);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(typeof job === "string" ? JSON.parse(job) : job);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
