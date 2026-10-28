import { useRef, useState } from "react";

export default function Abas({ itens }) {
  const [abaAtiva, definirAbaAtiva] = useState(0);
  const botoes = useRef([]);

  function mudarPeloTeclado(evento, indice) {
    let proxima;

    if (evento.key === "ArrowRight") {
      proxima = (indice + 1) % itens.length;
    } else if (evento.key === "ArrowLeft") {
      proxima = (indice - 1 + itens.length) % itens.length;
    } else if (evento.key === "Home") {
      proxima = 0;
    } else if (evento.key === "End") {
      proxima = itens.length - 1;
    } else {
      return;
    }

    evento.preventDefault();
    definirAbaAtiva(proxima);
    botoes.current[proxima]?.focus();
  }

  return (
    <div>
      <div className="abas" role="tablist" aria-label="Seções do painel">
        {itens.map((item, indice) => (
          <button
            key={item.nome}
            ref={(elemento) => {
              botoes.current[indice] = elemento;
            }}
            type="button"
            role="tab"
            id={`aba-${indice}`}
            aria-controls={`painel-${indice}`}
            aria-selected={abaAtiva === indice}
            tabIndex={abaAtiva === indice ? 0 : -1}
            onKeyDown={(evento) => mudarPeloTeclado(evento, indice)}
            onClick={() => definirAbaAtiva(indice)}
          >
            {item.nome}
          </button>
        ))}
      </div>

      {itens.map((item, indice) => (
        <div
          key={item.nome}
          role="tabpanel"
          id={`painel-${indice}`}
          aria-labelledby={`aba-${indice}`}
          hidden={abaAtiva !== indice}
          tabIndex={0}
        >
          {abaAtiva === indice && item.conteudo}
        </div>
      ))}
    </div>
  );
}