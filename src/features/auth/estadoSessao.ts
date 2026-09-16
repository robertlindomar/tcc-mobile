import { PerfilConsumidorAtual } from "@/types/api";

export type SituacaoSessao =
    | "CARREGANDO_SESSAO"
    | "NAO_AUTENTICADO"
    | "CONSUMIDOR_AUTENTICADO";

export type EstadoSessao = {
    situacao: SituacaoSessao;
    perfil: PerfilConsumidorAtual | null;
    erroRestauracao: string | null;
};

export type AcaoSessao =
    | { tipo: "AUTENTICAR"; perfil: PerfilConsumidorAtual }
    | { tipo: "NAO_AUTENTICAR" }
    | { tipo: "ERRO_RESTAURACAO"; mensagem: string }
    | { tipo: "CARREGAR" };

export const estadoInicialSessao: EstadoSessao = {
    situacao: "CARREGANDO_SESSAO",
    perfil: null,
    erroRestauracao: null,
};

export function reduzirSessao(estado: EstadoSessao, acao: AcaoSessao): EstadoSessao {
    switch (acao.tipo) {
        case "CARREGAR":
            return { ...estadoInicialSessao };
        case "AUTENTICAR":
            return {
                situacao: "CONSUMIDOR_AUTENTICADO",
                perfil: acao.perfil,
                erroRestauracao: null,
            };
        case "NAO_AUTENTICAR":
            return {
                situacao: "NAO_AUTENTICADO",
                perfil: null,
                erroRestauracao: null,
            };
        case "ERRO_RESTAURACAO":
            return {
                situacao: "CARREGANDO_SESSAO",
                perfil: null,
                erroRestauracao: acao.mensagem,
            };
    }
}
