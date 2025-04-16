require('dotenv').config({ path: '../.env' });


const express = require('express');
const { exec } = require('youtube-dl-exec');
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

const app = express();
const port = 3000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));


app.post('/transcribe', async (req, res) =>{
    const { url } = req.body;
    if(!url) return res.status(400).send('URL is required.');

    const outputFile = `audio-${Date.now()}.mp3`;

    try{
        await exec(url, {
            extractAudio: true,
            audioFormat: 'mp3',
            output: outputFile,
        });

        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(path.join(__dirname, outputFile)),
            model: 'whisper-1',
            response_format: 'text',
        });

        fs.unlinkSync(outputFile);

        res.send({ transcription });
    }catch(error)
    {
        console.error('Error: ', error);
        res.status(500).send('Erro ao trascrever o video');
    }
});


app.listen(port, () =>{
    console.log(`Servidor rodando em http://localhost:${port}`);
});