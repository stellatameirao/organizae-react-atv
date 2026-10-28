import { useState } from "react";

export default function Acordeao({ perguntas }) {
  const [perguntaAberta, definirPerguntaAberta] = useState(null);

  function alternarPergunta(indice) {
    definirPerguntaAberta(perguntaAberta === indice ? null : indice);
  }

  return (
    <section className="cartao">
      <h2>Perguntas frequentes</h2>
      {perguntas.map((pergunta, indice) => (
        <div className="item-acordeao" key={indice}>
          <button type="button" aria-expanded={perguntaAberta === indice}
            aria-controls={`resposta-${indice}`}
            onClick={() => alternarPergunta(indice)}>
            {pergunta.titulo} <span>{perguntaAberta === indice ? "−" : "+"}</span>
          </button>
          <div id={`resposta-${indice}`} hidden={perguntaAberta !== indice}>
            <p>{pergunta.resposta}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
