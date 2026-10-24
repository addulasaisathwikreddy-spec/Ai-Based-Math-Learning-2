import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { Check, Copy, RefreshCw, Volume2, VolumeX } from "lucide-react";
export default function ChatBubble({ message, onRetry, showRetry }) {
  const isUser = message.role === "user";
  const [imageUrl, setImageUrl] = useState(message.image_url || null);
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (!message.image_uri || imageUrl) return;
    let cancelled = false;
    base44.integrations.Core.CreateFileSignedUrl({ file_uri: message.image_uri })
      .then((res) => {
        if (!cancelled && res?.signed_url) setImageUrl(res.signed_url);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [message.image_uri, imageUrl]);

  const speak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const plain = message.content
      .replace(/[#*_`>-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const utterance = new SpeechSynthesisUtterance(plain);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const copyAnswer = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const time = message.created_date ? format(new Date(message.created_date), "h:mm a") : "";

  if (message.error) {
    return (
      <div className="flex flex-col items-start gap-1">
        <div className="max-w-[85%] rounded-2xl rounded-tl-md border border-destructive/40 bg-destructive/10 px-4 py-3">
          <p className="text-sm text-destructive">{message.content}</p>
          {showRetry && (
            <Button
              size="sm"
              variant="outline"
              className="mt-2 border-destructive/40 text-destructive hover:bg-destructive/10"
              onClick={onRetry}
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[85%] px-4 py-3 text-sm shadow-sm ${
          isUser
            ? "rounded-2xl rounded-br-md bg-primary text-primary-foreground"
            : "rounded-2xl rounded-tl-md border border-border bg-card text-foreground"
        }`}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Uploaded question"
            className="mb-2 max-h-44 w-full rounded-xl object-contain"
          />
        )}
        {isUser ? (
          message.content ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : null
        ) : (
          <div className="max-w-none space-y-2 [&_li]:mb-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 px-1 text-[10px] text-muted-foreground">
        <span>{time}</span>
        {!isUser && (
          <>
            <button
              onClick={copyAnswer}
              className="flex items-center gap-1 transition-colors hover:text-foreground"
              aria-label="Copy answer"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={speak}
              className="flex items-center gap-1 transition-colors hover:text-foreground"
              aria-label={speaking ? "Stop reading aloud" : "Read aloud"}
            >
              {speaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
              {speaking ? "Stop" : "Listen"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
