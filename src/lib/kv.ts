import { kv } from "@vercel/kv";
import type { Post, AgentToken } from "./types";

const POSTS_INDEX_KEY = "posts:index";
const SLUG_INDEX_KEY = "posts:slugs";
const POST_KEY_PREFIX = "post:";

export async function getPostIds(): Promise<string[]> {
  // Sorted set indexed by creation timestamp; fetch all members
  const ids = await kv.zrange<string[]>(POSTS_INDEX_KEY, 0, -1);
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
  const id = await kv.hget<string>(SLUG_INDEX_KEY, slug);
  if (!id) return null;
  return getPost(id);
}

export async function savePost(post: Post): Promise<void> {
  const score = new Date(post.createdAt).getTime();
  await kv.set(`${POST_KEY_PREFIX}${post.id}`, post);
  // zadd handles uniqueness — re-adding the same id just updates its score
  await kv.zadd(POSTS_INDEX_KEY, { score, member: post.id });
  // Maintain slug → id mapping for O(1) slug lookups
  await kv.hset(SLUG_INDEX_KEY, { [post.slug]: post.id });
}

export async function updatePost(
  id: string,
  updates: Partial<Omit<Post, "id" | "createdAt">>
): Promise<Post | null> {
  const post = await getPost(id);
  if (!post) return null;
  const updated: Post = { ...post, ...updates };
  await kv.set(`${POST_KEY_PREFIX}${id}`, updated);
  // If slug changed, update the slug index
  if (updates.slug && updates.slug !== post.slug) {
    await kv.hdel(SLUG_INDEX_KEY, post.slug);
    await kv.hset(SLUG_INDEX_KEY, { [updated.slug]: id });
  }
  return updated;
}

export async function deletePost(id: string): Promise<boolean> {
  const post = await getPost(id);
  if (!post) return false;
  await kv.del(`${POST_KEY_PREFIX}${id}`);
  await kv.zrem(POSTS_INDEX_KEY, id);
  await kv.hdel(SLUG_INDEX_KEY, post.slug);
  return true;
}

// ── Agent token CRUD ──────────────────────────────────────────────────────────

const TOKENS_INDEX_KEY = "agent_tokens:index";
const TOKEN_KEY_PREFIX = "agent_token:";

export async function getTokenIds(): Promise<string[]> {
  const ids = await kv.zrange<string[]>(TOKENS_INDEX_KEY, 0, -1);
  return ids ?? [];
}

export async function getToken(id: string): Promise<AgentToken | null> {
  return kv.get<AgentToken>(`${TOKEN_KEY_PREFIX}${id}`);
}

export async function getAllTokens(): Promise<AgentToken[]> {
  const ids = await getTokenIds();
  if (ids.length === 0) return [];
  const tokens = await Promise.all(ids.map((id) => getToken(id)));
  return tokens.filter((t): t is AgentToken => t !== null);
}

export async function saveToken(token: AgentToken): Promise<void> {
  const score = new Date(token.createdAt).getTime();
  await kv.set(`${TOKEN_KEY_PREFIX}${token.id}`, token);
  await kv.zadd(TOKENS_INDEX_KEY, { score, member: token.id });
}

export async function deleteToken(id: string): Promise<boolean> {
  const token = await getToken(id);
  if (!token) return false;
  await kv.del(`${TOKEN_KEY_PREFIX}${id}`);
  await kv.zrem(TOKENS_INDEX_KEY, id);
  return true;
}

/** Verify a raw API token. Returns the token record on success, null otherwise. */
export async function findTokenByValue(
  rawToken: string
): Promise<AgentToken | null> {
  const tokens = await getAllTokens();
  return tokens.find((t) => t.token === rawToken) ?? null;
}
