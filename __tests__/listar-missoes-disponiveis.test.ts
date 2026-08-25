import {
    mesclarMissoesDisponiveis,
    ordenarHistoricoMissoes,
} from "@/features/missoes/listarMissoesDisponiveis";
import { LojaCatalogo, MissaoCatalogo, MissaoConsumidor } from "@/types/api";

describe("mesclarMissoesDisponiveis", () => {
    const lojas: LojaCatalogo[] = [
        { id: 2, nomeFantasia: "Casa do Real" },
        { id: 3, nomeFantasia: "Mercado Azul" },
    ];

    it("enriquece missões com dados da loja e ordena por nome", () => {
        const missoesPorLoja = new Map<number, MissaoCatalogo[]>([
            [
                2,
                [
                    {
                        id: 10,
                        nome: "Visitar loja",
                        descricao: null,
                        pontoRecompensa: 50,
                        sistema: true,
                    },
                ],
            ],
            [
                3,
                [
                    {
                        id: 11,
                        nome: "Comprar café",
                        descricao: "Na loja",
                        pontoRecompensa: 20,
                        sistema: false,
                    },
                ],
            ],
        ]);

        const resultado = mesclarMissoesDisponiveis(lojas, missoesPorLoja);

        expect(resultado).toHaveLength(2);
        expect(resultado[0].nome).toBe("Comprar café");
        expect(resultado[0].nomeLoja).toBe("Mercado Azul");
        expect(resultado[1].nome).toBe("Visitar loja");
        expect(resultado[1].lojistaId).toBe(2);
    });

    it("ignora lojas sem missões", () => {
        const resultado = mesclarMissoesDisponiveis(lojas, new Map());
        expect(resultado).toEqual([]);
    });
});

describe("ordenarHistoricoMissoes", () => {
    it("ordena por dataCriacao decrescente", () => {
        const historico: MissaoConsumidor[] = [
            {
                id: 1,
                missaoId: 1,
                consumidorId: 1,
                chavePeriodo: "2026-08-17",
                dataCriacao: "2026-08-17T12:00:00.000Z",
                dataAtualizacao: "2026-08-17T12:00:00.000Z",
                nomeMissao: "Antiga",
                pontoRecompensa: 10,
            },
            {
                id: 2,
                missaoId: 1,
                consumidorId: 1,
                chavePeriodo: "2026-08-18",
                dataCriacao: "2026-08-18T12:00:00.000Z",
                dataAtualizacao: "2026-08-18T12:00:00.000Z",
                nomeMissao: "Recente",
                pontoRecompensa: 10,
            },
        ];

        const ordenado = ordenarHistoricoMissoes(historico);
        expect(ordenado[0].nomeMissao).toBe("Recente");
        expect(ordenado[1].nomeMissao).toBe("Antiga");
    });
});
