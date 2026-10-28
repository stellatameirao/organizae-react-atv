import { createContext, useContext, useEffect, useState } from "react";

const ContextoEstudos = createContext(null);
const CHAVE = "organizae-atividades";

const atividadesIniciais = [
  { id: 1, titulo: "Revisar React", disciplina: "Desenvolvimento Web", concluida: true },
  { id: 2, titulo: "Praticar hooks", disciplina: "Desenvolvimento Web", concluida: false },
  { id: 3, titulo: "Modelagem de dados", disciplina: "Banco de Dados", concluida: false },
  { id: 4, titulo: "Preparar apresentação", disciplina: "Engenharia de Software", concluida: true },
  { id: 5, titulo: "Resolver exercícios", disciplina: "Algoritmos", concluida: false },
  { id: 6, titulo: "Documentar projeto", disciplina: "Engenharia de Software", concluida: false },
  { id: 7, titulo: "Revisar SQL", disciplina: "Banco de Dados", concluida: false },
  { id: 8, titulo: "Estudar algoritmos", disciplina: "Algoritmos", concluida: false }
];

function carregarAtividades() {
  try {
    const salvas = localStorage.getItem(CHAVE);
    if (!salvas) return atividadesIniciais;
    const dados = JSON.parse(salvas);
    return Array.isArray(dados) ? dados : atividadesIniciais;
  } catch {
    return atividadesIniciais;
  }
}

export function ProvedorEstudos({ children }) {
  const [atividades, definirAtividades] = useState(carregarAtividades);
  const [aviso, definirAviso] = useState(null);

  useEffect(() => {
    localStorage.setItem(CHAVE, JSON.stringify(atividades));
  }, [atividades]);

  function mostrarAviso(mensagem, tipo = "sucesso") {
    definirAviso({ id: Date.now(), mensagem, tipo });
  }

  function fecharAviso() {
    definirAviso(null);
  }

  function alternarConclusao(id) {
    definirAtividades((anteriores) =>
      anteriores.map((atividade) =>
        atividade.id === id ? { ...atividade, concluida: !atividade.concluida } : atividade
      )
    );
    mostrarAviso("Atividade atualizada!");
  }

  function adicionarAtividade(titulo, disciplina) {
    if (!titulo.trim()) {
      mostrarAviso("Digite o nome da atividade.", "erro");
      return false;
    }
    const nova = {
      id: Date.now(),
      titulo: titulo.trim(),
      disciplina,
      concluida: false
    };
    definirAtividades((anteriores) => [nova, ...anteriores]);
    mostrarAviso("Atividade adicionada!");
    return true;
  }

  return (
    <ContextoEstudos.Provider value={{
      atividades, aviso, mostrarAviso, fecharAviso,
      alternarConclusao, adicionarAtividade
    }}>
      {children}
    </ContextoEstudos.Provider>
  );
}

export function usarEstudos() {
  const contexto = useContext(ContextoEstudos);
  if (!contexto) throw new Error("Use usarEstudos dentro de ProvedorEstudos.");
  return contexto;
}
