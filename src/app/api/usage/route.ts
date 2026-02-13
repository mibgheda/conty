import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUsageInfo } from "@/lib/usage";

export async function GET(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const anonymousId = request.cookies.get("anon_id")?.value ?? null;

  const usage = await getUsageInfo(userId, anonymousId);

  return NextResponse.json(usage);
}
