import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { savePost } from "@/lib/kv";
import { verifyApiKey } from "@/lib/auth";
import type { Post } from "@/lib/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!verifyApiKey(authHeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).title !== "string" ||
    typeof (body as Record<string, unknown>).content !== "string" ||
    typeof (body as Record<string, unknown>).author !== "string"
  ) {
    return NextResponse.json(
      { error: "Missing required fields: title, content, author" },
      { status: 400 }
    );
  }

  const { title, content, author, tags } = body as {
    title: string;
    content: string;
    author: string;
    tags?: unknown;
  };

  const normalizedTags: string[] = Array.isArray(tags)
    ? tags.filter((t): t is string => typeof t === "string")
    : [];

  const id = randomUUID();
  const baseSlug = slugify(title) || id;
  const slug = `${baseSlug}-${id.slice(0, 8)}`;

  const post: Post = {
    id,
    title: title.trim(),
    content,
    author: author.trim(),
    createdAt: new Date().toISOString(),
    slug,
    tags: normalizedTags,
  };

  await savePost(post);

  return NextResponse.json({ id, slug }, { status: 201 });
}
