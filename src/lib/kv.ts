import { kv } from "@vercel/kv";
import type { Post } from "./types";

const POSTS_INDEX_KEY = "posts:index";
const POST_KEY_PREFIX = "post:";

export async function getPostIds(): Promise<string[]> {
  const ids = await kv.lrange<string>(POSTS_INDEX_KEY, 0, -1);
  return ids ?? [];
}

export async function getPost(id: string): Promise<Post | null> {
  return kv.get<Post>(`${POST_KEY_PREFIX}${id}`);
}

export async function getAllPosts(): Promise<Post[]> {
  const ids = await getPostIds();
  if (ids.length === 0) return [];
  const posts = await Promise.all(ids.map((id) => getPost(id)));
  return posts.filter((p): p is Post => p !== null);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const ids = await getPostIds();
  for (const id of ids) {
    const post = await getPost(id);
    if (post?.slug === slug) return post;
  }
  return null;
}

export async function savePost(post: Post): Promise<void> {
  await kv.set(`${POST_KEY_PREFIX}${post.id}`, post);
  await kv.lpush(POSTS_INDEX_KEY, post.id);
}

export async function updatePost(
  id: string,
  updates: Partial<Omit<Post, "id" | "createdAt">>
): Promise<Post | null> {
  const post = await getPost(id);
  if (!post) return null;
  const updated: Post = { ...post, ...updates };
  await kv.set(`${POST_KEY_PREFIX}${id}`, updated);
  return updated;
}

export async function deletePost(id: string): Promise<boolean> {
  const post = await getPost(id);
  if (!post) return false;
  await kv.del(`${POST_KEY_PREFIX}${id}`);
  await kv.lrem(POSTS_INDEX_KEY, 0, id);
  return true;
}
