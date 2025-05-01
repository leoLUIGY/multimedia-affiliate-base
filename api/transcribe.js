import pkg from 'youtube-dl-exec';
const { exec } = pkg;
import fs from 'fs';
import { OpenAI } from 'openai';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Only POST allowed');

  const { url } = req.body;
  if (!url) return res.status(400).send('URL is required');

  const output = `/tmp/audio.mp3`; // Vercel só permite gravar arquivos em /tmp

  try {
    await exec(url, {
      extractAudio: true,
      audioFormat: 'mp3',
      output,
    });

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(output),
      model: 'whisper-1',
      response_format: 'text',
    });

    res.status(200).json({ transcription });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao processar vídeo' });
  }
}
