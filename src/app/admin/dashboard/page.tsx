import Link from "next/link";
import { getAllPosts } from "@/lib/kv";
import type { Post } from "@/lib/types";
import DashboardClient, { TokenManager } from "./DashboardClient";

export const revalidate = 0;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function DashboardPage() {
  let posts: Post[] = [];
  try {
    posts = await getAllPosts();
    posts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    // KV not configured
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {posts.length} post{posts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            ← Site
          </Link>
          <DashboardClient logoutOnly />
        </div>
      </header>

      {posts.length === 0 ? (
        <p className="text-zinc-500 text-sm">No posts yet.</p>
      ) : (
        <ul className="divide-y divide-zinc-800">
          {posts.map((post) => (
            <li key={post.id} className="py-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-zinc-100 font-medium hover:text-white transition-colors line-clamp-1"
                  target="_blank"
                >
                  {post.title}
                </Link>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {post.author} · {formatDate(post.createdAt)}
                </p>
              </div>
              <DashboardClient postId={post.id} />
            </li>
          ))}
        </ul>
      )}

      <TokenManager />
    </div>
  );
}
