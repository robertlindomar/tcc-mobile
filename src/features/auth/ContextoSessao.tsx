import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { obterPerfilAtual } from "@/features/consumidor/servicoConsumidor";
import { entrarApi, usuarioEhConsumidor } from "@/features/auth/servicoAuth";
import { EstadoSessao, estadoInicialSessao, reduzirSessao } from "@/features/auth/estadoSessao";
import { definirTratadorNaoAutorizado } from "@/services/clienteHttp";
import { ErroDominio } from "@/services/erros";
import { erroInvalidaSessao, normalizarErro } from "@/services/normalizarErro";
import { removerToken, obterToken, salvarToken } from "@/storage/token";

type ContextoSessaoValor = EstadoSessao & {
    entrar: (email: string, senha: string) => Promise<void>;
    sair: () => Promise<void>;
    restaurar: () => Promise<void>;
    atualizarPerfil: () => Promise<void>;
};

const ContextoSessao = createContext<ContextoSessaoValor | null>(null);

export function ProvedorSessao({ children }: PropsWithChildren) {
    const [estado, dispatch] = useReducer(reduzirSessao, estadoInicialSessao);

    const sair = useCallback(async () => {
        await removerToken();
        dispatch({ tipo: "NAO_AUTENTICAR" });
    }, []);

    const restaurar = useCallback(async () => {
        dispatch({ tipo: "CARREGAR" });
        const token = await obterToken();
        if (!token) {
            dispatch({ tipo: "NAO_AUTENTICAR" });
            return;
        }

        try {
            const perfil = await obterPerfilAtual();
            dispatch({ tipo: "AUTENTICAR", perfil });
        } catch (erro) {
            if (erroInvalidaSessao(erro)) {
                await removerToken();
                dispatch({ tipo: "NAO_AUTENTICAR" });
                return;
            }
            dispatch({ tipo: "ERRO_RESTAURACAO", mensagem: normalizarErro(erro) });
        }
    }, []);

    const entrar = useCallback(async (email: string, senha: string) => {
        const resposta = await entrarApi({ email, senha });
        if (!usuarioEhConsumidor(resposta.usuario.role)) {
            throw new ErroDominio("Este aplicativo é destinado aos consumidores.");
        }

        const perfil = await obterPerfilAtual(resposta.token);
        await salvarToken(resposta.token);
        dispatch({ tipo: "AUTENTICAR", perfil });
    }, []);

    const atualizarPerfil = useCallback(async () => {
        const perfil = await obterPerfilAtual();
        dispatch({ tipo: "AUTENTICAR", perfil });
    }, []);

    useEffect(() => {
        definirTratadorNaoAutorizado(sair);
        void restaurar();

        return () => definirTratadorNaoAutorizado(undefined);
    }, [restaurar, sair]);

    return (
        <ContextoSessao.Provider
            value={{ ...estado, entrar, sair, restaurar, atualizarPerfil }}
        >
            {children}
        </ContextoSessao.Provider>
    );
}

export function useSessao(): ContextoSessaoValor {
    const contexto = useContext(ContextoSessao);
    if (!contexto) {
        throw new Error("useSessao deve ser usado dentro de ProvedorSessao");
    }
    return contexto;
}
