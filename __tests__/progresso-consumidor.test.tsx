import React from "react";
import { Text } from "react-native";
import { ListaConquistas } from "@/features/progresso/components/ListaConquistas";
import { PainelXp } from "@/features/progresso/components/PainelXp";
import { ResumoAtividades } from "@/features/progresso/components/ResumoAtividades";
import {
    fracaoNivel,
    listarConquistas,
    rotuloOfertas,
    tituloDoNivel,
    xpParaProximoNivel,
} from "@/features/progresso/regrasProgresso";
import { ProgressoConsumidor } from "@/types/api";

const { act, create } = jest.requireActual("react-test-renderer");
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
let tela: any;
afterEach(async () => { if (tela) await act(async () => tela.unmount()); tela = null; });

function textos(): string {
    return tela.root.findAllByType(Text).map((no: any) => [no.props.children].flat().join("")).join(" | ");
}

const progresso: ProgressoConsumidor = {
    pontos: 55,
    pontosGastos: 100,
    xp: 155,
    nivel: 2,
    xpInicioNivel: 100,
    xpProximoNivel: 200,
    missoesConcluidas: 2,
    lojasVisitadas: 1,
    notasLidas: 3,
    resgates: 1,
    ticketsCampanhasAtivas: 12,
};

describe("regrasProgresso", () => {
    it("títulos por faixa de nível", () => {
        expect(tituloDoNivel(1)).toBe("Novato");
        expect(tituloDoNivel(2)).toBe("Frequentador");
        expect(tituloDoNivel(4)).toBe("Explorador Local");
        expect(tituloDoNivel(12)).toBe("Lenda do Comércio");
    });

    it("barra e XP restante do nível atual", () => {
        expect(fracaoNivel(progresso)).toBeCloseTo(0.55);
        expect(xpParaProximoNivel(progresso)).toBe(45);
        expect(fracaoNivel({ xp: 0, xpInicioNivel: 0, xpProximoNivel: 0 })).toBe(0);
    });

    it("conquistas usam só os contadores do progresso", () => {
        const conquistas = Object.fromEntries(listarConquistas(progresso).map((item) => [item.id, item]));
        expect(conquistas["primeira-missao"]).toMatchObject({ conquistada: true, atual: 1 });
        expect(conquistas.cacador).toMatchObject({ conquistada: false, atual: 2, meta: 10 });
        expect(conquistas.sortudo).toMatchObject({ conquistada: true });
        expect(conquistas["nivel-5"]).toMatchObject({ conquistada: false, atual: 2 });
    });

    it("rótulo de ofertas do carrossel", () => {
        expect(rotuloOfertas({ ofertasVigentes: 2, maiorDesconto: 20 })).toBe("2 ofertas · até 20% off");
        expect(rotuloOfertas({ ofertasVigentes: 1, maiorDesconto: null })).toBe("1 oferta");
        expect(rotuloOfertas({ ofertasVigentes: 0, maiorDesconto: null })).toBe("Confira a loja");
    });
});

describe("componentes do progresso", () => {
    it("painel de XP mostra nível, título e quanto falta", async () => {
        await act(async () => { tela = create(<PainelXp progresso={progresso} />); });
        const conteudo = textos();
        expect(conteudo).toContain("Frequentador");
        expect(conteudo).toContain("155 XP");
        expect(conteudo).toContain("55/100 XP");
        expect(conteudo).toContain("45 XP");
        expect(conteudo).toContain("Gastar pontos em recompensas não tira seu XP");
    });

    it("resumo filtrado mostra só pontos e tickets", async () => {
        await act(async () => { tela = create(<ResumoAtividades progresso={progresso} somente={["pontos", "tickets"]} />); });
        const conteudo = textos();
        expect(conteudo).toContain("Pontos");
        expect(conteudo).toContain("Tickets");
        expect(conteudo).not.toContain("Missões");
    });

    it("conquistas mostram o placar", async () => {
        await act(async () => { tela = create(<ListaConquistas progresso={progresso} />); });
        expect(textos()).toContain("4/7");
    });
});
