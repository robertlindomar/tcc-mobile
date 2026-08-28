import { obterUrlApi } from "@/config/ambiente";
import { ErroApi } from "@/services/erros";
import { obterToken, removerToken } from "@/storage/token";

type MetodoHttp = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type OpcoesRequisicao = {
    metodo?: MetodoHttp;
    corpo?: unknown;
    token?: string;
};

type CorpoErro = {
    error?: string;
    disponivelEm?: string | null;
    frequencia?: string | null;
    repetivel?: boolean | null;
};

const TEMPO_LIMITE_MS = 12_000;
let aoNaoAutorizado: (() => Promise<void> | void) | undefined;

export function definirTratadorNaoAutorizado(
    tratador: (() => Promise<void> | void) | undefined,
): void {
    aoNaoAutorizado = tratador;
}

async function lerCorpo(response: Response): Promise<unknown> {
    if (response.status === 204) {
        return undefined;
    }

    const texto = await response.text();
    if (!texto) {
        return undefined;
    }

    try {
        return JSON.parse(texto) as unknown;
    } catch {
        return texto;
    }
}

function extrairMensagemErro(corpo: unknown): string {
    if (typeof corpo === "object" && corpo !== null && "error" in corpo) {
        const { error } = corpo as CorpoErro;
        if (typeof error === "string") {
            return error;
        }
    }

    return "Resposta inválida do servidor";
}

function extrairDisponivelEm(corpo: unknown): string | null | undefined {
    if (typeof corpo === "object" && corpo !== null && "disponivelEm" in corpo) {
        const { disponivelEm } = corpo as CorpoErro;
        if (disponivelEm === null || typeof disponivelEm === "string") {
            return disponivelEm;
        }
    }

    return undefined;
}

function extrairFrequencia(corpo: unknown): string | null | undefined {
    if (typeof corpo === "object" && corpo !== null && "frequencia" in corpo) {
        const { frequencia } = corpo as CorpoErro;
        if (frequencia === null || typeof frequencia === "string") {
            return frequencia;
        }
    }

    return undefined;
}

function extrairRepetivel(corpo: unknown): boolean | null | undefined {
    if (typeof corpo === "object" && corpo !== null && "repetivel" in corpo) {
        const { repetivel } = corpo as CorpoErro;
        if (repetivel === null || typeof repetivel === "boolean") {
            return repetivel;
        }
    }

    return undefined;
}

export async function requisitar<T>(
    caminho: string,
    opcoes: OpcoesRequisicao = {},
): Promise<T> {
    let url: string;
    try {
        url = `${obterUrlApi()}${caminho}`;
    } catch (erro) {
        throw new ErroApi(
            erro instanceof Error ? erro.message : "Configuração inválida",
            "CONFIGURACAO",
        );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TEMPO_LIMITE_MS);

    try {
        const token = opcoes.token ?? (await obterToken());
        const response = await fetch(url, {
            method: opcoes.metodo ?? "GET",
            headers: {
                Accept: "application/json",
                ...(opcoes.corpo !== undefined
                    ? { "Content-Type": "application/json" }
                    : {}),
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: opcoes.corpo === undefined ? undefined : JSON.stringify(opcoes.corpo),
            signal: controller.signal,
        });
        const corpo = await lerCorpo(response);

        if (!response.ok) {
            if (response.status === 401) {
                await removerToken();
                await aoNaoAutorizado?.();
            }

            throw new ErroApi(
                extrairMensagemErro(corpo),
                "HTTP",
                response.status,
                extrairDisponivelEm(corpo),
                extrairFrequencia(corpo),
                extrairRepetivel(corpo),
            );
        }

        return corpo as T;
    } catch (erro) {
        if (erro instanceof ErroApi) {
            throw erro;
        }

        throw new ErroApi("Falha de rede", "REDE");
    } finally {
        clearTimeout(timeout);
    }
}
