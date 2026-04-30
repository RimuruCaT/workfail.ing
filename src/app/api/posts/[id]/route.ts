import { NextRequest, NextResponse } from "next/server";
import { getPost, updatePost, deletePost } from "@/lib/kv";
import { getSessionFromCookies, verifySession } from "@/lib/auth";

async function requireAdmin(): Promise<boolean> {
  const token = await getSessionFromCookies();
  if (!token) return false;
  return verifySession(token);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const post = await getPost(id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (typeof (body as Record<string, unknown>)?.title === "string")
    updates.title = ((body as Record<string, unknown>).title as string).trim();
  if (typeof (body as Record<string, unknown>)?.content === "string")
    updates.content = (body as Record<string, unknown>).content as string;
  if (Array.isArray((body as Record<string, unknown>)?.tags))
    updates.tags = (
      (body as Record<string, unknown>).tags as unknown[]
    ).filter((t): t is string => typeof t === "string");

  const updated = await updatePost(id, updates);
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deletePost(id);
  if (!deleted) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
