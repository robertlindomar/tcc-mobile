import { ErroApi, ErroDominio } from "@/services/erros";
import { formatarDisponibilidadeMissao, obterDataCivilSeguinteLocal } from "@/utils/formatarDisponibilidadeMissao";

export const MENSAGEM_ERRO_CONEXAO =
    "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";

const MENSAGEM_MISSAO_UNICA_API = "Missao ja concluida";
const MENSAGEM_MISSAO_PERIODO_API = "Missao ja concluida neste periodo";

const MENSAGEM_MISSAO_UNICA_CONCLUIDA = "Missão já concluída";

function mensagemRecompensaDisponivelEm(dataFormatada: string): string {
    return `Você já concluiu esta missão hoje. Recompensa disponível em ${dataFormatada}.`;
}

function mensagemMissaoRecorrente(disponivelEm?: string | null): string {
    if (disponivelEm) {
        return mensagemRecompensaDisponivelEm(formatarDisponibilidadeMissao(disponivelEm));
    }

    return mensagemRecompensaDisponivelEm(obterDataCivilSeguinteLocal());
}

function mensagemHttp(
    status?: number,
    mensagemApi?: string,
    disponivelEm?: string | null,
    repetivel?: boolean | null,
): string {
    if (status === 401) {
        return "E-mail ou senha inválidos.";
    }

    if (
        mensagemApi === MENSAGEM_MISSAO_UNICA_API ||
        repetivel === false
    ) {
        return MENSAGEM_MISSAO_UNICA_CONCLUIDA;
    }

    if (mensagemApi === MENSAGEM_MISSAO_PERIODO_API || repetivel === true) {
        return mensagemMissaoRecorrente(disponivelEm);
    }

    const mensagensConhecidas: Record<string, string> = {
        "Email ja cadastrado": "Este e-mail já está cadastrado.",
        "CPF ja cadastrado": "Este CPF já está cadastrado.",
        "Email ou CPF ja cadastrado": "Este e-mail ou CPF já está cadastrado.",
        "CEP invalido": "Informe um CEP válido.",
        "CEP nao encontrado": "Não encontramos esse CEP.",
        "Usuario inativo. Contate o administrador.":
            "Sua conta está inativa. Entre em contato com a administração.",
        "Pontos insuficientes": "Você não tem pontos suficientes.",
        "Recompensa esgotada": "Esta recompensa está esgotada.",
        "Recompensa expirada": "Esta recompensa expirou.",
        "Recompensa nao disponivel": "Esta recompensa não está disponível.",
        "Nota fiscal ja utilizada": "Esta nota fiscal já foi utilizada.",
        "Loja nao cadastrada": "Esta loja não está cadastrada no Conecta Comércio.",
        "Loja nao aprovada": "Esta loja ainda não está aprovada para a campanha.",
        "Loja nao participa desta campanha": "Esta loja não participa desta campanha.",
        "Data da compra fora do periodo da campanha":
            "A data da compra está fora do período da campanha.",
        "Nenhuma campanha vigente": "Não há campanha vigente no momento.",
        "Informe a campanha": "Há mais de uma campanha vigente. Selecione a campanha.",
        "Campanha nao encontrada": "Campanha não encontrada.",
        "Nota demo nao encontrada": "Nota de demonstração não encontrada.",
        "Chave de acesso da NFC-e invalida": "Chave de acesso da NFC-e inválida.",
        "payloadQr e obrigatorio": "Informe o QR code da nota fiscal.",
        "Payload da NFC-e e obrigatorio": "Informe o QR code da nota fiscal.",
        "Nao foi possivel ler a NFC-e": "Não foi possível ler a NFC-e. Tente novamente.",
    };

    if (mensagemApi && mensagensConhecidas[mensagemApi]) {
        return mensagensConhecidas[mensagemApi];
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

    return "Não foi possível concluir a operação. Tente novamente.";
}

export function normalizarErro(erro: unknown): string {
    if (erro instanceof ErroApi) {
        if (erro.tipo === "REDE") {
            return MENSAGEM_ERRO_CONEXAO;
        }
        if (erro.tipo === "CONFIGURACAO") {
            return "A configuração da API está incompleta. Consulte o README do projeto.";
        }
        return mensagemHttp(erro.status, erro.message, erro.disponivelEm, erro.repetivel);
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
