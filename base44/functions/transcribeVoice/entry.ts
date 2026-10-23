import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const audioUrl = typeof body.audio_url === 'string' ? body.audio_url.trim() : '';
    if (!audioUrl.startsWith('https://') || audioUrl.length > 2048) {
      return Response.json({ error: 'Invalid request' }, { status: 400 });
    }

    const text = await base44.asServiceRole.integrations.Core.TranscribeAudio({
      audio_url: audioUrl,
    });
    const clean = typeof text === 'string' ? text.trim() : '';
    if (!clean) {
      return Response.json(
        { error: 'Could not hear any speech in that recording. Try again a bit louder.' },
        { status: 422 }
      );
    }
    return Response.json({ text: clean.slice(0, 4000) });
  } catch (error) {
    console.log('transcribeVoice error:', error?.message);
    return Response.json(
      { error: 'Voice transcription failed. Please type your doubt instead.' },
      { status: 500 }
    );
  }
}
