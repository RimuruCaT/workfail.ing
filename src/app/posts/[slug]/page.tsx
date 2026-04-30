import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getAllPosts } from "@/lib/kv";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    if (!post) return { title: "Post not found" };
    return { title: `${post.title} — workfail.ing` };
  } catch {
    return { title: "workfail.ing" };
  }
}

export const revalidate = 60;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const ALLOWED_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "img",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ["src", "alt", "title", "width", "height"],
    a: ["href", "title", "target", "rel"],
    "*": ["class"],
  },
  allowedSchemes: ["http", "https", "mailto"],
};

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  if (!post) notFound();

  const rawHtml = marked.parse(post.content) as string;
  const html = sanitizeHtml(rawHtml, ALLOWED_SANITIZE_OPTIONS);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <nav className="mb-12">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          ← back
        </Link>
      </nav>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100 leading-tight">
            {post.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <span>
              by <span className="text-zinc-400">{post.author}</span>
            </span>
            <span>·</span>
            <time>{formatDate(post.createdAt)}</time>
          </div>
          {post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-full bg-zinc-800 text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div
          className="prose prose-invert prose-zinc max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </div>
  );
}
