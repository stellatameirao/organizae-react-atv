import { useContext } from "react";
import ContextoEstudos from "./Contexto.jsx";

export default function useEstudos() {
  const contexto = useContext(ContextoEstudos);

  if (!contexto) {
    throw new Error("Use useEstudos dentro de ProvedorEstudos.");
  }

  return contexto;
}