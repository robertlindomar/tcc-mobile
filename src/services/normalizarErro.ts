import { ErroApi, ErroDominio } from "@/services/erros";

export const MENSAGEM_ERRO_CONEXAO =
    "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";

function mensagemHttp(status?: number, mensagemApi?: string): string {
    if (status === 401) {
        return "E-mail ou senha inválidos.";
    }
    if (status === 403) {
        return "Você não tem permissão para realizar esta ação.";
    }
    if (status === 404) {
        return "Não foi possível encontrar as informações solicitadas.";
    }
    if (status === 502) {
        return "Não foi possível validar o CEP agora. Tente novamente.";
    }
    if (status && status >= 500) {
        return "O servidor está indisponível no momento. Tente novamente.";
    }

    const mensagensConhecidas: Record<string, string> = {
        "Email ja cadastrado": "Este e-mail já está cadastrado.",
        "CPF ja cadastrado": "Este CPF já está cadastrado.",
        "Email ou CPF ja cadastrado": "Este e-mail ou CPF já está cadastrado.",
        "CEP invalido": "Informe um CEP válido.",
        "CEP nao encontrado": "Não encontramos esse CEP.",
        "Usuario inativo. Contate o administrador.":
            "Sua conta está inativa. Entre em contato com a administração.",
        "Este aplicativo e destinado aos consumidores":
            "Este aplicativo é destinado aos consumidores.",
    };

    return mensagensConhecidas[mensagemApi ?? ""] ?? "Não foi possível concluir a operação. Tente novamente.";
}

export function normalizarErro(erro: unknown): string {
    if (erro instanceof ErroApi) {
        if (erro.tipo === "REDE") {
            return MENSAGEM_ERRO_CONEXAO;
        }
        if (erro.tipo === "CONFIGURACAO") {
            return "A configuração da API está incompleta. Consulte o README do projeto.";
        }
        return mensagemHttp(erro.status, erro.message);
    }

    if (erro instanceof ErroDominio) {
        return erro.message;
    }

    return "Ocorreu um erro inesperado. Tente novamente.";
}

export function erroInvalidaSessao(erro: unknown): boolean {
    return (
        erro instanceof ErroApi &&
        erro.tipo === "HTTP" &&
        [401, 403, 404].includes(erro.status ?? 0)
    );
}
