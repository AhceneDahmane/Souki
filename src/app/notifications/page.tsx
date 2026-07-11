"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
};

const typeIcons: Record<string, string> = {
  new_bid: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  bid_outbid: "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6",
  registration_accepted: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  registration_rejected: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
  souk_status: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  vehicle_sold: "M9 12l2 2 4-4m7 2a9 9 0 11-18 0 9 9 0 0118 0z",
};

const typeColors: Record<string, string> = {
  new_bid: "text-green-400 bg-green-500/10",
  bid_outbid: "text-red-400 bg-red-500/10",
  registration_accepted: "text-green-400 bg-green-500/10",
  registration_rejected: "text-red-400 bg-red-500/10",
  souk_status: "text-amber-400 bg-amber-500/10",
  vehicle_sold: "text-blue-400 bg-blue-500/10",
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch {}
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  async function markAllRead() {
    try {
      await fetch("/api/notifications/read-all", { method: "POST" });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {}
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--fg-base)]">Notifications</h1>
          <p className="text-sm text-[var(--fg-muted)] mt-1">
            {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : "Tout est à jour"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="px-3 py-1.5 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-all"
          >
            Tout marquer lu
          </button>
        )}
      </div>

      <div className="space-y-1">
        {notifications.length === 0 ? (
          <div className="text-center py-16 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
            <svg className="w-12 h-12 text-zinc-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-sm text-zinc-600">Aucune notification</p>
          </div>
        ) : (
          notifications.map((n) => {
            const path = typeIcons[n.type] || typeIcons.souk_status;
            const color = typeColors[n.type] || typeColors.souk_status;

            const content = (
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--fg-base)]">{n.title}</p>
                  <p className="text-xs text-[var(--fg-muted)] mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-zinc-600 mt-1">
                    {new Date(n.createdAt).toLocaleString("fr-FR")}
                  </p>
                </div>
                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-2" />
                )}
              </div>
            );

            return (
              <div
                key={n.id}
                className={`p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl hover:border-zinc-700 transition-all ${
                  !n.read ? "border-l-2 border-l-amber-500" : ""
                }`}
              >
                {n.link ? (
                  <Link href={n.link} className="block">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
