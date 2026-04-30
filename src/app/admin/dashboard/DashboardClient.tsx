"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
