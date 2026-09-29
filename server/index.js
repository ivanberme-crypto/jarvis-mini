import express from "express";
import fs from "node:fs";
import path from "node:path";

const { OPENAI_API_KEY, OPENAI_MODEL = "gpt-4o-mini", OBSIDIAN_VAULT } = process.env;

const INSTRUCCIONES =
  "Eres Jarvis, un asistente de voz. Responde siempre en español, con un máximo de tres frases cortas, sin listas ni formato, porque tu respuesta se va a leer en voz alta.";

const app = express();
app.use(express.json());

function guardarEnObsidian(pregunta, respuesta) {
  const carpeta = path.join(OBSIDIAN_VAULT, "Jarvis");
  fs.mkdirSync(carpeta, { recursive: true });

  const ahora = new Date();
  const dia = ahora.toLocaleDateString("sv-SE");
  const hora = ahora.toLocaleTimeString("es-ES");

  const nota = `## ${hora}\n\n**Yo:** ${pregunta}\n\n**Jarvis:** ${respuesta}\n\n`;
  fs.appendFileSync(path.join(carpeta, `${dia}.md`), nota);
}

app.post("/api/chat", async (req, res) => {
  const { mensajes } = req.body;

  if (!Array.isArray(mensajes) || mensajes.length === 0) {
    return res.status(400).json({ error: "No hay mensajes" });
  }

  try {
    const respuestaOpenAI = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [{ role: "system", content: INSTRUCCIONES }, ...mensajes],
      }),
    });

    const datos = await respuestaOpenAI.json();

    if (!respuestaOpenAI.ok) {
      return res.status(502).json({ error: datos.error?.message ?? "Error de OpenAI" });
    }

    const texto = datos.choices[0].message.content;

    try {
      guardarEnObsidian(mensajes[mensajes.length - 1].content, texto);
    } catch (error) {
      console.error("No se pudo guardar en Obsidian:", error.message);
    }

    res.json({ respuesta: texto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo contactar con OpenAI" });
  }
});

app.listen(3001, "127.0.0.1", () => {
  console.log("Servidor en http://localhost:3001");
});
