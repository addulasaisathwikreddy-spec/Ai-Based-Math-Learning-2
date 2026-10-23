import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  BOARDS,
  CLASS_LEVELS,
  GOALS,
  LANGUAGES,
  STATES,
  STREAMS,
  STUDY_TIMES,
  needsStream,
  topicsFor,
} from "@/lib/syllabus";

function SelectField({ label, value, onChange, placeholder, options, hint }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => {
            const item = typeof option === "string" ? { value: option, label: option } : option;
            return (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function ProfileForm({ profile, onSaved }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    full_name: profile?.full_name || user?.full_name || "",
    class_level: profile?.class_level || "",
    board: profile?.board || "",
    state: profile?.state || "",
    school: profile?.school || "",
    language: profile?.language || "English",
    goal: profile?.goal || "",
    stream: profile?.stream || "",
    daily_study_minutes: profile?.daily_study_minutes ? String(profile.daily_study_minutes) : "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.full_name.trim()) return setError("Please add your full name.");
    if (!form.class_level) return setError("Please choose your class.");
    if (!form.board) return setError("Please choose your board.");
    if (!form.state) return setError("Please choose your state.");
    if (!form.goal) return setError("Please choose your learning goal.");
    if (needsStream(form.class_level) && !form.stream) return setError("Please choose your stream.");

    const payload = {
      full_name: form.full_name.trim(),
      class_level: form.class_level,
      board: form.board,
      state: form.state,
      school: form.school.trim(),
      language: form.language,
      goal: form.goal,
      daily_study_minutes: form.daily_study_minutes ? Number(form.daily_study_minutes) : 0,
    };
    if (needsStream(form.class_level)) payload.stream = form.stream;

    setSaving(true);
    try {
      if (profile?.id) {
        await base44.entities.StudentProfile.update(profile.id, payload);
      } else {
        await base44.entities.StudentProfile.create(payload);
      }
      onSaved();
    } catch (err) {
      setError(err.message || "We could not save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const chapters = form.class_level ? topicsFor(form.class_level).length : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input
          id="full_name"
          value={form.full_name}
          onChange={(e) => set("full_name", e.target.value)}
          placeholder="Ananya Reddy"
          className="h-11"
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Class"
          value={form.class_level}
          onChange={(v) => set("class_level", v)}
          placeholder="Select class"
          options={CLASS_LEVELS.map((level) => ({ value: level, label: `Class ${level}` }))}
          hint={chapters ? `${chapters} chapters unlocked for practice` : undefined}
        />
        <SelectField
          label="Board"
          value={form.board}
          onChange={(v) => set("board", v)}
          placeholder="Select board"
          options={BOARDS}
        />
        <SelectField
          label="State"
          value={form.state}
          onChange={(v) => set("state", v)}
          placeholder="Select state"
          options={STATES}
        />
        <SelectField
          label="Preferred language"
          value={form.language}
          onChange={(v) => set("language", v)}
          placeholder="Select language"
          options={LANGUAGES}
          hint="Explanations will follow this language."
        />
        <div className="space-y-2">
          <Label htmlFor="school">
            School name <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="school"
            value={form.school}
            onChange={(e) => set("school", e.target.value)}
            placeholder="e.g. Narayana High School"
            className="h-11"
          />
        </div>
        <SelectField
          label="Learning goal"
          value={form.goal}
          onChange={(v) => set("goal", v)}
          placeholder="What are you working towards?"
          options={GOALS}
        />
        {needsStream(form.class_level) && (
          <SelectField
            label="Stream"
            value={form.stream}
            onChange={(v) => set("stream", v)}
            placeholder="Select stream"
            options={STREAMS}
            hint="Shown for Classes 11 and 12."
          />
        )}
        <SelectField
          label="Daily study time (optional)"
          value={form.daily_study_minutes}
          onChange={(v) => set("daily_study_minutes", v)}
          placeholder="How long can you study?"
          options={STUDY_TIMES.map((time) => ({ value: String(time.value), label: time.label }))}
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          You can change any of this later from your profile.
        </p>
        <Button type="submit" size="lg" className="h-11 rounded-full px-7" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : profile ? (
            "Save changes"
          ) : (
            "Continue to dashboard"
          )}
        </Button>
      </div>
    </form>
  );
}
