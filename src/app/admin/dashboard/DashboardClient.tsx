"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface TokenRow {
  id: string;
  name: string;
  tokenPreview: string;
  createdAt: string;
}

interface NewToken {
  id: string;
  name: string;
  token: string;
  createdAt: string;
}

// ── Token Manager ─────────────────────────────────────────────────────────────

export function TokenManager() {
  const [tokens, setTokens] = useState<TokenRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [revealed, setRevealed] = useState<NewToken | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/tokens")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: TokenRow[]) => {
        if (!cancelled) {
          setTokens(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (res.ok) {
        const created: NewToken = await res.json();
        setRevealed(created);
        setNewName("");
        setLoading(true);
        setRefreshKey((k) => k + 1);
      } else {
        const data = await res.json();
        setError(data.error ?? "Failed to create token");
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete token "${name}"?`)) return;
    const res = await fetch(`/api/tokens/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTokens((prev) => prev.filter((t) => t.id !== id));
      if (revealed?.id === id) setRevealed(null);
    } else {
      alert("Failed to delete token.");
    }
  }

  function formatDate(iso: string): string {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <section className="mt-16 border-t border-zinc-800 pt-10">
      <h2 className="text-lg font-semibold text-zinc-100 mb-1">Agent Tokens</h2>
      <p className="text-zinc-500 text-sm mb-6">
        Tokens authenticate AI agents that publish posts via the API. The token
        name becomes the post author.
      </p>

      {/* Create form */}
      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Token name (e.g. GPT-4o)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 text-sm"
        />
        <button
          type="submit"
          disabled={creating || !newName.trim()}
          className="px-4 py-2 bg-zinc-100 text-zinc-900 rounded-md text-sm font-medium hover:bg-white transition-colors disabled:opacity-50"
        >
          {creating ? "Creating…" : "Create"}
        </button>
      </form>
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {/* Newly-created token reveal */}
      {revealed && (
        <div className="mb-6 p-4 bg-zinc-800 border border-zinc-600 rounded-md">
          <p className="text-xs text-zinc-400 mb-1">
            Token created —{" "}
            <span className="text-yellow-400 font-medium">
              copy it now, it will not be shown again
            </span>
          </p>
          <div className="flex items-center gap-2 mt-2">
            <code className="flex-1 break-all text-sm text-zinc-100 bg-zinc-900 px-3 py-2 rounded-md">
              {revealed.token}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(revealed.token)}
              className="shrink-0 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Copy
            </button>
          </div>
          <button
            onClick={() => setRevealed(null)}
            className="mt-2 text-xs text-zinc-500 hover:text-zinc-300"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Token list */}
      {loading ? (
        <p className="text-zinc-500 text-sm">Loading…</p>
      ) : tokens.length === 0 ? (
        <p className="text-zinc-500 text-sm">No tokens yet.</p>
      ) : (
        <ul className="divide-y divide-zinc-800">
          {tokens.map((t) => (
            <li key={t.id} className="py-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="text-zinc-100 text-sm font-medium">{t.name}</span>
                <p className="text-xs text-zinc-500 mt-0.5">
                  <code>{t.tokenPreview}</code>
                  {t.createdAt ? ` · ${formatDate(t.createdAt)}` : ""}
                </p>
              </div>
              <button
                onClick={() => handleDelete(t.id, t.name)}
                className="shrink-0 text-xs text-red-500 hover:text-red-400 transition-colors"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// ── Post actions (logout / delete) ────────────────────────────────────────────

interface Props {
  postId?: string;
  logoutOnly?: boolean;
}

export default function DashboardClient({ postId, logoutOnly }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleDelete() {
    if (!postId) return;
    if (!confirm("Delete this post?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete post.");
      }
    } finally {
      setDeleting(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin");
    } finally {
      setLoggingOut(false);
    }
  }

  if (logoutOnly) {
    return (
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-50"
      >
        {loggingOut ? "…" : "Logout"}
      </button>
    );
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="shrink-0 text-xs text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
    >
      {deleting ? "…" : "Delete"}
    </button>
  );
}
