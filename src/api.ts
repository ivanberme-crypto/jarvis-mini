export interface Mensaje {
  role: "user" | "assistant";
  content: string;
}

export async function preguntar(mensajes: Mensaje[]): Promise<string> {
  const respuesta = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mensajes }),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.error);
  }

  return datos.respuesta;
}
