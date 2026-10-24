import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import useStudentProfile from "@/hooks/useStudentProfile";
import TopicPicker from "@/components/practice/TopicPicker";
import QuizRunner from "@/components/practice/QuizRunner";
import QuizResult from "@/components/practice/QuizResult";
import { topicsFor } from "@/lib/syllabus";
import { Loader2 } from "lucide-react";

export default function Practice() {
  const navigate = useNavigate();
  const { profile, loading } = useStudentProfile();
  const [stage, setStage] = useState("setup");
  const [topic, setTopic] = useState(() => new URLSearchParams(window.location.search).get("topic") || "");
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [demo, setDemo] = useState(false);
  const [attempt, setAttempt] = useState(null);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!profile) navigate("/onboarding", { replace: true });
  }, [loading, profile, navigate]);

  if (loading || !profile) {
    return (
      <div className="flex items-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading your syllabus…
      </div>
    );
  }

  const topics = topicsFor(profile.class_level);

  const handleStart = async () => {
    setError("");
    setGenerating(true);
    try {
      const response = await base44.functions.invoke("generatePracticeSet", {
        class_level: profile.class_level,
        board: profile.board,
        topic,
        count,
      });
      const data = response.data || {};
      if (!data.questions?.length) {
        throw new Error(data.error || "We could not build a set for this chapter yet.");
      }
      setQuestions(data.questions);
      setDemo(!!data.demo);
      setStage("quiz");
    } catch (err) {
      setError(err.message || "Something went wrong while building your questions.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (answers, seconds) => {
    setSaving(true);
    const correct = answers.reduce(
      (total, answer, index) => total + (answer === questions[index].correct_index ? 1 : 0),
      0
    );
    const percent = Math.round((correct / questions.length) * 100);
    const record = {
      class_level: profile.class_level,
      topic,
      total_questions: questions.length,
      correct_count: correct,
      score_percent: percent,
      duration_seconds: seconds,
      demo_mode: demo,
      questions: questions.map((q, index) => ({
        prompt: q.prompt,
        options: q.options,
        correct_index: q.correct_index,
        selected_index: answers[index] === null ? -1 : answers[index],
        explanation: q.explanation,
      })),
    };

    try {
      const saved = await base44.entities.TestAttempt.create(record);
      setAttempt({ ...record, id: saved.id });
      setStage("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message || "We could not save this attempt.");
    } finally {
      setSaving(false);
    }
  };

  const handleRestart = () => {
    setQuestions([]);
    setAttempt(null);
    setStage("setup");
    setError("");
  };

  if (stage === "quiz") {
    return (
      <>
        {demo && (
          <p className="mb-4 inline-flex rounded-full bg-secondary px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            Demo set · offline question bank
          </p>
        )}
        <QuizRunner
          questions={questions}
          topic={topic}
          onSubmit={handleSubmit}
          saving={saving}
        />
      </>
    );
  }

  if (stage === "result" && attempt) {
    return <QuizResult attempt={attempt} onRestart={handleRestart} />;
  }

  return (
    <TopicPicker
      topics={topics}
      topic={topic}
      onTopic={setTopic}
      count={count}
      onCount={setCount}
      onStart={handleStart}
      loading={generating}
      error={error}
    />
  );
}
