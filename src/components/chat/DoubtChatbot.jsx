import React, { useEffect, useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import useStudentProfile from "@/hooks/useStudentProfile";
import { Button } from "@/components/ui/button";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import { format } from "date-fns";
import { Eraser, History, Loader2, LogIn, MessageCircle, Plus, Trash2, X } from "lucide-react";

const WELCOME =
  "Hi! 👋 I'm your AI study buddy. Ask me any doubt, upload a question image, or send a voice note. I'm here to help 24/7!";
const SUGGESTIONS = ["Solve a maths problem", "Explain this concept", "Check my answer"];
const IMAGE_FALLBACK = "Please solve the question in this image.";

export default function DoubtChatbot() {
  const { isAuthenticated, navigateToLogin } = useAuth();
  const { profile } = useStudentProfile();
  const [open, setOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [sending, setSending] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const lastAttemptRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!open || !isAuthenticated) return;
    let cancelled = false;
    (async () => {
      setLoadingSessions(true);
      try {
        const page = await base44.entities.ChatSession.list({ sort: "-created_date", limit: 20 });
        if (!cancelled) setSessions(page.items);
      } catch {
        if (!cancelled) setSessions([]);
      }
      if (!cancelled) setLoadingSessions(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, isAuthenticated]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending, loadingMessages, open]);

  const openSession = async (session) => {
    setShowHistory(false);
    setActiveSessionId(session.id);
    setLoadingMessages(true);
    try {
      const page = await base44.entities.ChatMessage.filter(
        { session_id: session.id },
        { sort: "created_date", limit: 200 }
      );
      setMessages(page.items);
    } catch {
      setMessages([]);
    }
    setLoadingMessages(false);
  };

  const newChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setShowHistory(false);
  };

  const deleteSession = async (session) => {
    await base44.entities.ChatMessage.deleteMany({ session_id: session.id });
    await base44.entities.ChatSession.delete(session.id);
    setSessions((prev) => prev.filter((s) => s.id !== session.id));
    if (session.id === activeSessionId) newChat();
  };

  const clearConversation = async () => {
    if (!activeSessionId || !window.confirm("Delete this conversation and all its messages?")) return;
    await base44.entities.ChatMessage.deleteMany({ session_id: activeSessionId });
    await base44.entities.ChatSession.delete(activeSessionId);
    setSessions((prev) => prev.filter((s) => s.id !== activeSessionId));
    newChat();
  };

  const showError = (error) => {
    const detail =
      error?.response?.data?.error || error?.message || "Please check your connection and try again.";
    setMessages((prev) => [
      ...prev,
      {
        id: `error-${Date.now()}`,
        role: "assistant",
        error: true,
        content: `I couldn't answer that just now (${detail}). Tap retry to try again.`,
      },
    ]);
  };

  const runTutor = async (sessionId, payload) => {
    const response = await base44.functions.invoke("tutorChat", payload);
    const reply = typeof response.data?.reply === "string" ? response.data.reply.trim() : "";
    if (!reply) throw new Error("The tutor returned an empty answer.");
    const saved = await base44.entities.ChatMessage.create({
      session_id: sessionId,
      role: "assistant",
      content: reply,
    });
    setMessages((prev) => [...prev, saved]);
  };

  const handleSend = async ({ text, imageFile }) => {
    if (sending) return;
    const userText = (text || "").trim();
    if (!userText && !imageFile) return;
    setShowHistory(false);
    setSending(true);
    try {
      let sessionId = activeSessionId;
      if (!sessionId) {
        const session = await base44.entities.ChatSession.create({
          title: (userText || "Photo doubt").slice(0, 60),
        });
        sessionId = session.id;
        setActiveSessionId(sessionId);
        setSessions((prev) => [session, ...prev.filter((s) => s.id !== sessionId)]);
      }

      let imageUri = null;
      let imageUrl = null;
      if (imageFile) {
        const upload = await base44.integrations.Core.UploadPrivateFile({ file: imageFile });
        imageUri = upload.file_uri;
        const signed = await base44.integrations.Core.CreateFileSignedUrl({
          file_uri: imageUri,
          expires_in: 900,
        });
        imageUrl = signed.signed_url;
      }

      const saved = await base44.entities.ChatMessage.create({
        session_id: sessionId,
        role: "user",
        content: userText,
        image_uri: imageUri || undefined,
      });
      setMessages((prev) => [...prev, { ...saved, image_url: imageUrl }]);

      const history = [
        ...messages.filter((m) => !m.error),
        { role: "user", content: userText || IMAGE_FALLBACK },
      ].map((m) => ({
        role: m.role,
        content: m.content || (m.role === "user" && m.image_uri ? IMAGE_FALLBACK : m.content),
      }));
      const payload = {
        messages: history,
        class_level: profile?.class_level || undefined,
        image_urls: imageUrl ? [imageUrl] : [],
      };
      lastAttemptRef.current = { sessionId, payload };
      await runTutor(sessionId, payload);
    } catch (error) {
      showError(error);
    } finally {
      setSending(false);
    }
  };

  const handleRetry = async () => {
    const attempt = lastAttemptRef.current;
    if (!attempt || sending) return;
    setMessages((prev) => {
      const copy = [...prev];
      const lastErrorIndex = copy.map((m) => m.error).lastIndexOf(true);
      if (lastErrorIndex !== -1) copy.splice(lastErrorIndex, 1);
      return copy;
    });
    setSending(true);
    try {
      await runTutor(attempt.sessionId, attempt.payload);
    } catch (error) {
      showError(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-x-2 bottom-2 z-50 flex h-[min(75vh,640px)] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[400px]">
          <div className="flex items-center gap-2 border-b border-border bg-primary px-4 py-3 text-primary-foreground">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary-foreground/15 font-display text-lg">
              Σ
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-semibold leading-tight">Study Buddy</p>
              <p className="flex items-center gap-1 text-[11px] opacity-80">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online 24/7
              </p>
            </div>
            <button
              onClick={() => setShowHistory((v) => !v)}
              aria-label="Chat history"
              title="Chat history"
              className="rounded-lg p-1.5 transition-colors hover:bg-primary-foreground/15"
            >
              <History className="h-4 w-4" />
            </button>
            <button
              onClick={newChat}
              aria-label="New chat"
              title="New chat"
              className="rounded-lg p-1.5 transition-colors hover:bg-primary-foreground/15"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={clearConversation}
              disabled={!activeSessionId}
              aria-label="Clear conversation"
              title="Clear conversation"
              className="rounded-lg p-1.5 transition-colors hover:bg-primary-foreground/15 disabled:opacity-40"
            >
              <Eraser className="h-4 w-4" />
            </button>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              title="Close chat"
              className="rounded-lg p-1.5 transition-colors hover:bg-primary-foreground/15"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {showHistory && (
            <div className="max-h-48 overflow-y-auto border-b border-border bg-background/80 px-2 py-2">
              {loadingSessions ? (
                <div className="flex justify-center py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : sessions.length === 0 ? (
                <p className="px-2 py-1.5 text-xs text-muted-foreground">No previous conversations yet.</p>
              ) : (
                sessions.map((s) => (
                  <div key={s.id} className="flex items-center gap-1 rounded-lg px-2 py-1.5 hover:bg-muted">
                    <button onClick={() => openSession(s)} className="min-w-0 flex-1 text-left">
                      <p className="truncate text-xs font-medium">{s.title}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {format(new Date(s.created_date), "d MMM, h:mm a")}
                      </p>
                    </button>
                    <button
                      onClick={() => deleteSession(s)}
                      aria-label="Delete conversation"
                      title="Delete conversation"
                      className="text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-background/50 px-4 py-4">
            {!isAuthenticated ? (
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <p className="text-sm">
                  Log in to chat with your AI study buddy and keep your doubts saved safely.
                </p>
                <Button size="sm" className="mt-3" onClick={() => navigateToLogin(window.location.pathname)}>
                  <LogIn className="h-4 w-4" /> Log in
                </Button>
              </div>
            ) : loadingMessages ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="flex flex-col items-start gap-1">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-md border border-border bg-card px-4 py-3 text-sm text-foreground shadow-sm">
                    {WELCOME}
                  </div>
                </div>
                {messages.length === 0 && !sending && (
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSuggestion(s)}
                        className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:border-accent hover:text-accent"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                {messages.map((m, i) => (
                  <ChatBubble
                    key={m.id || `msg-${i}`}
                    message={m}
                    showRetry={m.error && i === messages.length - 1}
                    onRetry={handleRetry}
                  />
                ))}
                {sending && (
                  <div className="flex w-fit items-center gap-2 rounded-2xl rounded-tl-md border border-border bg-card px-4 py-3 shadow-sm">
                    <span className="flex gap-1">
                      {[0, 1, 2].map((d) => (
                        <span
                          key={d}
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
                          style={{ animationDelay: `${d * 0.15}s` }}
                        />
                      ))}
                    </span>
                    <span className="text-xs text-muted-foreground">Thinking…</span>
                  </div>
                )}
              </>
            )}
          </div>

          <ChatInput
            busy={sending || loadingMessages}
            disabled={!isAuthenticated}
            prefill={suggestion}
            onPrefillDone={() => setSuggestion(null)}
            onSend={handleSend}
          />
        </div>
      )}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open study buddy chat"
          title="Ask your study buddy"
          className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </>
  );
}
