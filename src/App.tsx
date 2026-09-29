import { useState } from "react";
import { preguntar, type Mensaje } from "./api";
import { escuchar, hablar, hayMicrofono } from "./voz";
import "./App.css";

export default function App() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [escuchando, setEscuchando] = useState(false);
  const [error, setError] = useState("");

  async function enviar(pregunta: string) {
    if (!pregunta.trim() || cargando) return;

    const nuevos: Mensaje[] = [...mensajes, { role: "user", content: pregunta }];
    setMensajes(nuevos);
    setTexto("");
    setError("");
    setCargando(true);

    try {
      const respuesta = await preguntar(nuevos);
      setMensajes([...nuevos, { role: "assistant", content: respuesta }]);
      hablar(respuesta);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Algo ha fallado");
    } finally {
      setCargando(false);
    }
  }

  function hablarConJarvis() {
    setError("");
    setEscuchando(true);
    escuchar(enviar, setError, () => setEscuchando(false));
  }

  return (
    <main>
      <h1>Jarvis</h1>

      <div className="chat">
        {mensajes.map((mensaje, i) => (
          <p key={i} className={mensaje.role}>
            {mensaje.content}
          </p>
        ))}
        {cargando && <p className="assistant">Pensando...</p>}
      </div>

      {error && <p className="error">{error}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          enviar(texto);
        }}
      >
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe o pulsa Hablar"
        />
        <button type="submit">Enviar</button>
        {hayMicrofono && (
          <button type="button" onClick={hablarConJarvis} disabled={escuchando}>
            {escuchando ? "Escuchando..." : "Hablar"}
          </button>
        )}
      </form>
    </main>
  );
}
