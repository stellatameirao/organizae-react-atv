export default function BarraDeProgresso({ valor, descricao = "Progresso" }) {
  const porcentagem = Math.max(0, Math.min(100, Number(valor) || 0));
  return (
    <div className="bloco-progresso">
      <div className="rotulo-progresso">
        <span>{descricao}</span><strong>{porcentagem}%</strong>
      </div>
      <div className="trilha-progresso" role="progressbar"
        aria-label={descricao} aria-valuenow={porcentagem}
        aria-valuemin="0" aria-valuemax="100">
        <div className="preenchimento-progresso" style={{ width: `${porcentagem}%` }} />
      </div>
    </div>
  );
}
