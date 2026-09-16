import { listarMissoesCatalogo } from "@/features/missoes/servicoCatalogoMissao";
import { listarLojasCatalogo } from "@/features/lojas/servicoLoja";
import { LojaCatalogo, MissaoCatalogo, MissaoDisponivel } from "@/types/api";

export function mesclarMissoesDisponiveis(
    lojas: LojaCatalogo[],
    missoesPorLoja: Map<number, MissaoCatalogo[]>,
): MissaoDisponivel[] {
    const resultado: MissaoDisponivel[] = [];

    for (const loja of lojas) {
        const missoes = missoesPorLoja.get(loja.id) ?? [];
        for (const missao of missoes) {
            resultado.push({
                ...missao,
                lojistaId: loja.id,
                nomeLoja: loja.nomeFantasia,
            });
        }
    }

    return resultado.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

export async function listarMissoesDisponiveis(): Promise<MissaoDisponivel[]> {
    const lojas = await listarLojasCatalogo();
    const pares = await Promise.all(
        lojas.map(async (loja) => {
            const missoes = await listarMissoesCatalogo(loja.id);
            return [loja.id, missoes] as const;
        }),
    );

    const missoesPorLoja = new Map(pares);
    return mesclarMissoesDisponiveis(lojas, missoesPorLoja);
}

export function ordenarHistoricoMissoes<T extends { dataCriacao: string }>(lista: T[]): T[] {
    return [...lista].sort(
        (a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime(),
    );
}
