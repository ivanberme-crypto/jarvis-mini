# Jarvis mini

Asistente de voz sencillo: hablas o escribes, responde con la API de OpenAI y guarda cada conversación en una nota de Obsidian.

## Cómo funciona

1. El navegador convierte tu voz en texto (Web Speech API) o toma lo que escribes.
2. El servidor (`server/index.js`) manda la conversación a OpenAI.
3. La respuesta se muestra y se lee en voz alta.
4. El servidor añade la pregunta y la respuesta a `Jarvis/AAAA-MM-DD.md` dentro de tu vault de Obsidian.

## Formas de interactuar

- Voz: botón Hablar.
- Teclado: escribir y pulsar Enter.
- Ratón o táctil: botones Enviar y Hablar.

## Puesta en marcha

```
npm install
```

Copia `.env.example` como `.env` y rellénalo:

- `OPENAI_API_KEY`: tu clave de OpenAI.
- `OPENAI_MODEL`: el modelo a usar.
- `OBSIDIAN_VAULT`: ruta de la carpeta de tu vault.

Después:

```
npm start
```

Abre la dirección que muestra Vite en Chrome o Edge. El micrófono necesita `localhost`.

## Estructura

```
server/index.js   servidor: OpenAI y notas de Obsidian
src/App.tsx       pantalla y lógica del chat
src/voz.ts        reconocimiento y síntesis de voz
src/api.ts        llamada al servidor
```
