// server.js
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = 3000;

// Tu clave de Gemini aquí (¡nunca debe ir en script.js!)
const GEMINI_API_KEY = 'AIzaSyDWGZCuk6XIXug77X66RRufuqXgTMVwpVk';

app.use(express.static(path.join(__dirname))); // Sirve index.html, css y js
app.use(express.json());

app.post('/api/gemini', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(500).json({ error: data.error?.message || 'Error desconocido' });
        }

        const text = data.candidates[0]?.content?.parts[0]?.text;
        res.json({ tips: text });

    } catch (err) {
        console.error('Error llamando a Gemini:', err);
        res.status(500).json({ error: 'Error al conectarse con Gemini.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});
