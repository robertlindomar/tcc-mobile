import {
    estadoInicialSessao,
    reduzirSessao,
} from "@/features/auth/estadoSessao";
import { PerfilConsumidorAtual } from "@/types/api";

const perfil: PerfilConsumidorAtual = {
    usuario: {
        id: 1,
        nome: "Bruno Lima",
        email: "cliente2@demo.local",
        role: "CONSUMIDOR",
        ativo: true,
        dataCriacao: "2026-08-17T20:00:00.000Z",
        dataAtualizacao: "2026-08-17T20:00:00.000Z",
    },
    consumidor: {
        id: 2,
        cpf: "222.333.444-55",
        pontos: 200,
        nivel: 3,
        sexoId: null,
        usuarioId: 1,
        dataCriacao: "2026-08-17T20:00:00.000Z",
        dataAtualizacao: "2026-08-17T20:00:00.000Z",
    },
};

describe("reduzirSessao", () => {
    it("entra no aplicativo apenas depois de receber o perfil do backend", () => {
        const estado = reduzirSessao(estadoInicialSessao, { tipo: "AUTENTICAR", perfil });

        expect(estado).toEqual({
            situacao: "CONSUMIDOR_AUTENTICADO",
            perfil,
            erroRestauracao: null,
        });
    });

    it("mantém o fluxo em carregamento quando a API está indisponível", () => {
        const estado = reduzirSessao(estadoInicialSessao, {
            tipo: "ERRO_RESTAURACAO",
            mensagem: "Não foi possível conectar ao servidor.",
        });

        expect(estado.situacao).toBe("CARREGANDO_SESSAO");
        expect(estado.perfil).toBeNull();
    });

    it("limpa o perfil no logout ou após 401", () => {
        const autenticado = reduzirSessao(estadoInicialSessao, { tipo: "AUTENTICAR", perfil });
        const deslogado = reduzirSessao(autenticado, { tipo: "NAO_AUTENTICAR" });

        expect(deslogado).toEqual({
            situacao: "NAO_AUTENTICADO",
            perfil: null,
            erroRestauracao: null,
        });
    });
});
