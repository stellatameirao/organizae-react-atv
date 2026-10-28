import { useEffect, useRef, useState } from "react";

export default function MenuSuspenso({ opcoes, valorSelecionado, aoAlterar }) {
  const [aberto, definirAberto] = useState(false);
  const referenciaMenu = useRef(null);

  useEffect(() => {
    function fecharAoClicarFora(evento) {
      if (!referenciaMenu.current?.contains(evento.target)) definirAberto(false);
    }
    function fecharComEscape(evento) {
      if (evento.key === "Escape") definirAberto(false);
    }
    document.addEventListener("mousedown", fecharAoClicarFora);
    document.addEventListener("keydown", fecharComEscape);
    return () => {
      document.removeEventListener("mousedown", fecharAoClicarFora);
      document.removeEventListener("keydown", fecharComEscape);
    };
  }, []);

  const opcaoAtual = opcoes.find((opcao) => opcao.valor === valorSelecionado);

  function selecionarOpcao(valor) {
    aoAlterar(valor);
    definirAberto(false);
  }

  return (
    <div className="menu-suspenso" ref={referenciaMenu}>
      <button type="button" aria-expanded={aberto} aria-haspopup="true"
        onClick={() => definirAberto(!aberto)}>
        Filtrar: {opcaoAtual?.nome || "Todas"} ▾
      </button>
      {aberto && (
        <div className="opcoes-menu">
          {opcoes.map((opcao) => (
            <button type="button" key={opcao.valor}
              onClick={() => selecionarOpcao(opcao.valor)}>
              {opcao.nome}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
