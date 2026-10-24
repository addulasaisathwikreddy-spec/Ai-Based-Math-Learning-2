import React, { useEffect, useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Loader2, Mic, Send, Square, Trash2, X } from "lucide-react";

const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_IMAGE_MB = 8;
const MAX_AUDIO_MB = 25;

export default function ChatInput({ busy, disabled, prefill, onPrefillDone, onSend }) {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recorded, setRecorded] = useState(null);
  const [transcribing, setTranscribing] = useState(false);
  const [notice, setNotice] = useState(null);

  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (prefill) {
      setText(prefill);
      setNotice(null);
      if (onPrefillDone) onPrefillDone();
    }
  }, [prefill]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const busyInput = busy || transcribing;

  const handleAttach = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) {
      setNotice("Please choose a JPG, PNG or WEBP image of your question.");
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setNotice(`Images must be under ${MAX_IMAGE_MB} MB.`);
      return;
    }
    setNotice(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  };

  const stopRecorder = (keep) =>
    new Promise((resolve) => {
      const recorder = recorderRef.current;
      if (!recorder) {
        resolve(null);
        return;
      }
      recorderRef.current = null;
      recorder.onstop = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        resolve(
          keep && chunksRef.current.length
            ? new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" })
            : null
        );
      };
      recorder.stop();
    });

  const startRecording = async () => {
    setNotice(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setNotice("Voice recording is not supported in this browser — please type your doubt instead.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
      setRecordSeconds(0);
      timerRef.current = setInterval(() => setRecordSeconds((s) => s + 1), 1000);
    } catch {
      setNotice("Microphone access was blocked. Allow the microphone, or type your doubt instead.");
    }
  };

  const finishRecording = async (keep) => {
    clearInterval(timerRef.current);
    setRecording(false);
    const blob = await stopRecorder(keep);
    if (!keep || !blob) return;
    if (blob.size > MAX_AUDIO_MB * 1024 * 1024) {
      setNotice("That recording is too long — please keep voice notes under 25 MB.");
      return;
    }
    setRecorded({ blob, url: URL.createObjectURL(blob) });
  };

  const sendRecording = async () => {
    if (!recorded) return;
    setTranscribing(true);
    setNotice(null);
    try {
      const file = new File([recorded.blob], "voice-note.webm", {
        type: recorded.blob.type || "audio/webm",
      });
      const upload = await base44.integrations.Core.UploadPrivateFile({ file });
      const signed = await base44.integrations.Core.CreateFileSignedUrl({
        file_uri: upload.file_uri,
        expires_in: 600,
      });
      const response = await base44.functions.invoke("transcribeVoice", {
        audio_url: signed.signed_url,
      });
      const transcript = response.data?.text || "";
      if (!transcript) {
        setNotice("I couldn't hear any speech in that recording — try again a bit closer to the mic.");
        return;
      }
      setText(transcript);
    } catch {
      setNotice("Voice transcription failed. You can type your doubt instead.");
    } finally {
      URL.revokeObjectURL(recorded.url);
      setRecorded(null);
      setTranscribing(false);
    }
  };

  const discardRecording = () => {
    URL.revokeObjectURL(recorded.url);
    setRecorded(null);
  };

  const submit = () => {
    if (busyInput || (!text.trim() && !imageFile)) return;
    onSend({ text: text.trim(), imageFile });
    setText("");
    removeImage();
  };

  return (
    <div className="border-t border-border bg-card px-3 py-3">
      {notice && (
        <p className="mb-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{notice}</p>
      )}

      {imagePreview && (
        <div className="mb-2 flex items-center gap-2 rounded-xl border border-border bg-background p-2">
          <img src={imagePreview} alt="Question preview" className="h-12 w-12 rounded-lg object-cover" />
          <p className="flex-1 truncate text-xs text-muted-foreground">{imageFile?.name || "Question image"}</p>
          <button
            onClick={removeImage}
            aria-label="Remove image"
            className="text-muted-foreground transition-colors hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {recording ? (
        <div className="flex items-center gap-3 rounded-full border border-destructive/40 bg-destructive/10 px-4 py-2">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-destructive" />
          </span>
          <span className="text-sm font-medium text-destructive">
            Recording {Math.floor(recordSeconds / 60)}:{String(recordSeconds % 60).padStart(2, "0")}
          </span>
          <div className="ml-auto flex gap-1">
            <Button size="icon" variant="ghost" onClick={() => finishRecording(false)} aria-label="Cancel recording">
              <X className="h-4 w-4" />
            </Button>
            <Button size="icon" onClick={() => finishRecording(true)} aria-label="Stop recording">
              <Square className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : recorded ? (
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-background p-2">
          <audio controls src={recorded.url} className="h-8 min-w-0 flex-1" />
          <Button size="icon" variant="ghost" onClick={discardRecording} aria-label="Discard recording">
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={sendRecording} disabled={busyInput}>
            Use recording
          </Button>
        </div>
      ) : (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder={disabled ? "Log in to ask your doubt…" : "Ask any doubt… e.g. Why is a² + b² = c²?"}
            rows={1}
            disabled={disabled || busy}
            className="max-h-28 min-h-[42px] w-full flex-1 resize-none rounded-2xl border border-input bg-background px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-60"
          />
          <div className="mt-2 flex items-center gap-1">
            <input
              ref={fileInputRef}
              type="file"
              accept={IMAGE_TYPES.join(",")}
              className="hidden"
              onChange={handleAttach}
            />
            <Button
              size="icon"
              variant="ghost"
              disabled={busyInput || disabled}
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach question image"
              title="Attach question image"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              disabled={busyInput || disabled}
              onClick={startRecording}
              aria-label="Record voice note"
              title="Record voice note"
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              className="ml-auto rounded-full"
              onClick={submit}
              disabled={busyInput || disabled || (!text.trim() && !imageFile)}
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send
            </Button>
          </div>
        </>
      )}

      {transcribing && (
        <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" /> Transcribing your voice note…
        </p>
      )}
    </div>
  );
}
