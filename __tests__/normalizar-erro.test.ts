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

    it("reconhece somente respostas que invalidam a sessão", () => {
        expect(erroInvalidaSessao(new ErroApi("Token", "HTTP", 401))).toBe(true);
        expect(erroInvalidaSessao(new ErroApi("Servidor", "HTTP", 500))).toBe(false);
        expect(erroInvalidaSessao(new ErroApi("Rede", "REDE"))).toBe(false);
    });
});
