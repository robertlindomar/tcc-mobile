import { ErroApi, ErroDominio } from "@/services/erros";
import {
    MENSAGEM_ERRO_CONEXAO,
    erroInvalidaSessao,
    normalizarErro,
} from "@/services/normalizarErro";

describe("normalizarErro", () => {
    it("preserva a mensagem amigável de falha de rede", () => {
        expect(normalizarErro(new ErroApi("falha", "REDE"))).toBe(MENSAGEM_ERRO_CONEXAO);
    });

    it("não expõe a mensagem interna de credenciais", () => {
        expect(normalizarErro(new ErroApi("Credenciais invalidas", "HTTP", 401))).toBe(
            "E-mail ou senha inválidos.",
        );
    });

    it("usa mensagens de domínio próprias", () => {
        expect(normalizarErro(new ErroDominio("Este aplicativo é destinado aos consumidores."))).toBe(
            "Este aplicativo é destinado aos consumidores.",
        );
    });

    it("mapeia missão recorrente com disponivelEm", () => {
        const mensagem = normalizarErro(
            new ErroApi(
                "Missao ja concluida neste periodo",
                "HTTP",
                409,
                "2026-08-28T03:00:00.000Z",
                "DIARIA",
                true,
            ),
        );

        expect(mensagem).toContain("Recompensa disponível em");
        expect(mensagem).toContain("28/08/2026");
    });

    it("mapeia missão UMA_VEZ pela mensagem da API", () => {
        expect(
            normalizarErro(
                new ErroApi("Missao ja concluida", "HTTP", 409, undefined, "UMA_VEZ", false),
            ),
        ).toBe("Missão já concluída");
    });

    it("mapeia missão UMA_VEZ pelo flag repetivel", () => {
        expect(
            normalizarErro(
                new ErroApi("Missao ja concluida neste periodo", "HTTP", 409, null, "UMA_VEZ", false),
            ),
        ).toBe("Missão já concluída");
    });

    it("mapeia missão recorrente sem disponivelEm com data do dia seguinte", () => {
        const amanha = new Date();
        amanha.setDate(amanha.getDate() + 1);
        const dataEsperada = amanha.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        expect(
            normalizarErro(
                new ErroApi(
                    "Missao ja concluida neste periodo",
                    "HTTP",
                    409,
                    null,
                    "DIARIA",
                    true,
                ),
            ),
        ).toBe(`Você já concluiu esta missão hoje. Recompensa disponível em ${dataEsperada}.`);
    });

    it("mapeia API antiga sem metadados como missão recorrente", () => {
        const amanha = new Date();
        amanha.setDate(amanha.getDate() + 1);
        const dataEsperada = amanha.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        expect(
            normalizarErro(
                new ErroApi("Missao ja concluida neste periodo", "HTTP", 409),
            ),
        ).toBe(`Você já concluiu esta missão hoje. Recompensa disponível em ${dataEsperada}.`);
    });

    it("reconhece somente respostas que invalidam a sessão", () => {
        expect(erroInvalidaSessao(new ErroApi("Token", "HTTP", 401))).toBe(true);
        expect(erroInvalidaSessao(new ErroApi("Servidor", "HTTP", 500))).toBe(false);
        expect(erroInvalidaSessao(new ErroApi("Rede", "REDE"))).toBe(false);
    });

    it("mapeia NFC-e pelo código estável mesmo se a mensagem mudar", () => {
        expect(
            normalizarErro(
                new ErroApi("mensagem qualquer", "HTTP", 400, undefined, undefined, undefined, "NFCE_FORA_PERIODO"),
            ),
        ).toBe("A data da compra está fora do período da campanha.");
    });
});
