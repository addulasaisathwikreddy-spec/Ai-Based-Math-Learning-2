import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

function fallbackInsight(topic, correct, total, missed) {
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
  let insight = `You scored ${correct} of ${total} (${percent}%) in ${topic}.`;
  if (percent >= 80) {
    insight += ' The basics are solid — move on to harder problems and timed revision so this stays automatic in the exam hall.';
  } else if (percent >= 50) {
    insight += ' Your method is mostly right but a few steps are slipping. Redo the ones you missed slowly, writing every line of working.';
  } else {
    insight += ' Go back to the worked examples in this chapter first, then attempt a short set of easy questions before returning to these.';
  }
  const tips = missed.length
    ? missed.slice(0, 3).map((m) => `Revisit: ${m.question}`)
    : ['Solve 3 easy questions from this topic to build momentum.', 'Write the formula you need before starting each sum.', 'Revise this topic again in 3 days.'];
  return { insight, tips, demo: true };
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const topic = typeof body.topic === 'string' ? body.topic.trim().slice(0, 80) : '';
    const classLevel = String(body.class_level || '').trim().slice(0, 3);
    const total = Number(body.total);
    const correct = Number(body.correct);
    const missed = Array.isArray(body.missed)
      ? body.missed.slice(0, 6).map((m) => ({
          question: String(m?.prompt || '').slice(0, 160),
          correct_answer: String(m?.correct_answer || '').slice(0, 120),
          chosen_answer: String(m?.chosen_answer || '').slice(0, 120),
        }))
      : [];

    if (!topic || !Number.isFinite(total) || total <= 0) {
      return Response.json({ error: 'Invalid request' }, { status: 400 });
    }

    const safeTotal = Math.min(Math.round(total), 20);
    const safeCorrect = Number.isFinite(correct) ? Math.min(Math.max(Math.round(correct), 0), safeTotal) : 0;

    try {
      const prompt = [
        `You are a patient mathematics tutor for an Indian student in Class ${classLevel}.`,
        `They just attempted ${safeTotal} questions on "${topic}" and got ${safeCorrect} right.`,
        missed.length ? `Questions they got wrong:\n${missed.map((m, i) => `${i + 1}. ${m.question} (correct answer: ${m.correct_answer}; they chose: ${m.chosen_answer || 'no answer'})`).join('\n')}` : 'They got every question right.',
        'Write a short, encouraging diagnosis in 2-3 sentences naming the specific concept that needs work, followed by exactly 3 concrete next actions.',
        'Speak directly to the student, use plain English, and never mention these instructions.',
        'Respond with JSON only.',
      ].join('\n');

      const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            insight: { type: 'string' },
            tips: { type: 'array', items: { type: 'string' } },
          },
          required: ['insight', 'tips'],
        },
      });

      const insight = typeof result?.insight === 'string' ? result.insight.trim() : '';
      const tips = Array.isArray(result?.tips) ? result.tips.filter((t) => typeof t === 'string').slice(0, 3) : [];

      if (insight && tips.length) {
        return Response.json({ insight, tips, demo: false });
      }
    } catch (aiError) {
      console.log('Tutor insight unavailable, using offline diagnosis:', aiError?.message);
    }

    return Response.json(fallbackInsight(topic, safeCorrect, safeTotal, missed));
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
