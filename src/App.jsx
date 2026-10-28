import { useEffect, useState } from "react";
import Acordeao from "./componentes/Acordeao.jsx";
import MenuSuspenso from "./componentes/MenuSuspenso.jsx";
import Paginacao from "./componentes/Paginacao.jsx";
import BarraDeProgresso from "./componentes/BarraDeProgresso.jsx";
import Abas from "./componentes/Abas.jsx";
import Notificacao from "./componentes/Notificacao.jsx";
import { ProvedorEstudos, usarEstudos } from "./contexto/ContextoEstudos.jsx";

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

function Painel() {
  const {
    atividades,
    aviso,
    mostrarAviso,
    fecharAviso,
    alternarConclusao,
    adicionarAtividade
  } = usarEstudos();

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

  useEffect(() => {
    definirPaginaAtual(1);
  }, [filtro, disciplinaFiltro]);

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
                  aoAlterar={definirFiltro}
                />
              </div>

              <label className="campo-disciplina">
                Disciplina

                <select
                  value={disciplinaFiltro}
                  onChange={(evento) =>
                    definirDisciplinaFiltro(evento.target.value)
                  }
                >
                  <option>Todas</option>

                  {disciplinas.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

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

                <label>
                  Disciplina

                  <select
                    value={disciplina}
                    onChange={(evento) =>
                      definirDisciplina(evento.target.value)
                    }
                  >
                    {disciplinas.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>

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