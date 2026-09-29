const ventana = window as unknown as {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
};

const Reconocimiento = ventana.SpeechRecognition ?? ventana.webkitSpeechRecognition;

export const hayMicrofono = Boolean(Reconocimiento);

export function escuchar(
  alRecibirTexto: (texto: string) => void,
  alFallar: (mensaje: string) => void,
  alAcabar: () => void,
) {
  const reconocimiento = new Reconocimiento();
  reconocimiento.lang = "es-ES";

  reconocimiento.onresult = (evento: any) => {
    alRecibirTexto(evento.results[0][0].transcript);
  };

  reconocimiento.onerror = () => {
    alFallar("No te he podido escuchar, prueba otra vez");
  };

  reconocimiento.onend = alAcabar;

  reconocimiento.start();
}

export function hablar(texto: string) {
  window.speechSynthesis.cancel();
  const voz = new SpeechSynthesisUtterance(texto);
  voz.lang = "es-ES";
  window.speechSynthesis.speak(voz);
}
