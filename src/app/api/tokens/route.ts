import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getAllTokens, saveToken } from "@/lib/kv";
import { getSessionFromCookies, verifySession } from "@/lib/auth";
import type { AgentToken } from "@/lib/types";

async function requireAdmin(): Promise<boolean> {
  const token = await getSessionFromCookies();
  if (!token) return false;
  return verifySession(token);
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let tokens: AgentToken[] = [];
  try {
    tokens = await getAllTokens();
  } catch {
    // KV not configured
  }

  // Return tokens with the raw value masked (show only last 4 chars)
  const masked = tokens.map((t) => ({
    id: t.id,
    name: t.name,
    tokenPreview: `...${t.token.slice(-4)}`,
    createdAt: t.createdAt,
  }));

  return NextResponse.json(masked);
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = (body as Record<string, unknown>)?.name;
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json(
      { error: "name is required" },
      { status: 400 }
    );
  }

  const id = randomUUID();
  const rawToken = `wf_${randomUUID().replace(/-/g, "")}`;

  const agentToken: AgentToken = {
    id,
    name: name.trim(),
    token: rawToken,
    createdAt: new Date().toISOString(),
  };

  await saveToken(agentToken);

  // Return the full token value only once on creation
  return NextResponse.json(agentToken, { status: 201 });
}
