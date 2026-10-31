import { useEffect, useRef, useState } from "react";
import Acordeao from "./componentes/Acordeao.jsx";
import MenuSuspenso from "./componentes/MenuSuspenso.jsx";
import Paginacao from "./componentes/Paginacao.jsx";
import BarraDeProgresso from "./componentes/BarraDeProgresso.jsx";
import Abas from "./componentes/Abas.jsx";
import Notificacao from "./componentes/Notificacao.jsx";
import { ProvedorEstudos } from "./contexto/ContextoEstudos.jsx";
import useEstudos from "./contexto/useEstudos.js";

const perguntas = [
  {
    titulo: "Como marcar uma atividade como concluída?",
    resposta: "Marque a caixa ao lado da atividade."
  },
  {
    titulo: "Como filtrar minhas atividades?",
    resposta: "Use o menu para escolher Todas, Pendentes ou Concluídas."
  },
  {
    titulo: "Como adicionar uma atividade?",
    resposta: "Digite o nome, selecione a disciplina e clique em Adicionar."
  },
  {
    titulo: "O que acontece quando concluo uma atividade?",
    resposta: "Os indicadores e a barra de progresso são atualizados."
  }
];

const opcoesFiltro = [
  { nome: "Todas", valor: "todas" },
  { nome: "Pendentes", valor: "pendentes" },
  { nome: "Concluídas", valor: "concluidas" }
];

const disciplinas = [
  "Desenvolvimento Web",
  "Banco de Dados",
  "Engenharia de Software",
  "Algoritmos"
];

function SeletorDisciplina({ valor, opcoes, aoAlterar, id }) {
  const [aberto, definirAberto] = useState(false);
  const referencia = useRef(null);
  const referenciaBotao = useRef(null);
  const referenciasOpcoes = useRef([]);

  useEffect(() => {
    function verificarClique(evento) {
      if (!referencia.current?.contains(evento.target)) {
        definirAberto(false);
      }
    }

    function verificarTecla(evento) {
      if (evento.key === "Escape") {
        definirAberto(false);
        if (referencia.current?.contains(document.activeElement)) {
          referenciaBotao.current?.focus();
        }
      }
    }

    document.addEventListener("mousedown", verificarClique);
    document.addEventListener("keydown", verificarTecla);

    return () => {
      document.removeEventListener("mousedown", verificarClique);
      document.removeEventListener("keydown", verificarTecla);
    };
  }, []);

  function selecionarOpcao(opcao) {
    aoAlterar(opcao);
    definirAberto(false);
    referenciaBotao.current?.focus();
  }

  function controlarTeclado(evento, indice) {
    if (evento.key === "ArrowDown") {
      evento.preventDefault();
      referenciasOpcoes.current[(indice + 1) % opcoes.length]?.focus();
    } else if (evento.key === "ArrowUp") {
      evento.preventDefault();
      referenciasOpcoes.current[(indice - 1 + opcoes.length) % opcoes.length]?.focus();
    }
  }

  function abrirPeloTeclado(evento) {
    if (evento.key === "ArrowDown" || evento.key === "ArrowUp") {
      evento.preventDefault();
      definirAberto(true);
      requestAnimationFrame(() => {
        const indice = opcoes.indexOf(valor);
        referenciasOpcoes.current[Math.max(0, indice)]?.focus();
      });
    }
  }

  return (
    <div className="seletor-disciplina" ref={referencia}>
      <button
        id={id}
        ref={referenciaBotao}
        type="button"
        className="botao-disciplina"
        aria-expanded={aberto}
        aria-controls={`${id}-opcoes`}
        onClick={() => definirAberto(!aberto)}
        onKeyDown={abrirPeloTeclado}
      >
        <span>{valor}</span>
        <span aria-hidden="true">▾</span>
      </button>

      {aberto && (
        <div id={`${id}-opcoes`} className="lista-disciplinas">
          {opcoes.map((opcao, indice) => (
            <button
              key={opcao}
              ref={(elemento) => { referenciasOpcoes.current[indice] = elemento; }}
              type="button"
              className={valor === opcao ? "selecionada" : ""}
              aria-pressed={valor === opcao}
              onClick={() => selecionarOpcao(opcao)}
              onKeyDown={(evento) => controlarTeclado(evento, indice)}
            >
              {opcao}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Painel() {
  const {
    atividades,
    aviso,
    mostrarAviso,
    fecharAviso,
    alternarConclusao,
    adicionarAtividade
  } = useEstudos();

  const [filtro, definirFiltro] = useState("todas");
  const [disciplinaFiltro, definirDisciplinaFiltro] = useState("Todas");
  const [paginaAtual, definirPaginaAtual] = useState(1);
  const [titulo, definirTitulo] = useState("");
  const [disciplina, definirDisciplina] = useState(disciplinas[0]);

  const concluidas = atividades.filter(
    (atividade) => atividade.concluida
  ).length;

  const pendentes = atividades.length - concluidas;

  const porcentagem = atividades.length
    ? Math.round((concluidas / atividades.length) * 100)
    : 0;

  const atividadesFiltradas = atividades.filter((atividade) => {
    const atendeStatus =
      filtro === "todas" ||
      (filtro === "pendentes" && !atividade.concluida) ||
      (filtro === "concluidas" && atividade.concluida);

    const atendeDisciplina =
      disciplinaFiltro === "Todas" ||
      atividade.disciplina === disciplinaFiltro;

    return atendeStatus && atendeDisciplina;
  });

  const porPagina = 4;

  const totalPaginas = Math.ceil(
    atividadesFiltradas.length / porPagina
  );

  const paginaSegura = Math.max(
    1,
    Math.min(paginaAtual, totalPaginas || 1)
  );

  const inicio = (paginaSegura - 1) * porPagina;

  const atividadesVisiveis = atividadesFiltradas.slice(
    inicio,
    inicio + porPagina
  );

  function alterarFiltro(valor) {
    definirFiltro(valor);
    definirPaginaAtual(1);
  }

  function alterarDisciplinaFiltro(valor) {
    definirDisciplinaFiltro(valor);
    definirPaginaAtual(1);
  }

  function cadastrarAtividade(evento) {
    evento.preventDefault();

    if (adicionarAtividade(titulo, disciplina)) {
      definirTitulo("");
      definirFiltro("todas");
      definirDisciplinaFiltro("Todas");
      definirPaginaAtual(1);
    }
  }

  const itensAbas = [
    {
      nome: "Atividades",
      conteudo: (
        <div className="grade-conteudo">
          <div>
            <section className="cartao">
              <div className="cabecalho-secao">
                <h2>Minhas atividades</h2>

                <MenuSuspenso
                  opcoes={opcoesFiltro}
                  valorSelecionado={filtro}
                  aoAlterar={alterarFiltro}
                />
              </div>

              <div className="campo-disciplina">
                <label htmlFor="filtro-disciplina">Disciplina</label>
                <SeletorDisciplina
                  id="filtro-disciplina"
                  valor={disciplinaFiltro}
                  opcoes={["Todas", ...disciplinas]}
                  aoAlterar={alterarDisciplinaFiltro}
                />
              </div>

              {atividadesVisiveis.length === 0 ? (
                <p className="texto-suave">
                  Nenhuma atividade encontrada.
                </p>
              ) : (
                <ul className="lista-atividades">
                  {atividadesVisiveis.map((atividade) => (
                    <li
                      key={atividade.id}
                      className={
                        atividade.concluida ? "concluida" : ""
                      }
                    >
                      <label>
                        <input
                          type="checkbox"
                          checked={atividade.concluida}
                          onChange={() =>
                            alternarConclusao(atividade.id)
                          }
                        />

                        <span>
                          <strong>{atividade.titulo}</strong>
                          <small>{atividade.disciplina}</small>
                        </span>
                      </label>

                      <span className="etiqueta">
                        {atividade.concluida
                          ? "Concluída"
                          : "Pendente"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <Paginacao
                paginaAtual={paginaSegura}
                totalPaginas={totalPaginas}
                aoMudarPagina={definirPaginaAtual}
              />
            </section>

            <Acordeao perguntas={perguntas} />
          </div>

          <aside className="coluna-lateral">
            <section className="cartao">
              <h2>Adicionar atividade</h2>

              <form
                onSubmit={cadastrarAtividade}
                className="formulario"
              >
                <label>
                  Nome da atividade

                  <input
                    value={titulo}
                    onChange={(evento) =>
                      definirTitulo(evento.target.value)
                    }
                    placeholder="Ex.: Estudar React"
                  />
                </label>

                <div className="campo-formulario-disciplina">
                  <label htmlFor="cadastro-disciplina">Disciplina</label>
                  <SeletorDisciplina
                    id="cadastro-disciplina"
                    valor={disciplina}
                    opcoes={disciplinas}
                    aoAlterar={definirDisciplina}
                  />
                </div>

                <button
                  className="botao-principal"
                  type="submit"
                >
                  Adicionar atividade
                </button>
              </form>
            </section>

            <section className="cartao">
              <h2>Progresso dos estudos</h2>

              <BarraDeProgresso
                valor={porcentagem}
                descricao="Atividades concluídas"
              />
            </section>

            <section className="cartao">
              <h2>Testar notificações</h2>

              <div className="botoes-teste">
                <button
                  type="button"
                  onClick={() =>
                    mostrarAviso(
                      "Operação realizada!",
                      "sucesso"
                    )
                  }
                >
                  Sucesso
                </button>

                <button
                  type="button"
                  onClick={() =>
                    mostrarAviso(
                      "Ocorreu um erro!",
                      "erro"
                    )
                  }
                >
                  Erro
                </button>

                <button
                  type="button"
                  onClick={() =>
                    mostrarAviso(
                      "Informação importante.",
                      "informacao"
                    )
                  }
                >
                  Informação
                </button>
              </div>
            </section>
          </aside>
        </div>
      )
    },
    {
      nome: "Desempenho",
      conteudo: (
        <section className="cartao">
          <h2>Meu desempenho</h2>

          <p>
            Você concluiu {concluidas} de {atividades.length} atividades.
          </p>

          <BarraDeProgresso
            valor={porcentagem}
            descricao="Progresso geral"
          />
        </section>
      )
    },
    {
      nome: "Sobre",
      conteudo: (
        <section className="cartao">
          <h2>Sobre o Organizaê</h2>

          <p>
            Um painel de estudos desenvolvido em React para
            organizar tarefas acadêmicas e acompanhar o progresso.
          </p>
        </section>
      )
    }
  ];

  return (
    <>
      <header className="topo">
        <div className="limite">
          <span className="marca">Organizaê</span>
          <span className="subtitulo">
            Meu painel de estudos
          </span>
        </div>
      </header>

      <main className="limite">
        <div className="apresentacao">
          <h1>Organize seus estudos</h1>

          <p>
            Acompanhe suas atividades e seu progresso em um só lugar.
          </p>
        </div>

        <div className="indicadores">
          <div className="indicador">
            <span>Total</span>
            <strong>{atividades.length}</strong>
          </div>

          <div className="indicador">
            <span>Pendentes</span>
            <strong>{pendentes}</strong>
          </div>

          <div className="indicador">
            <span>Concluídas</span>
            <strong>{concluidas}</strong>
          </div>

          <div className="indicador">
            <span>Progresso</span>
            <strong>{porcentagem}%</strong>
          </div>
        </div>

        <Abas itens={itensAbas} />
      </main>

      <Notificacao
        key={aviso?.id}
        aviso={aviso}
        aoFechar={fecharAviso}
      />
    </>
  );
}

export default function App() {
  return (
    <ProvedorEstudos>
      <Painel />
    </ProvedorEstudos>
  );
}