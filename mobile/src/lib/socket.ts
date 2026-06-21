import { io, Socket } from "socket.io-client";
import { API_URL } from "./api";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(API_URL, { transports: ["websocket"], autoConnect: true });
  }
  return socket;
}

/** Join a guild room and run `onUpdate` whenever something changes. Returns a cleanup fn. */
export function subscribeToGuild(
  guildId: string,
  handlers: {
    onGuildUpdate?: (guild: unknown) => void;
    onChapterNew?: (chapter: unknown) => void;
    onChoiceUpdate?: (status: { chapter_id: string; total: number; submitted: string[] }) => void;
  }
): () => void {
  const s = getSocket();
  const join = () => s.emit("guild:join", guildId);
  join();
  s.on("connect", join);

  if (handlers.onGuildUpdate) s.on("guild:update", handlers.onGuildUpdate);
  if (handlers.onChapterNew) s.on("chapter:new", handlers.onChapterNew);
  if (handlers.onChoiceUpdate) s.on("choice:update", handlers.onChoiceUpdate);

  return () => {
    s.emit("guild:leave", guildId);
    s.off("connect", join);
    if (handlers.onGuildUpdate) s.off("guild:update", handlers.onGuildUpdate);
    if (handlers.onChapterNew) s.off("chapter:new", handlers.onChapterNew);
    if (handlers.onChoiceUpdate) s.off("choice:update", handlers.onChoiceUpdate);
  };
}
