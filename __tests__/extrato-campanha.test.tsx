import React from "react";
import { Text } from "react-native";
import { HistoricoNotasLidas } from "@/features/nfce/components/HistoricoNotasLidas";
import { ResumoTicketsCampanha } from "@/features/nfce/components/ResumoTicketsCampanha";
import {
    descreverTicketsNota,
    formatarCnpj,
    formatarDataHora,
    progressoProximoTicket,
} from "@/features/nfce/regrasExtrato";
import { ExtratoCampanha } from "@/types/api";

const { act, create } = jest.requireActual("react-test-renderer");
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
let tela: any;
afterEach(async () => { if (tela) await act(async () => tela.unmount()); tela = null; });

function textos(): string {
    return tela.root.findAllByType(Text).map((no: any) => [no.props.children].flat().join("")).join(" | ");
}

const extrato: ExtratoCampanha = {
    campanhaId: 1,
    edicao: 2,
    valorPorTicket: 10,
    totalTickets: 66,
    valorResidual: 9.86,
    faltaParaProximoTicket: 0.14,
    notas: [
        {
            id: 5,
            valorNota: 669.86,
            ticketsGerados: 66,
            numerosTickets: { primeiro: 1, ultimo: 66 },
            dataEmissao: "2026-10-28T13:00:00.000Z",
            dataLeitura: new Date(2026, 9, 28, 14, 5).toISOString(),
            loja: { nome: "Básico Brasil", cnpj: "38281946000146" },
        },
    ],
};

describe("regrasExtrato", () => {
    it("calcula o progresso para o próximo ticket limitado a 100%", () => {
        expect(progressoProximoTicket(9.86, 10)).toBeCloseTo(0.986);
        expect(progressoProximoTicket(0, 10)).toBe(0);
        expect(progressoProximoTicket(15, 10)).toBe(1);
        expect(progressoProximoTicket(5, 0)).toBe(0);
    });

    it("descreve os tickets gerados por nota", () => {
        expect(descreverTicketsNota({ ticketsGerados: 2, numerosTickets: { primeiro: 7, ultimo: 8 } })).toBe(
            "+2 tickets (nº 7 a 8)",
        );
        expect(descreverTicketsNota({ ticketsGerados: 1, numerosTickets: { primeiro: 3, ultimo: 3 } })).toBe(
            "+1 ticket (nº 3)",
        );
        expect(descreverTicketsNota({ ticketsGerados: 0, numerosTickets: null })).toBe(
            "Sem ticket (somou ao saldo)",
        );
    });

    it("formata CNPJ sem máscara e mantém valores fora do padrão", () => {
        expect(formatarCnpj("38281946000146")).toBe("38.281.946/0001-46");
        expect(formatarCnpj("38.281.946/0001-46")).toBe("38.281.946/0001-46");
        expect(formatarCnpj("123")).toBe("123");
    });

    it("formata data e hora local", () => {
        expect(formatarDataHora(new Date(2026, 9, 28, 14, 5).toISOString())).toBe("28/10/2026 às 14:05");
        expect(formatarDataHora("invalida")).toBe("invalida");
    });
});

describe("componentes do extrato", () => {
    it("resumo mostra total de tickets, notas lidas e quanto falta", async () => {
        await act(async () => { tela = create(<ResumoTicketsCampanha carregando={false} extrato={extrato} />); });
        const conteudo = textos();
        expect(conteudo).toContain("66");
        expect(conteudo).toContain("nota lida");
        expect(conteudo).toMatch(/R\$\s0,14/);
    });

    it("histórico lista loja, CNPJ, valor e tickets da nota", async () => {
        await act(async () => { tela = create(<HistoricoNotasLidas notas={extrato.notas} />); });
        const conteudo = textos();
        expect(conteudo).toContain("Básico Brasil");
        expect(conteudo).toContain("CNPJ 38.281.946/0001-46");
        expect(conteudo).toMatch(/R\$\s669,86/);
        expect(conteudo).toContain("+66 tickets (nº 1 a 66)");
        expect(conteudo).toContain("Lida em 28/10/2026 às 14:05");
    });

    it("histórico vazio orienta o consumidor", async () => {
        await act(async () => { tela = create(<HistoricoNotasLidas notas={[]} />); });
        expect(textos()).toContain("Nenhuma nota lida nesta campanha ainda.");
    });
});
