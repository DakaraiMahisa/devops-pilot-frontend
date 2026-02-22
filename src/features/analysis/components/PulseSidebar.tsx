import { useState, useEffect } from "react";
import {
  LightningIcon,
  TerminalIcon,
  UserIcon,
  CheckCircleIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { type PulseEvent } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");

export function PulseSidebar() {
  const [events, setEvents] = useState<PulseEvent[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE}/api/sse/stream`);

    eventSource.addEventListener("notification", (e) => {
      try {
        const newEvent: PulseEvent = JSON.parse(e.data);
        // Keep only the last 10 events, newest on top
        setEvents((prev) => [newEvent, ...prev].slice(0, 10));
      } catch (err) {
        console.error("Failed to parse SSE event", err);
      }
    });

    return () => eventSource.close();
  }, []);

  return (
    <div className="w-80 border-l border-zinc-800/50 bg-zinc-950/20 p-6 flex flex-col gap-6">
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
          Live Pulse
        </h3>
        <p className="text-[9px] text-zinc-600 font-mono italic">
          Real-time System Events
        </p>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
        {events.length === 0 && (
          <p className="text-[10px] text-zinc-700 italic">
            Waiting for system events...
          </p>
        )}

        {events.map((event, idx) => (
          <div key={idx} className="flex gap-3 group">
            <div className="mt-1">{getIcon(event.type)}</div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-zinc-300 leading-tight">
                {event.message}
              </span>
              <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-tighter">
                {event.detail}
              </span>
              <span className="text-[8px] text-zinc-700 font-black">
                {new Date(event.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper to map event types to Icons
function getIcon(type: string) {
  switch (type) {
    case "SYSTEM":
      return (
        <LightningIcon size={14} weight="fill" className="text-amber-500" />
      );
    case "EXECUTION":
      return <TerminalIcon size={14} className="text-indigo-400" />;
    case "USER":
      return <UserIcon size={14} className="text-sky-400" />;
    case "SUCCESS":
      return (
        <CheckCircleIcon size={14} weight="fill" className="text-emerald-500" />
      );
    case "FAILURE":
      return (
        <WarningCircleIcon size={14} weight="fill" className="text-rose-500" />
      );
    default:
      return <div className="h-2 w-2 rounded-full bg-zinc-700 mt-1" />;
  }
}
