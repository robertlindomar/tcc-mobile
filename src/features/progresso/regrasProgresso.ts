import { Ionicons } from "@expo/vector-icons";
import { ProgressoConsumidor } from "@/types/api";

type NomeIcone = keyof typeof Ionicons.glyphMap;

const TITULOS_NIVEL: { aPartirDe: number; titulo: string }[] = [
    { aPartirDe: 10, titulo: "Lenda do Comércio" },
    { aPartirDe: 7, titulo: "Embaixador do Bairro" },
    { aPartirDe: 5, titulo: "Cliente VIP" },
    { aPartirDe: 3, titulo: "Explorador Local" },
    { aPartirDe: 2, titulo: "Frequentador" },
    { aPartirDe: 1, titulo: "Novato" },
];

export function tituloDoNivel(nivel: number): string {
    return TITULOS_NIVEL.find((faixa) => nivel >= faixa.aPartirDe)?.titulo ?? "Novato";
}

/** Fração (0–1) do nível atual já percorrida. */
export function fracaoNivel(progresso: Pick<ProgressoConsumidor, "xp" | "xpInicioNivel" | "xpProximoNivel">): number {
    const faixa = progresso.xpProximoNivel - progresso.xpInicioNivel;
    if (faixa <= 0) {
        return 0;
    }
    return Math.min(1, Math.max(0, (progresso.xp - progresso.xpInicioNivel) / faixa));
}

export function xpParaProximoNivel(progresso: Pick<ProgressoConsumidor, "xp" | "xpProximoNivel">): number {
    return Math.max(0, progresso.xpProximoNivel - progresso.xp);
}

export type Conquista = {
    id: string;
    titulo: string;
    descricao: string;
    icone: NomeIcone;
    atual: number;
    meta: number;
    conquistada: boolean;
};

/** Medalhas derivadas só dos contadores do progresso (nada é gravado). */
export function listarConquistas(progresso: ProgressoConsumidor): Conquista[] {
    const definicoes: (Omit<Conquista, "conquistada" | "atual"> & { valor: number })[] = [
        { id: "primeira-missao", titulo: "Primeira missão", descricao: "Conclua 1 missão", icone: "flag", meta: 1, valor: progresso.missoesConcluidas },
        { id: "cacador", titulo: "Caçador de missões", descricao: "Conclua 10 missões", icone: "trophy", meta: 10, valor: progresso.missoesConcluidas },
        { id: "explorador", titulo: "Explorador", descricao: "Faça missões em 3 lojas", icone: "map", meta: 3, valor: progresso.lojasVisitadas },
        { id: "primeira-nota", titulo: "Nota na mão", descricao: "Leia 1 NFC-e", icone: "receipt", meta: 1, valor: progresso.notasLidas },
        { id: "sortudo", titulo: "Rumo ao sorteio", descricao: "Junte 10 tickets na campanha", icone: "ticket", meta: 10, valor: progresso.ticketsCampanhasAtivas },
        { id: "primeiro-resgate", titulo: "Primeira recompensa", descricao: "Resgate 1 recompensa", icone: "gift", meta: 1, valor: progresso.resgates },
        { id: "nivel-5", titulo: "Cliente VIP", descricao: "Alcance o nível 5", icone: "diamond", meta: 5, valor: progresso.nivel },
    ];
    return definicoes.map(({ valor, ...conquista }) => ({
        ...conquista,
        atual: Math.min(valor, conquista.meta),
        conquistada: valor >= conquista.meta,
    }));
}

export function rotuloOfertas(loja: { ofertasVigentes: number; maiorDesconto: number | null }): string {
    if (loja.ofertasVigentes <= 0) {
        return "Confira a loja";
    }
    const ofertas = loja.ofertasVigentes === 1 ? "1 oferta" : `${loja.ofertasVigentes} ofertas`;
    return loja.maiorDesconto ? `${ofertas} · até ${loja.maiorDesconto}% off` : ofertas;
}
