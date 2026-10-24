export function averageScore(attempts) {
  if (!attempts.length) return 0;
  const total = attempts.reduce((sum, a) => sum + (Number(a.score_percent) || 0), 0);
  return Math.round(total / attempts.length);
}

export function questionsSolved(attempts) {
  return attempts.reduce((sum, a) => sum + (Number(a.total_questions) || 0), 0);
}

export function topicStats(attempts) {
  const map = new Map();
  attempts.forEach((attempt) => {
    const key = attempt.topic || "General";
    const entry = map.get(key) || { topic: key, attempts: 0, scoreSum: 0, questions: 0, correct: 0 };
    entry.attempts += 1;
    entry.scoreSum += Number(attempt.score_percent) || 0;
    entry.questions += Number(attempt.total_questions) || 0;
    entry.correct += Number(attempt.correct_count) || 0;
    map.set(key, entry);
  });

  return [...map.values()]
    .map((entry) => ({
      topic: entry.topic,
      attempts: entry.attempts,
      questions: entry.questions,
      mastery: Math.round(entry.scoreSum / entry.attempts),
    }))
    .sort((a, b) => a.mastery - b.mastery);
}

export function weakTopics(attempts, limit = 3) {
  return topicStats(attempts)
    .filter((entry) => entry.mastery < 75)
    .slice(0, limit);
}

export function strengthLabel(mastery) {
  if (mastery >= 85) return "Strong";
  if (mastery >= 70) return "Getting there";
  if (mastery >= 50) return "Needs practice";
  return "Weak";
}

export function scoreTone(mastery) {
  if (mastery >= 70) return "emerald";
  if (mastery >= 50) return "amber";
  return "accent";
}

export function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDuration(seconds) {
  const total = Number(seconds) || 0;
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  if (mins <= 0) return `${secs}s`;
  return `${mins}m ${secs.toString().padStart(2, "0")}s`;
}
