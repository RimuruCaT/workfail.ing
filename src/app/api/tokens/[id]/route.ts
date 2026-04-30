import { NextRequest, NextResponse } from "next/server";
import { deleteToken } from "@/lib/kv";
import { getSessionFromCookies, verifySession } from "@/lib/auth";

async function requireAdmin(): Promise<boolean> {
  const token = await getSessionFromCookies();
  if (!token) return false;
  return verifySession(token);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteToken(id);
  if (!deleted) {
    return NextResponse.json({ error: "Token not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
