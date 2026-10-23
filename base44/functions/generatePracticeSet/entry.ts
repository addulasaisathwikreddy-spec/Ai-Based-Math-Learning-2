import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const MAX_COUNT = 10;

function isValidQuestion(q) {
  return (
    q &&
    typeof q.prompt === 'string' &&
    q.prompt.trim().length > 4 &&
    Array.isArray(q.options) &&
    q.options.length === 4 &&
    q.options.every((o) => typeof o === 'string' && o.trim().length > 0) &&
    Number.isInteger(q.correct_index) &&
    q.correct_index >= 0 &&
    q.correct_index <= 3 &&
    typeof q.explanation === 'string'
  );
}

function normalize(q) {
  return {
    prompt: q.prompt.trim().slice(0, 600),
    options: q.options.map((o) => String(o).trim().slice(0, 220)),
    correct_index: q.correct_index,
    explanation: String(q.explanation || '').trim().slice(0, 600),
  };
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function fromBank(base44, classLevel, topic, count) {
  const { items: onTopic } = await base44.entities.Question.filter(
    { class_level: classLevel, topic },
    { limit: 50 }
  );
  let picked = shuffle(onTopic);

  if (picked.length < count) {
    const { items: sameClass } = await base44.entities.Question.filter(
      { class_level: classLevel },
      { limit: 50 }
    );
    const extra = sameClass.filter((q) => q.topic !== topic);
    picked = [...picked, ...shuffle(extra)];
  }

  return picked.slice(0, count).map((q) => ({
    prompt: q.prompt,
    options: q.options,
    correct_index: q.correct_index,
    explanation: q.explanation,
  }));
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const topic = typeof body.topic === 'string' ? body.topic.trim().slice(0, 80) : '';
    const classLevel = String(body.class_level || '').trim();
    const board = typeof body.board === 'string' ? body.board.slice(0, 40) : 'CBSE';
    const requested = Number(body.count);
    const count = Number.isFinite(requested) ? Math.min(Math.max(Math.round(requested), 3), MAX_COUNT) : 5;

    if (!topic || !/^(6|7|8|9|10|11|12)$/.test(classLevel)) {
      return Response.json({ error: 'A class (6-12) and a topic are required' }, { status: 400 });
    }

    try {
      const prompt = [
        `You are a senior mathematics teacher in India preparing practice material for a Class ${classLevel} student following the ${board} syllabus.`,
        `Topic: ${topic}`,
        `Write exactly ${count} multiple-choice questions that test understanding of this topic, not just recall.`,
        'Rules:',
        '- Exactly 4 options per question, exactly one of them correct.',
        '- Mix difficulties: roughly 40% easy, 40% medium, 20% hard.',
        '- Clear, simple English. Use familiar Indian contexts (rupees, cricket, distances, local names) where natural.',
        '- "explanation" is 1-2 short sentences that show the key step.',
        '- Do not number the questions and do not prefix them with "Question 1".',
        '- Every question must be solvable without a calculator.',
        'Respond with JSON only.',
      ].join('\n');

      const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  prompt: { type: 'string' },
                  options: { type: 'array', items: { type: 'string' } },
                  correct_index: { type: 'integer' },
                  explanation: { type: 'string' },
                },
                required: ['prompt', 'options', 'correct_index', 'explanation'],
              },
            },
          },
          required: ['questions'],
        },
      });

      const raw = Array.isArray(result?.questions) ? result.questions : [];
      const valid = raw.filter(isValidQuestion).map(normalize).slice(0, count);

      if (valid.length >= 3) {
        return Response.json({ questions: valid, demo: false });
      }
    } catch (aiError) {
      console.log('AI generation unavailable, using question bank:', aiError?.message);
    }

    const bank = await fromBank(base44, classLevel, topic, count);
    return Response.json({ questions: bank, demo: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
