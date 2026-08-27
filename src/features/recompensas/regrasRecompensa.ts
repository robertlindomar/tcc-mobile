import {
    RecompensaCatalogo,
    ResgateRecompensa,
    SituacaoRecompensa,
} from "@/types/api";

export function filtrarRecompensasPorLoja(
    recompensas: RecompensaCatalogo[],
    lojistaId: number,
): RecompensaCatalogo[] {
    return recompensas.filter((item) => item.lojistaId === lojistaId);
}

export function podeResgatar(recompensa: RecompensaCatalogo, pontos: number): boolean {
    return recompensa.situacao === "DISPONIVEL" && pontos >= recompensa.custoPontos;
}

export function rotuloBotaoResgate(
    recompensa: RecompensaCatalogo,
    pontos: number,
    resgatando: boolean,
): string {
    if (resgatando) {
        return "Resgatando...";
    }
    if (recompensa.situacao === "ESGOTADA") {
        return "Esgotada";
    }
    if (recompensa.situacao === "EXPIRADA") {
        return "Expirada";
    }
    if (recompensa.situacao === "DESATIVADA") {
        return "Indisponível";
    }
    if (pontos < recompensa.custoPontos) {
        return "Pontos insuficientes";
    }
    return "Resgatar";
}

export function ordenarResgates(resgates: ResgateRecompensa[]): ResgateRecompensa[] {
    return [...resgates].sort((a, b) => b.id - a.id);
}

export function aplicarResgateNoCatalogo(
    recompensas: RecompensaCatalogo[],
    recompensaId: number,
): RecompensaCatalogo[] {
    return recompensas.map((item) => {
        if (item.id !== recompensaId) {
            return item;
        }
        if (item.estoque === null) {
            return item;
        }
        const novoEstoque = Math.max(0, item.estoque - 1);
        const novaSituacao: SituacaoRecompensa =
            novoEstoque === 0 ? "ESGOTADA" : item.situacao;
        return {
            ...item,
            estoque: novoEstoque,
            situacao: novaSituacao,
        };
    });
}
