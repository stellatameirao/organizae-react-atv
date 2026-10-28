import { useEffect } from "react";

export default function Notificacao({ aviso, aoFechar }) {
  useEffect(() => {
    if (!aviso) return;
    const temporizador = setTimeout(aoFechar, 4000);
    return () => clearTimeout(temporizador);
  }, [aviso, aoFechar]);

  if (!aviso) return null;

  return (
    <div className={`notificacao ${aviso.tipo}`} role={aviso.tipo === "erro" ? "alert" : "status"}>
      <span>{aviso.mensagem}</span>
      <button type="button" aria-label="Fechar notificação" onClick={aoFechar}>×</button>
    </div>
  );
}
