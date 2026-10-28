export default function Paginacao({ paginaAtual, totalPaginas, aoMudarPagina }) {
  if (totalPaginas <= 1) return null;

  return (
    <nav className="paginacao" aria-label="Paginação das atividades">
      <button type="button" onClick={() => aoMudarPagina(paginaAtual - 1)}
        disabled={paginaAtual === 1}>Anterior</button>
      {Array.from({ length: totalPaginas }, (_, indice) => (
        <button type="button" key={indice + 1}
          onClick={() => aoMudarPagina(indice + 1)}
          aria-current={paginaAtual === indice + 1 ? "page" : undefined}>
          {indice + 1}
        </button>
      ))}
      <button type="button" onClick={() => aoMudarPagina(paginaAtual + 1)}
        disabled={paginaAtual === totalPaginas}>Próxima</button>
    </nav>
  );
}
