import {
    aplicarResgateNoCatalogo,
    filtrarRecompensasPorLoja,
    ordenarResgates,
    podeResgatar,
    rotuloBotaoResgate,
} from "@/features/recompensas/regrasRecompensa";
import { RecompensaCatalogo, ResgateRecompensa } from "@/types/api";

function recompensaFake(
    overrides: Partial<RecompensaCatalogo> = {},
): RecompensaCatalogo {
    return {
        id: 1,
        nome: "Brinde",
        descricao: null,
        custoPontos: 100,
        ativa: true,
        estoque: 5,
        dataFim: null,
        dataFimCivil: null,
        situacao: "DISPONIVEL",
        lojistaId: 10,
        nomeLoja: "Loja A",
        dataCriacao: "2026-08-01T12:00:00.000Z",
        dataAtualizacao: "2026-08-01T12:00:00.000Z",
        ...overrides,
    };
}

describe("podeResgatar", () => {
    it("permite resgate com pontos exatamente iguais ao custo", () => {
        const recompensa = recompensaFake({ custoPontos: 100, situacao: "DISPONIVEL" });
        expect(podeResgatar(recompensa, 100)).toBe(true);
    });

    it("bloqueia resgate com pontos abaixo do custo", () => {
        const recompensa = recompensaFake({ custoPontos: 100, situacao: "DISPONIVEL" });
        expect(podeResgatar(recompensa, 99)).toBe(false);
    });

    it("bloqueia recompensa ESGOTADA", () => {
        const recompensa = recompensaFake({ situacao: "ESGOTADA" });
        expect(podeResgatar(recompensa, 500)).toBe(false);
    });

    it("bloqueia recompensa EXPIRADA", () => {
        const recompensa = recompensaFake({ situacao: "EXPIRADA" });
        expect(podeResgatar(recompensa, 500)).toBe(false);
    });
});

describe("rotuloBotaoResgate", () => {
    it("mostra Esgotada para situacao ESGOTADA", () => {
        const recompensa = recompensaFake({ situacao: "ESGOTADA" });
        expect(rotuloBotaoResgate(recompensa, 500, false)).toBe("Esgotada");
    });

    it("mostra Expirada para situacao EXPIRADA", () => {
        const recompensa = recompensaFake({ situacao: "EXPIRADA" });
        expect(rotuloBotaoResgate(recompensa, 500, false)).toBe("Expirada");
    });

    it("mostra Pontos insuficientes quando DISPONIVEL mas saldo baixo", () => {
        const recompensa = recompensaFake({ situacao: "DISPONIVEL", custoPontos: 100 });
        expect(rotuloBotaoResgate(recompensa, 50, false)).toBe("Pontos insuficientes");
    });
});

describe("aplicarResgateNoCatalogo", () => {
    it("mantém estoque null após resgate", () => {
        const lista = [recompensaFake({ id: 7, estoque: null })];
        const resultado = aplicarResgateNoCatalogo(lista, 7);
        expect(resultado[0].estoque).toBeNull();
        expect(resultado[0].situacao).toBe("DISPONIVEL");
    });

    it("decrementa estoque numérico e marca ESGOTADA ao chegar em 0", () => {
        const lista = [recompensaFake({ id: 7, estoque: 1 })];
        const resultado = aplicarResgateNoCatalogo(lista, 7);
        expect(resultado[0].estoque).toBe(0);
        expect(resultado[0].situacao).toBe("ESGOTADA");
    });

    it("decrementa estoque sem alterar situacao quando ainda restam unidades", () => {
        const lista = [recompensaFake({ id: 7, estoque: 3 })];
        const resultado = aplicarResgateNoCatalogo(lista, 7);
        expect(resultado[0].estoque).toBe(2);
        expect(resultado[0].situacao).toBe("DISPONIVEL");
    });
});

describe("filtrarRecompensasPorLoja", () => {
    it("retorna apenas recompensas do lojista informado", () => {
        const lista = [
            recompensaFake({ id: 1, lojistaId: 10 }),
            recompensaFake({ id: 2, lojistaId: 20 }),
            recompensaFake({ id: 3, lojistaId: 10 }),
        ];
        const resultado = filtrarRecompensasPorLoja(lista, 10);
        expect(resultado).toHaveLength(2);
        expect(resultado.every((item) => item.lojistaId === 10)).toBe(true);
    });
});

describe("ordenarResgates", () => {
    it("ordena por id decrescente", () => {
        const resgates: ResgateRecompensa[] = [
            {
                id: 1,
                recompensaId: 1,
                consumidorId: 1,
                custoPontosSnapshot: 50,
                nomeRecompensaSnapshot: "A",
                status: "PENDENTE_ENTREGA",
                dataEntrega: null,
                dataCriacao: "2026-08-01T12:00:00.000Z",
            },
            {
                id: 3,
                recompensaId: 2,
                consumidorId: 1,
                custoPontosSnapshot: 80,
                nomeRecompensaSnapshot: "B",
                status: "ENTREGUE",
                dataEntrega: "2026-08-02T12:00:00.000Z",
                dataCriacao: "2026-08-02T12:00:00.000Z",
            },
            {
                id: 2,
                recompensaId: 1,
                consumidorId: 1,
                custoPontosSnapshot: 50,
                nomeRecompensaSnapshot: "A",
                status: "PENDENTE_ENTREGA",
                dataEntrega: null,
                dataCriacao: "2026-08-01T18:00:00.000Z",
            },
        ];

        const ordenado = ordenarResgates(resgates);
        expect(ordenado.map((item) => item.id)).toEqual([3, 2, 1]);
    });
});
