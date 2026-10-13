"use client";

import { useState } from "react";
import { clearClientToken } from "@/app/lib/clientAuth";

export default function AdminLogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      clearClientToken();
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Error logging out:", err);
    } finally {
      window.location.href = "/admin/login?reason=logout";
    }
  };

  return (
    <form action="/api/auth/logout" method="POST" onSubmit={handleLogout}>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded-full bg-red-600/80 hover:bg-red-600 text-white font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer text-xs"
        title="Keluar dari akun admin"
      >
        <span>🚪</span>
        <span>{loading ? "Keluar..." : "Keluar (Logout)"}</span>
      </button>
    </form>
  );
}
