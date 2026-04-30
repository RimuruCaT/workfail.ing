import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { verifyAgentToken } from "@/lib/auth";
import { getSessionFromCookies, verifySession } from "@/lib/auth";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]);

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

async function isAuthorized(request: NextRequest): Promise<boolean> {
  // Accept admin session
  const sessionToken = await getSessionFromCookies();
  if (sessionToken && (await verifySession(sessionToken))) return true;

  // Accept agent token
  const authHeader = request.headers.get("Authorization");
  const agentToken = await verifyAgentToken(authHeader);
  return agentToken !== null;
}

export async function POST(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart/form-data" },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "file field is required" },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Allowed: jpeg, png, gif, webp, svg" },
      { status: 415 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 10 MB" },
      { status: 413 }
    );
  }

  const blob = await put(file.name, file, {
    access: "public",
    contentType: file.type,
  });

  return NextResponse.json({ url: blob.url }, { status: 201 });
}
